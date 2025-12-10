import React from 'react';
import { Movie } from '../types';
import { Star, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
  variant?: 'portrait' | 'landscape';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, variant = 'portrait' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  // Landscape Card (Horizontal List items)
  if (variant === 'landscape') {
    return (
      <div onClick={handleClick} className="relative flex-shrink-0 w-72 h-40 rounded-xl overflow-hidden mr-4 cursor-pointer group shadow-md hover:shadow-primary/30 transition-all duration-300 border border-transparent hover:border-primary/30">
        <img 
          src={movie.backdropUrl || movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
           <PlayCircle size={40} className="text-white drop-shadow-lg" fill="rgba(16, 185, 129, 0.8)" />
        </div>
        {movie.isFree && (
             <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-20 shadow-sm">
                 رایگان
             </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3">
            <h3 className="text-white font-bold text-sm truncate">{movie.title}</h3>
            <div className="flex items-center text-xs text-gray-300 mt-1 space-x-2 space-x-reverse">
                <span className="flex items-center text-yellow-400 font-bold">
                    <Star size={12} className="fill-yellow-400 ml-1" /> {movie.rating}
                </span>
                <span>• {movie.year}</span>
            </div>
        </div>
      </div>
    );
  }

  // Portrait Card (Standard)
  return (
    <div onClick={handleClick} className="relative flex-shrink-0 w-32 md:w-40 flex flex-col cursor-pointer group snap-start">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-card mb-2 shadow-lg group-hover:shadow-xl transition-all duration-300">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges Container (Top Right) */}
        <div className="absolute top-0 right-0 flex flex-col items-end z-20">
             {/* If has BOTH Dubbing and Subtitle -> Green 'دوبله + زیرنویس' */}
             {movie.hasDubbing && movie.hasSubtitle ? (
                 <span className="bg-[#10B981] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                     دوبله + زیرنویس
                 </span>
             ) : (
                 <>
                    {/* Only Dubbing -> Green */}
                    {movie.hasDubbing && (
                        <span className="bg-[#10B981] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                            دوبله فارسی
                        </span>
                    )}
                    {/* Only Subtitle -> Red */}
                    {movie.hasSubtitle && (
                        <span className="bg-[#EF4444] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                            زیرنویس فارسی
                        </span>
                    )}
                 </>
             )}
        </div>

        {/* Rating Badge (Bottom Left - Yellow Pill) */}
        <div className="absolute bottom-2 left-2 z-20">
             <div className="bg-[#FACC15] text-black text-[11px] font-extrabold px-2 py-0.5 rounded-md flex items-center shadow-md">
                 {movie.rating}<span className="text-[9px] opacity-80 scale-90">/10</span>
             </div>
        </div>
      </div>
      
      <h3 className="text-gray-100 font-medium text-xs md:text-sm truncate text-right">{movie.title}</h3>
      <div className="flex justify-start items-center mt-0.5">
         <p className="text-gray-500 text-[10px] truncate">
            {movie.type === 'series' ? 'سریال' : movie.type === 'animation' ? 'انیمیشن' : 'فیلم'} {movie.title} {movie.year}
         </p>
      </div>
    </div>
  );
};

export default MovieCard;