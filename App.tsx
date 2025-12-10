
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import AISearch from './pages/AISearch';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import { WatchlistProvider } from './context/WatchlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { app as firebaseApp } from './services/firebase'; // Import to ensure init

// Mock Pages for unfinished routes
const Placeholder = ({ title }: { title: string }) => (
    <div className="min-h-screen bg-dark-bg text-content-primary flex items-center justify-center flex-col md:pl-64 pb-20">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-content-secondary">این بخش در حال توسعه است</p>
    </div>
);

const App: React.FC = () => {
  
  useEffect(() => {
    // Firebase is initialized via the import.
    // You can trigger specific analytics events here if needed.
    console.log("Firebase initialized:", firebaseApp.name);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <WatchlistProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/ai" element={<AISearch />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/saved" element={<Saved />} />
              
              {/* Additional routes for new sections */}
              <Route path="/movies" element={<Placeholder title="فیلم‌ها" />} />
              <Route path="/series" element={<Placeholder title="سریال‌ها" />} />
              <Route path="/animation" element={<Placeholder title="انیمیشن" />} />
              <Route path="/free" element={<Placeholder title="رایگان" />} />
              <Route path="/trending" element={<Placeholder title="برترین‌ها" />} />
              <Route path="/new" element={<Placeholder title="تازه‌ها" />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </WatchlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;