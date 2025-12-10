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

  if (variant === 'landscape') {
    return (
      <div onClick={handleClick} className="relative flex-shrink-0 w-72 h-40 rounded-xl overflow-hidden mr-4 cursor-pointer group shadow-md hover:shadow-primary/30 transition-all duration-300">
        <img 
          src={movie.backdropUrl || movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
           <PlayCircle size={40} className="text-white drop-shadow-lg" fill="rgba(229, 9, 20, 0.8)" />
        </div>
        
        {/* Free Badge */}
        {movie.isFree && (
             <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-20 shadow-sm">
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
                {/* Badges for Landscape */}
                 {movie.hasDubbing && movie.hasSubtitle ? (
                    <span className="bg-green-600 text-[9px] px-1.5 py-0.5 rounded text-white font-bold mr-1">دوبله + زیرنویس</span>
                 ) : movie.hasDubbing ? (
                    <span className="bg-green-600 text-[9px] px-1.5 py-0.5 rounded text-white font-bold mr-1">دوبله</span>
                 ) : movie.hasSubtitle ? (
                    <span className="bg-red-600 text-[9px] px-1.5 py-0.5 rounded text-white font-bold mr-1">زیرنویس</span>
                 ) : null}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleClick} className="relative flex-shrink-0 w-32 md:w-44 flex flex-col cursor-pointer group snap-start">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-card mb-2 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300 ring-0 group-hover:ring-2 ring-primary/50">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-[2px]"
          loading="lazy"
        />
        
        {/* Center Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 scale-0 group-hover:scale-100 transform">
             <div className="bg-primary/90 rounded-full p-2 shadow-lg">
                 <PlayCircle size={32} className="text-white fill-white" />
             </div>
        </div>

        {/* Badges Container (Top Right) */}
        <div className="absolute top-1 right-1 flex flex-col items-end gap-1 z-20">
             {/* Combined Logic for Badges */}
             {movie.hasDubbing && movie.hasSubtitle ? (
                 <span className="bg-green-600 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                     دوبله + زیرنویس
                 </span>
             ) : movie.hasDubbing ? (
                 <span className="bg-green-600 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                     دوبله فارسی
                 </span>
             ) : movie.hasSubtitle ? (
                 <span className="bg-red-600 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                     زیرنویس فارسی
                 </span>
             ) : null}
        </div>

        {/* Free Badge (Top Left) */}
        {movie.isFree && (
            <div className="absolute top-1 left-1 z-20">
                <span className="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">رایگان</span>
            </div>
        )}

        {/* Rating Badge (Bottom Left - Yellow Pill) */}
        <div className="absolute bottom-2 left-2 z-20">
             <div className="bg-yellow-400 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center shadow-md">
                 {movie.rating} <span className="text-[8px] opacity-70 scale-75">/10</span>
             </div>
        </div>
      </div>
      
      <h3 className="text-content-primary font-bold text-xs md:text-sm truncate pl-1 transition-colors group-hover:text-primary mt-1 text-center">{movie.title}</h3>
      <div className="flex justify-center items-center px-1 mt-0.5">
         <p className="text-content-secondary text-[10px] md:text-xs truncate">{movie.type === 'series' ? 'سریال' : 'فیلم'} {movie.year}</p>
      </div>
    </div>
  );
};

export default MovieCard;