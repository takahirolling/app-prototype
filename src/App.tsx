import { TabBar } from './components/TabBar';
import { HomePage } from './components/HomePage';
import { DiscoverPage } from './components/DiscoverPage';
import { MemoryPage } from './components/MemoryPage';
import { ProfilePage } from './components/ProfilePage';
import { useAppState } from './store';

function App() {
  const state = useAppState();

  const handleNavigateToDiscover = () => {
    state.setCurrentTab('discover');
    state.navigateToSwipe();
  };

  const handleCardClickFromHome = (cardId: string) => {
    state.setCurrentTab('discover');
    state.navigateToDetail(cardId);
  };

  return (
    <div className="min-h-dvh bg-white">
      {/* Page Content */}
      <main>
        {state.currentTab === 'home' && (
          <HomePage
            vehicle={state.vehicle}
            profile={state.profile}
            discoverCards={state.discoverCards}
            unreadCount={state.unreadCount}
            onNavigateToDiscover={handleNavigateToDiscover}
            onCardClick={handleCardClickFromHome}
          />
        )}

        {state.currentTab === 'discover' && (
          <DiscoverPage
            cards={state.getFilteredCards()}
            allCards={state.discoverCards}
            favorites={state.favorites}
            subPage={state.discoverSubPage}
            selectedCardId={state.selectedCardId}
            activeFilter={state.activeFilter}
            onSwipe={state.handleSwipe}
            onNavigateToDetail={state.navigateToDetail}
            onNavigateToFavorites={state.navigateToFavorites}
            onNavigateToSwipe={state.navigateToSwipe}
            onRemoveFavorite={state.removeFavorite}
            onFilterChange={state.setActiveFilter}
            preferenceStats={state.getPreferenceStats()}
          />
        )}

        {state.currentTab === 'memory' && <MemoryPage />}

        {state.currentTab === 'profile' && (
          <ProfilePage
            profile={state.profile}
            vehicle={state.vehicle}
            favoriteCount={state.favorites.length}
            swipeCount={state.swipeHistory.length}
          />
        )}
      </main>

      {/* Tab Bar */}
      <TabBar
        currentTab={state.currentTab}
        onTabChange={(tab) => {
          state.setCurrentTab(tab);
          if (tab === 'discover') {
            state.navigateToSwipe();
          }
        }}
        unreadCount={state.unreadCount}
      />
    </div>
  );
}

export default App;
