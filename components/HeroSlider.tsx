import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { Play } from 'lucide-react';
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
    }, 6000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full aspect-[2/3] md:aspect-[21/9] max-h-[55vh] overflow-hidden">
      <div key={currentMovie.id} className="absolute inset-0 animate-fadeIn">
        <img 
          src={currentMovie.posterUrl} // Mobile usually uses poster in hero for vertical impact, or backdrop if provided separately
          alt={currentMovie.title} 
          className="w-full h-full object-cover"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-dark-bg" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center z-10">
           
           <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
             {currentMovie.title}
           </h2>
           
           <div className="flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-300 mb-6">
               <span>{currentMovie.year}</span>
               <span>•</span>
               <span>{currentMovie.type === 'series' ? 'سریال' : 'فیلم'}</span>
               {currentMovie.genres.length > 0 && (
                   <>
                       <span>•</span>
                       <span>{currentMovie.genres[0]}</span>
                   </>
               )}
           </div>
           
           <button 
                onClick={() => navigate(`/movie/${currentMovie.id}`, { state: { movie: currentMovie } })}
                className="flex items-center bg-[#4355ff] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#4355ff]/30 active:scale-95 transition-transform"
             >
               <Play size={18} className="ml-2 fill-white" />
               تماشا کنید
           </button>
        </div>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1.5 space-x-reverse z-20">
        {movies.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;