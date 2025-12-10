import React from 'react';
import Layout from '../components/Layout';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import { Bookmark, Film } from 'lucide-react';

const Saved: React.FC = () => {
  const { savedMovies } = useWatchlist();

  return (
    <Layout>
      <div className="min-h-screen bg-dark-bg md:pl-64 pt-6 px-4 pb-24 transition-colors duration-300">
         <div className="flex items-center space-x-3 space-x-reverse mb-6">
             <Bookmark className="text-primary" size={24} />
             <h1 className="text-2xl font-bold text-content-primary">لیست تماشا</h1>
         </div>

         {savedMovies.length > 0 ? (
             <>
                <p className="text-content-secondary text-sm mb-6">
                    {savedMovies.length} فیلم در لیست شما موجود است
                </p>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5 animate-fadeIn">
                    {savedMovies.map(movie => (
                        <div key={movie.id} className="w-full">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
             </>
         ) : (
             <div className="flex flex-col items-center justify-center h-[60vh] text-content-secondary">
                 <div className="w-20 h-20 bg-dark-surface rounded-full flex items-center justify-center mb-4 border border-separator">
                     <Film size={40} className="opacity-30" />
                 </div>
                 <h3 className="text-lg font-bold text-content-primary mb-2">لیست شما خالی است</h3>
                 <p className="text-sm text-center max-w-xs">
                     فیلم‌های مورد علاقه خود را با زدن دکمه قلب در صفحه فیلم به اینجا اضافه کنید.
                 </p>
             </div>
         )}
      </div>
    </Layout>
  );
};

export default Saved;