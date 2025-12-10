import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie } from '../types';

interface WatchlistContextType {
  savedMovies: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kia_watchlist');
    if (saved) {
      try {
        setSavedMovies(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse watchlist", e);
      }
    }
  }, []);

  // Save to local storage whenever list changes
  useEffect(() => {
    localStorage.setItem('kia_watchlist', JSON.stringify(savedMovies));
  }, [savedMovies]);

  const addToWatchlist = (movie: Movie) => {
    setSavedMovies((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (movieId: string) => {
    setSavedMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isInWatchlist = (movieId: string) => {
    return savedMovies.some((m) => m.id === movieId);
  };

  return (
    <WatchlistContext.Provider value={{ savedMovies, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
