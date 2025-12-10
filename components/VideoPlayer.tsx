import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Subtitles, Loader2, ArrowLeft, Check } from 'lucide-react';
import { StreamLink } from '../types';

interface VideoPlayerProps {
  posterUrl?: string;
  streamLinks?: StreamLink[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ posterUrl, streamLinks }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<StreamLink | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('off');
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Default mock streams if none provided
  const defaultStreams: StreamLink[] = [
    { quality: '1080p', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { quality: '720p', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { quality: '480p', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
  ];

  // Mock Subtitles
  const mockSubtitles = [
      { label: 'خاموش', value: 'off' },
      { label: 'فارسی', value: 'fa' },
      { label: 'English', value: 'en' },
  ];

  const streams = streamLinks && streamLinks.length > 0 ? streamLinks : defaultStreams;

  useEffect(() => {
    if (streams.length > 0 && !currentQuality) {
      setCurrentQuality(streams[0]);
    }
  }, [streams, currentQuality]);

  // Handle Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls logic
  useEffect(() => {
    const show = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
            if (!showSettings && !showSubtitles) {
                setShowControls(false);
            }
        }, 3000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', show);
      container.addEventListener('touchstart', show);
      container.addEventListener('click', show);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', show);
        container.removeEventListener('touchstart', show);
        container.removeEventListener('click', show);
      }
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, showSettings, showSubtitles]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
      setIsBuffering(false);
    }
  };

  const handleWaiting = () => setIsBuffering(true);
  const handleCanPlay = () => setIsBuffering(false);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      videoRef.current.currentTime = (value / 100) * dur;
      setProgress(value);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const changeQuality = (stream: StreamLink) => {
    setCurrentQuality(stream);
    setShowSettings(false);
    // Note: In a real app, you'd want to save the current time, switch source, and seek back to that time.
    if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const wasPlaying = !videoRef.current.paused;
        
        // Use a small timeout to allow React to update the source
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.currentTime = currentTime;
                if (wasPlaying) videoRef.current.play();
            }
        }, 100);
    }
  };

  const changeSubtitle = (value: string) => {
      setCurrentSubtitle(value);
      setShowSubtitles(false);
      // In a real implementation, this would switch the <track> src
      console.log("Subtitle switched to:", value);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black group overflow-hidden select-none"
    >
      <video
        ref={videoRef}
        src={currentQuality?.url}
        poster={posterUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onEnded={() => { setIsPlaying(false); setShowControls(true); }}
        onClick={togglePlay}
        playsInline
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <Loader2 size={48} className="text-primary animate-spin drop-shadow-lg" />
        </div>
      )}

      {/* Play/Pause Center Overlay (Only when paused and controls visible) */}
      {!isPlaying && !isBuffering && showControls && (
        <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 z-10"
            onClick={togglePlay}
        >
            <div className="bg-primary/90 hover:bg-primary backdrop-blur-md p-5 rounded-full shadow-2xl transition-transform transform hover:scale-110 active:scale-95">
                <Play size={32} className="text-white fill-white ml-1" />
            </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-4 pb-4 pt-12 transition-all duration-300 z-20 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="mb-3 group/slider relative">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer outline-none relative z-20"
              style={{
                background: `linear-gradient(to right, #10B981 ${progress}%, rgba(255,255,255,0.2) ${progress}%)`
              }}
            />
            {/* Thumb hover effect handled by browser/OS, customized input above */}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button onClick={togglePlay} className="text-white hover:text-primary transition-colors focus:outline-none">
              {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current" />}
            </button>
            
            <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors focus:outline-none">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <span className="text-white text-xs font-mono font-medium tracking-wider">
                {formatTime(currentTime)} <span className="text-white/50">/</span> {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse relative">
            
            {/* Subtitle Toggle */}
            <div className="relative">
                <button 
                    onClick={() => { setShowSubtitles(!showSubtitles); setShowSettings(false); }} 
                    className={`text-white hover:text-primary transition-colors focus:outline-none ${showSubtitles ? 'text-primary' : ''}`}
                >
                    <Subtitles size={20} />
                </button>

                {showSubtitles && (
                    <div className="absolute bottom-10 left-0 bg-dark-surface/95 backdrop-blur-xl border border-separator rounded-xl p-2 shadow-2xl w-36 animate-slideUp origin-bottom-left z-50">
                        <div className="flex items-center justify-between px-2 mb-2 pb-2 border-b border-separator">
                            <span className="text-[10px] font-bold text-content-secondary">زیرنویس</span>
                            <Subtitles size={12} className="text-content-secondary" />
                        </div>
                        <div className="space-y-1">
                            {mockSubtitles.map((sub, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => changeSubtitle(sub.value)}
                                    className={`w-full text-right text-xs px-3 py-2 rounded-lg transition-all flex items-center justify-between ${currentSubtitle === sub.value ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'text-content-primary hover:bg-white/5'}`}
                                >
                                    <span>{sub.label}</span>
                                    {currentSubtitle === sub.value && <Check size={12} />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Quality Settings */}
            <div className="relative">
                <button 
                    onClick={() => { setShowSettings(!showSettings); setShowSubtitles(false); }} 
                    className="text-white hover:text-primary transition-colors flex items-center space-x-1 space-x-reverse focus:outline-none"
                >
                    <Settings size={20} className={showSettings ? "animate-spin-slow text-primary" : ""} />
                    <span className="text-[10px] font-bold bg-white/10 px-1.5 py-0.5 rounded hidden sm:inline-block">{currentQuality?.quality}</span>
                </button>
                
                {showSettings && (
                    <div className="absolute bottom-10 left-0 bg-dark-surface/95 backdrop-blur-xl border border-separator rounded-xl p-2 shadow-2xl w-36 animate-slideUp origin-bottom-left z-50">
                        <div className="flex items-center justify-between px-2 mb-2 pb-2 border-b border-separator">
                            <span className="text-[10px] font-bold text-content-secondary">کیفیت پخش</span>
                            <Settings size={12} className="text-content-secondary" />
                        </div>
                        <div className="space-y-1">
                            {streams.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => changeQuality(s)}
                                    className={`w-full text-right text-xs px-3 py-2 rounded-lg transition-all ${currentQuality?.quality === s.quality ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'text-content-primary hover:bg-white/5'}`}
                                >
                                    {s.quality}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors focus:outline-none">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Top Gradient for better visibility of header content if needed */}
      <div className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default VideoPlayer;