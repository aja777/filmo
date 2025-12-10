
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import HeroSlider from '../components/HeroSlider';
import MovieCard from '../components/MovieCard';
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
          api.getMovies(1, 40),
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

  // Sections Data Logic
  const heroSlides = movies.slice(0, 5);
  
  // Latest Arrivals (Since API returns sorted by date DESC, the first 10 items are the newest)
  const newArrivals = movies.slice(0, 10);

  const latestMovies = movies.filter(m => (!m.type || m.type === 'movie') && !m.isFree).slice(0, 10);
  const series = movies.filter(m => m.type === 'series' || m.genres.includes('سریال')).slice(0, 10);
  const animations = movies.filter(m => m.type === 'animation' || m.genres.includes('انیمیشن')).slice(0, 10);
  const freeMovies = movies.filter(m => m.isFree).slice(0, 10);

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
      <div className="w-full pb-24 md:pl-64 relative">
        
        {/* Custom Header (Absolute Overlay) */}
        <div className="absolute top-0 left-0 right-0 z-30 px-4 py-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
             {/* Left Icons */}
            <div className="flex items-center space-x-4 space-x-reverse">
                <button className="text-white hover:text-primary transition-colors relative">
                    <Bell size={26} />
                    <span className="absolute top-0 right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-black"></span>
                </button>
                <button onClick={() => navigate('/search')} className="text-white hover:text-primary transition-colors">
                    <Search size={26} />
                </button>
            </div>
             {/* Right Logo */}
            <div className="text-white font-extrabold text-xl tracking-tight drop-shadow-lg">
                کیامووی
            </div>
        </div>

        <HeroSlider movies={heroSlides} />
        
        {/* Weekly Schedule Banner - Dark Blue Box */}
        <div className="px-4 mt-6">
            <div className="bg-[#1e2336] rounded-xl py-4 flex flex-col items-center justify-center space-y-2 cursor-pointer shadow-lg active:scale-98 transition-transform">
                <Clapperboard size={36} className="text-[#4355ff] fill-[#4355ff]/20" />
                <span className="text-gray-200 font-medium text-xs">برنامه پخش هفتگی سریال ها</span>
            </div>
        </div>

        {/* New Arrivals Section (Added) */}
        <Section title="تازه ها" link="/new">
            {newArrivals.map(movie => (
                <div className="mr-3 ml-1" key={`new-${movie.id}`}>
                    <MovieCard movie={movie} />
                </div>
            ))}
        </Section>

        {/* Latest Movies Section */}
        <Section title="فیلم" link="/movies">
            {latestMovies.map(movie => (
                <div className="mr-3 ml-1" key={movie.id}>
                    <MovieCard movie={movie} />
                </div>
            ))}
        </Section>

        {/* Series Section */}
        {series.length > 0 && (
            <Section title="سریال" link="/series">
                {series.map(movie => (
                    <div className="mr-3 ml-1" key={`series-${movie.id}`}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </Section>
        )}

        {/* Animation Section */}
        {animations.length > 0 && (
            <Section title="انیمیشن" link="/animation">
                {animations.map(movie => (
                    <div className="mr-3 ml-1" key={`anim-${movie.id}`}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </Section>
        )}

        {/* Free Section */}
        {freeMovies.length > 0 && (
             <Section title="رایگان" link="/free">
                {freeMovies.map(movie => (
                    <div className="mr-3 ml-1" key={`free-${movie.id}`}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </Section>
        )}

        {/* Dynamic Category Sections */}
        {categories.map(cat => {
            const catMovies = movies.filter(m => m.genres.includes(cat.name));
            if (catMovies.length === 0) return null;
            
            return (
                <Section key={cat.id} title={cat.name} link={`/search?genre=${cat.name}`}>
                    {catMovies.map(movie => (
                        <div className="mr-3 ml-1" key={`cat-${cat.id}-${movie.id}`}>
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </Section>
            );
        })}

        {/* Categories List (Vertical Buttons at bottom) */}
        <div className="mt-8 px-4 border-t border-white/5 pt-6">
             <div className="flex justify-between items-center mb-4">
                 <h2 className="text-sm font-bold text-gray-300">دسته‌بندی‌ها</h2>
             </div>
             <div className="flex flex-col space-y-2">
                {categories.slice(0, 8).map(cat => (
                     <button 
                        key={cat.id} 
                        onClick={() => navigate('/search')}
                        className="w-full bg-[#181a20] text-gray-400 py-3.5 px-4 rounded-xl text-xs font-medium hover:bg-[#22252b] hover:text-white transition-all flex justify-between items-center"
                     >
                        <span>{cat.name}</span>
                        <ChevronLeft size={16} className="opacity-50" />
                    </button>
                ))}
             </div>
        </div>
      </div>
    </Layout>
  );
};

const Section = ({ title, link, children }: { title: string, link: string, children?: React.ReactNode }) => {
    if (React.Children.count(children) === 0) return null;
    return (
        <div className="mt-8 border-t border-white/5 pt-4">
            <div className="flex justify-between items-center px-4 mb-3">
                <h2 className="text-base font-bold text-gray-100">{title}</h2>
                <button className="text-xs text-[#526085] flex items-center hover:text-white transition-colors">
                    مشاهده همه
                    <ChevronLeft size={14} />
                </button>
            </div>
            <div className="flex overflow-x-auto no-scrollbar pb-2 pr-4 pl-4 -ml-0">
                {children}
            </div>
        </div>
    );
};

export default Home;
