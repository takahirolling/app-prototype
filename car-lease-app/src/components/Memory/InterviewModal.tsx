import { useState } from 'react';
import { X, Mic, MicOff, Send, MessageCircle } from 'lucide-react';
import type { Trip, VoiceMemo } from '../../types';
import { interviewQuestions } from '../../data/mockData';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface InterviewModalProps {
  trip: Trip;
  onClose: () => void;
  onSave: (memo: VoiceMemo) => void;
}

export function InterviewModal({ trip, onClose, onSave }: InterviewModalProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  const currentQuestion = interviewQuestions[questionIndex];
  const isLast = questionIndex >= interviewQuestions.length - 1;

  const displayAnswer = isListening ? (transcript || currentAnswer) : currentAnswer;

  const handleNext = () => {
    const answer = transcript || currentAnswer;
    if (!answer.trim()) return;

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (isLast) {
      const fullText = newAnswers.map((a, i) =>
        `Q: ${interviewQuestions[i]}\nA: ${a}`
      ).join('\n\n');

      onSave({
        id: `v-${Date.now()}`,
        text: fullText,
        timestamp: Date.now(),
      });
    } else {
      setQuestionIndex(questionIndex + 1);
      setCurrentAnswer('');
      resetTranscript();
      if (isListening) stopListening();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end animate-fade-in">
      <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-forest-600" />
            <h3 className="font-bold text-gray-800">思い出インタビュー</h3>
          </div>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5">
          {/* Trip context */}
          <div className="bg-warm-50 rounded-xl p-3 mb-4 text-center">
            <p className="text-xs text-gray-500">{trip.date}</p>
            <p className="font-medium text-gray-800">{trip.title}</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-5">
            {interviewQuestions.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= questionIndex ? 'bg-forest-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Previous Q&As */}
          {answers.map((answer, i) => (
            <div key={i} className="mb-3">
              <p className="text-xs text-gray-500 mb-1">{interviewQuestions[i]}</p>
              <div className="bg-forest-50 rounded-lg p-2.5">
                <p className="text-sm text-gray-700">{answer}</p>
              </div>
            </div>
          ))}

          {/* Current question */}
          <div className="mb-4">
            <div className="bg-forest-100 rounded-2xl rounded-bl-sm p-4 mb-3">
              <p className="text-sm text-forest-800 font-medium">{currentQuestion}</p>
            </div>

            <textarea
              value={displayAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="感想を入力してください..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-forest-400"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {isSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-3 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-sunset-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!displayAnswer.trim()}
              className="flex-1 bg-forest-500 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-medium disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
            >
              <Send className="w-4 h-4" />
              {isLast ? '保存する' : '次の質問へ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
