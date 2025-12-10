import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { Play, Info, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSliderProps {
  movies: Movie[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden">
      <div key={currentMovie.id} className="absolute inset-0 animate-fadeIn">
        <img 
          src={currentMovie.backdropUrl} 
          alt={currentMovie.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/40 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 right-0 w-full p-6 flex flex-col items-start justify-end md:w-1/2">
           <div className="flex items-center space-x-3 space-x-reverse mb-3">
               <span className="px-2.5 py-1 bg-primary rounded-lg text-[10px] md:text-xs font-bold uppercase text-white shadow-lg shadow-primary/40">
                   ویژه
               </span>
               {/* Enhanced Rating Badge */}
               <span className="flex items-center bg-yellow-500/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs md:text-sm font-bold text-yellow-400 border border-yellow-500/30 shadow-lg">
                    <Star size={14} className="fill-yellow-400 ml-1.5" />
                    {currentMovie.rating} امتیاز IMDB
               </span>
           </div>
           
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
             {currentMovie.title}
           </h2>
           <p className="text-gray-200 text-xs md:text-sm line-clamp-2 mb-6 max-w-xs md:max-w-lg drop-shadow-md leading-relaxed">
             {currentMovie.description}
           </p>
           
           <div className="flex items-center space-x-3 space-x-reverse">
             <button 
                onClick={() => navigate(`/movie/${currentMovie.id}`, { state: { movie: currentMovie } })}
                className="flex items-center bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-primary/30"
             >
               <Play size={18} className="ml-2 fill-white" />
               تماشا
             </button>
             <button 
                onClick={() => navigate(`/movie/${currentMovie.id}`, { state: { movie: currentMovie } })}
                className="flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-medium text-sm transition-transform active:scale-95 border border-white/10"
             >
               <Info size={18} className="ml-2" />
               اطلاعات
             </button>
           </div>
        </div>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-6 flex space-x-1.5 space-x-reverse">
        {movies.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary shadow-[0_0_10px_rgba(229,9,20,0.8)]' : 'w-1.5 bg-gray-500/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;