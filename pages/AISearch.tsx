import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';
import { searchMoviesWithAI } from '../services/geminiService';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';

const AISearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResults([]); // clear previous

    try {
      const movies = await searchMoviesWithAI(query);
      setResults(movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-dark-bg md:pl-64 flex flex-col transition-colors duration-300">
         {/* Header */}
         <div className="p-6 pt-10 pb-4">
             <div className="flex items-center space-x-3 space-x-reverse mb-2">
                 <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Sparkles className="text-white" size={20} />
                 </div>
                 <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                     دستیار هوشمند کیامووی
                 </h1>
             </div>
             <p className="text-content-secondary text-sm">هر چه در ذهن دارید بپرسید، من فیلم مناسب را پیدا می‌کنم.</p>
         </div>

         {/* Chat Area - Results */}
         <div className="flex-1 px-4 pb-24 overflow-y-auto no-scrollbar">
            {!hasSearched ? (
                <div className="flex flex-col items-center justify-center h-64 opacity-50">
                    <Bot size={64} className="text-content-secondary mb-4" />
                    <p className="text-content-secondary text-center text-sm">
                        مثال: "یک فیلم غمگین عاشقانه مثل نوت بوک معرفی کن" <br/>
                        یا "فیلم های اکشن سال 2023 با امتیاز بالا"
                    </p>
                </div>
            ) : null}

            {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-primary mb-4" size={32} />
                    <p className="text-content-secondary text-sm animate-pulse">در حال مشورت با هوش مصنوعی...</p>
                </div>
            )}

            {!loading && hasSearched && results.length === 0 && (
                <div className="text-center py-20 text-content-secondary">
                    موردی یافت نشد. لطفا سوال خود را تغییر دهید.
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
                    {results.map(movie => (
                         <div key={movie.id} className="w-full">
                            <MovieCard movie={movie} />
                         </div>
                    ))}
                </div>
            )}
         </div>

         {/* Input Area */}
         <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-64 p-4 bg-dark-surface/90 backdrop-blur-lg border-t border-separator z-40 transition-colors duration-300">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="امروز چه حس و حالی داری؟"
                    className="w-full bg-dark-card border border-separator rounded-2xl py-4 pl-12 pr-4 text-content-primary placeholder-content-secondary focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-xl"
                />
                <button 
                    type="submit" 
                    disabled={loading || !query.trim()}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="rtl:-scale-x-100" />}
                </button>
            </form>
         </div>
      </div>
    </Layout>
  );
};

export default AISearch;