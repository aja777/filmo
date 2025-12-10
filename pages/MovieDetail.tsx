
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Movie, Comment } from '../types';
import { MOCK_COMMENTS, MOCK_USER } from '../constants';
import { ArrowRight, Star, Calendar, Clock, PlayCircle, Download, Share2, Heart, Info, ThumbsUp, ThumbsDown, MessageCircle, MoreVertical, Send, User, MessageSquare } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import VideoPlayer from '../components/VideoPlayer';

const MovieDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie as Movie;
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  // Comment State
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');

  if (!movie) {
    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center text-content-primary">
            <p>Movie not found</p>
            <button onClick={() => navigate('/')} className="text-primary mt-4">Go Home</button>
        </div>
    );
  }

  const isSaved = isInWatchlist(movie.id);

  const toggleSave = () => {
    if (isSaved) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `فیلم ${movie.title} را در کیامووی تماشا کنید`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: MOCK_USER.id,
      userName: MOCK_USER.name,
      userAvatar: MOCK_USER.avatar,
      content: newComment,
      date: 'لحظاتی پیش',
      likes: 0
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-content-primary pb-safe transition-colors duration-300">
      {/* Header Image */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
         <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
             <button onClick={() => navigate(-1)} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                 <ArrowRight size={24} />
             </button>
             <div className="flex space-x-3 space-x-reverse">
                <button onClick={handleShare} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                    <MoreVertical size={20} />
                </button>
             </div>
         </div>
         <img src={movie.posterUrl} className="w-full h-full object-cover filter brightness-75" alt={movie.title} />
         <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
         
         <div className="absolute bottom-0 right-0 w-full p-6">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white drop-shadow-md leading-tight">{movie.title}</h1>
            <p className="text-gray-300 text-sm mb-4 dir-ltr text-right opacity-80">{movie.originalTitle}</p>
            <p className="text-xs text-primary font-bold mb-2">{movie.year}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-white mb-6">
                <span className="flex items-center text-yellow-400 font-bold text-base">
                    <Star size={16} className="fill-yellow-400 ml-1.5" /> {movie.rating}
                </span>
                
                {movie.type === 'series' && (
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded">فصل ۱ قسمت ۲ اضافه شد</span>
                )}
                
                <span className="flex items-center">
                    <div className="w-4 h-4 bg-white text-black rounded-sm flex items-center justify-center font-bold ml-1 text-[10px]">HD</div>
                    100%
                </span>

                <div className="flex items-center space-x-2 space-x-reverse">
                     {movie.hasSubtitle && <span className="flex items-center border border-white/30 rounded px-1.5 py-0.5"><span className="ml-1">CC</span> زیرنویس فارسی</span>}
                </div>
            </div>

            <div className="flex space-x-2 space-x-reverse mb-6">
                {movie.genres.map(g => (
                    <span key={g} className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white border border-white/5">
                        {g}
                    </span>
                ))}
            </div>
         </div>
      </div>

      <div className="px-6 -mt-2 relative z-10 space-y-8 pb-20">
          
          <p className="text-gray-300 text-sm leading-7 text-justify opacity-90">
             {movie.description}
          </p>

          {/* Interaction Bar */}
          <div className="flex justify-around items-center py-4 border-y border-separator">
              <button className="flex flex-col items-center space-y-1 text-content-secondary hover:text-content-primary">
                  <div className="p-2 bg-white/5 rounded-full"><ThumbsUp size={20} /></div>
              </button>
              <button className="flex flex-col items-center space-y-1 text-content-secondary hover:text-content-primary">
                  <div className="p-2 bg-white/5 rounded-full"><ThumbsDown size={20} /></div>
              </button>
              <button className="flex flex-col items-center space-y-1 text-content-secondary hover:text-content-primary">
                  <div className="p-2 bg-white/5 rounded-full"><MessageCircle size={20} /></div>
              </button>
              <button className="flex flex-col items-center space-y-1 text-content-secondary hover:text-content-primary">
                  <div className="p-2 bg-white/5 rounded-full"><Share2 size={20} /></div>
              </button>
              <button onClick={toggleSave} className={`flex flex-col items-center space-y-1 ${isSaved ? 'text-primary' : 'text-content-secondary'} hover:text-primary`}>
                  <div className="p-2 bg-white/5 rounded-full"><Heart size={20} className={isSaved ? "fill-current" : ""} /></div>
              </button>
          </div>

          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-separator">
                <button className="flex-1 pb-3 border-b-2 border-primary text-content-primary font-bold text-sm">دانلود و تماشا</button>
                <button className="flex-1 pb-3 text-content-secondary font-medium text-sm">جزئیات</button>
                <button className="flex-1 pb-3 text-content-secondary font-medium text-sm">موارد مشابه</button>
                <button className="flex-1 pb-3 text-content-secondary font-medium text-sm">نظرات</button>
            </div>

            {/* Video Player */}
            <div className="rounded-xl overflow-hidden shadow-2xl border border-separator">
                <VideoPlayer posterUrl={movie.backdropUrl} streamLinks={movie.streamLinks} />
            </div>

            {/* Download Links */}
            <div className="space-y-3">
                <button 
                    onClick={() => {
                        const playerElement = document.querySelector('video');
                        if (playerElement) {
                            playerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            playerElement.play().catch(e => console.log(e));
                        }
                    }}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-lg flex items-center justify-center transition-colors mb-4 shadow-lg shadow-primary/20"
                >
                    <PlayCircle size={20} className="ml-2 fill-white text-primary" />
                    پخش آنلاین
                </button>

                <div className="grid grid-cols-1 gap-3">
                     {movie.downloadLinks && movie.downloadLinks.length > 0 ? (
                        movie.downloadLinks.map((link, index) => (
                             <a 
                                key={index} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-[#3f4ab9] rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-[#323b96] transition-colors shadow-md group"
                             >
                                <div className="flex flex-col items-start">
                                    <span className="text-white text-xs font-bold">دانلود با کیفیت {link.quality}</span>
                                    <span className="text-white/70 text-[10px]">حجم: {link.size}</span>
                                </div>
                                <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-white/20 transition-colors">
                                    <Download size={18} className="text-white" />
                                </div>
                            </a>
                        ))
                     ) : (
                         <div className="text-center p-4 border border-dashed border-separator rounded-lg text-content-secondary text-sm">
                             لینک دانلودی برای این فیلم یافت نشد
                         </div>
                     )}
                </div>
            </div>

            {/* Additional Info */}
            <section>
                <h3 className="text-lg font-bold mb-2 text-content-primary">عوامل سازنده</h3>
                <div className="flex items-center space-x-4 space-x-reverse overflow-x-auto no-scrollbar pb-2">
                    {movie.director && (
                        <div className="flex-shrink-0 text-center">
                             <div className="w-16 h-16 rounded-full bg-dark-surface border border-separator mb-2 overflow-hidden mx-auto">
                                <img src={`https://ui-avatars.com/api/?name=${movie.director}&background=random`} alt={movie.director} />
                             </div>
                             <p className="text-xs text-content-primary truncate w-20 mx-auto">{movie.director}</p>
                             <p className="text-[10px] text-content-secondary">کارگردان</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Comments Section */}
            <section className="mt-8 border-t border-separator pt-6">
                <div className="flex items-center space-x-2 space-x-reverse mb-4">
                    <MessageSquare size={20} className="text-primary" />
                    <h3 className="text-lg font-bold text-content-primary">نظرات کاربران</h3>
                </div>

                {/* Comment Input */}
                <div className="bg-dark-surface rounded-xl p-4 mb-6 border border-separator">
                    <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="نظر خود را درباره این فیلم بنویسید..."
                        className="w-full bg-dark-card rounded-lg p-3 text-sm text-content-primary placeholder-content-secondary min-h-[100px] border border-separator focus:outline-none focus:border-primary/50 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                        <button 
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="bg-primary hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center transition-colors"
                        >
                            <Send size={14} className="ml-1 rtl:-scale-x-100" />
                            ارسال نظر
                        </button>
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-dark-surface/50 rounded-xl p-4 border border-separator/50 flex space-x-3 space-x-reverse">
                            <div className="flex-shrink-0">
                                <img src={comment.userAvatar} alt={comment.userName} className="w-10 h-10 rounded-full border border-separator" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="font-bold text-sm text-content-primary">{comment.userName}</h4>
                                        <span className="text-[10px] text-content-secondary">{comment.date}</span>
                                    </div>
                                    <div className="flex items-center text-content-secondary text-xs">
                                        <ThumbsUp size={12} className="ml-1" />
                                        <span>{comment.likes}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
          </div>
      </div>
    </div>
  );
};

export default MovieDetail;
