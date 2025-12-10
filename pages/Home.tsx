
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import HeroSlider from '../components/HeroSlider';
import MovieCard from '../components/MovieCard';
import AdBanner from '../components/AdBanner';
import { api } from '../services/api';
import { Movie, Category } from '../types';
import { ChevronLeft, Bell, Search, Clapperboard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [moviesData, catsData] = await Promise.all([
          api.getMovies(1, 10),
          api.getCategories()
        ]);
        setMovies(moviesData.items);
        setCategories(catsData);
      } catch (error) {
        console.error("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter based on fetched data
  // Note: Since API returns mixed content, we simulate filtering here for the UI
  // In a real app, you would call api.getMovies({ category: 'series' })
  const latestMovies = movies.filter(m => !m.type || m.type === 'movie');
  // For demo, if we don't have enough data, we reuse movies
  const heroSlides = movies.slice(0, 5);
  
  // Fake "Series" and "Animation" if API doesn't return them specifically yet
  // Or filter if the API returns categories
  const series = movies.filter(m => m.genres.includes('سریال') || m.type === 'series');
  const animations = movies.filter(m => m.genres.includes('انیمیشن') || m.type === 'animation');

  if (loading) {
      return (
          <Layout>
              <div className="w-full h-screen flex items-center justify-center bg-dark-bg md:pl-64">
                  <Loader2 className="animate-spin text-primary" size={40} />
              </div>
          </Layout>
      );
  }

  return (
    <Layout>
      <div className="w-full pb-24 md:pl-64">
        
        {/* Custom Header (Mobile) */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent md:hidden">
            <div className="text-white font-bold text-xl tracking-wide drop-shadow-md">
                کیامووی
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
                <button onClick={() => navigate('/search')} className="text-white hover:text-primary transition-colors drop-shadow-md">
                    <Search size={24} />
                </button>
                <button className="text-white hover:text-primary transition-colors drop-shadow-md relative">
                    <Bell size={24} />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-black"></span>
                </button>
            </div>
        </div>

        <HeroSlider movies={heroSlides} />
        
        {/* Weekly Schedule Banner */}
        <div className="px-4 mt-6">
            <div className="bg-dark-surface border border-separator rounded-xl p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-content-primary/5 transition-colors shadow-lg group">
                <Clapperboard size={32} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-content-primary font-bold text-sm">برنامه پخش هفتگی سریال ها</span>
            </div>
        </div>

        {/* Categories Pills */}
        <div className="mt-6 px-4">
             <div className="flex justify-between items-center mb-3">
                 <h2 className="text-sm font-bold text-content-secondary">دسته‌بندی‌ها</h2>
                 <button onClick={() => navigate('/search')} className="text-xs text-primary">مشاهده همه</button>
             </div>
             <div className="grid grid-cols-3 gap-2">
                {categories.slice(0, 6).map(cat => (
                     <button key={cat.id} className="bg-dark-surface border border-separator text-content-secondary py-2.5 rounded-lg text-xs font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors">
                        {cat.name}
                    </button>
                ))}
                {categories.length === 0 && (
                    <>
                        <button className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 py-2.5 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors">فیلم</button>
                        <button className="bg-purple-600/20 border border-purple-500/30 text-purple-400 py-2.5 rounded-lg text-xs font-bold hover:bg-purple-600 hover:text-white transition-colors">سریال</button>
                        <button className="bg-pink-600/20 border border-pink-500/30 text-pink-400 py-2.5 rounded-lg text-xs font-bold hover:bg-pink-600 hover:text-white transition-colors">انیمیشن</button>
                    </>
                )}
             </div>
        </div>

        {/* Ad Banner */}
        <div className="px-4">
           <AdBanner />
        </div>

        {/* Featured Landscape Section */}
        <div className="mt-2 px-4">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-bold text-content-primary border-r-4 border-primary pr-3">پیشنهاد ویژه کیامووی</h2>
            </div>
            <div className="flex overflow-x-auto no-scrollbar pb-4 -mr-4 pr-4 pl-4">
                 {movies.map(movie => (
                    <MovieCard key={`land-${movie.id}`} movie={movie} variant="landscape" />
                ))}
            </div>
         </div>

        {/* Latest Movies Section */}
        <Section title="تازه ترین فیلم ها" link="/movies">
            {latestMovies.map(movie => (
                <div className="mr-4" key={movie.id}>
                    <MovieCard movie={movie} />
                </div>
            ))}
        </Section>

        {/* Ad Banner */}
        <div className="px-4 mt-4">
           <AdBanner format="rectangle" className="hidden md:flex" />
        </div>

        {/* Series Section */}
        {series.length > 0 && (
            <Section title="سریال های بروز" link="/series">
                {series.map(movie => (
                    <div className="mr-4" key={`series-${movie.id}`}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </Section>
        )}

        {/* Animation Section */}
        {animations.length > 0 && (
            <Section title="انیمیشن" link="/animation">
                {animations.map(movie => (
                    <div className="mr-4" key={`anim-${movie.id}`}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </Section>
        )}

      </div>
    </Layout>
  );
};

const Section = ({ title, link, children }: { title: string, link: string, children?: React.ReactNode }) => {
    if (React.Children.count(children) === 0) return null;
    return (
        <div className="mt-6 border-t border-separator/50 pt-6">
            <div className="flex justify-between items-center px-4 mb-4">
                <h2 className="text-lg font-bold text-content-primary border-r-4 border-primary pr-3">{title}</h2>
                <button className="text-xs text-primary flex items-center hover:underline">
                    مشاهده همه
                    <ChevronLeft size={14} />
                </button>
            </div>
            <div className="flex overflow-x-auto no-scrollbar pb-4 pr-4 -ml-4 pl-4">
                {children}
            </div>
        </div>
    );
};

export default Home;