// Watchlist functionality using localStorage
const WATCHLIST_KEY = 'crypto_watchlist';

// Get watchlist from localStorage
export const getWatchlist = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const watchlist = localStorage.getItem(WATCHLIST_KEY);
    return watchlist ? JSON.parse(watchlist) : [];
  } catch (error) {
    console.error('Error reading watchlist from localStorage:', error);
    return [];
  }
};

// Save watchlist to localStorage
const saveWatchlist = (watchlist) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  } catch (error) {
    console.error('Error saving watchlist to localStorage:', error);
  }
};

// Add coin to watchlist
export const addToWatchlist = (coinId) => {
  const watchlist = getWatchlist();
  if (!watchlist.includes(coinId)) {
    watchlist.push(coinId);
    saveWatchlist(watchlist);
  }
};

// Remove coin from watchlist
export const removeFromWatchlist = (coinId) => {
  const watchlist = getWatchlist();
  const updatedWatchlist = watchlist.filter(id => id !== coinId);
  saveWatchlist(updatedWatchlist);
};

// Check if coin is in watchlist
export const isCoinInWatchlist = (coinId) => {
  const watchlist = getWatchlist();
  return watchlist.includes(coinId);
};

// Get all watchlist items
export const getWatchlistItems = () => {
  return getWatchlist();
};

// Clear entire watchlist
export const clearWatchlist = () => {
  saveWatchlist([]);
};
