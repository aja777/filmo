import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Subtitles } from 'lucide-react';
import { StreamLink } from '../types';

interface VideoPlayerProps {
  posterUrl?: string;
  streamLinks?: StreamLink[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ posterUrl, streamLinks }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<StreamLink | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Default mock streams if none provided
  const defaultStreams: StreamLink[] = [
    { quality: '1080p', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { quality: '720p', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { quality: '480p', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
  ];

  const streams = streamLinks && streamLinks.length > 0 ? streamLinks : defaultStreams;

  useEffect(() => {
    if (streams.length > 0 && !currentQuality) {
      setCurrentQuality(streams[0]);
    }
  }, [streams, currentQuality]);

  const togglePlay = () => {
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
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      videoRef.current.currentTime = (value / 100) * duration;
      setProgress(value);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
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

  return (
    <div className="relative w-full aspect-video bg-black group overflow-hidden">
      <video
        ref={videoRef}
        src={currentQuality?.url}
        poster={posterUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        {/* Progress Bar */}
        <div className="mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <span className="text-white text-xs font-mono">
                {videoRef.current ? formatTime(videoRef.current.currentTime) : '00:00'} / 
                {videoRef.current ? formatTime(videoRef.current.duration || 0) : '00:00'}
            </span>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse relative">
             {/* Subtitle Toggle (Mock) */}
            <button className="text-white hover:text-gray-300 transition-colors" title="زیرنویس">
                <Subtitles size={20} />
            </button>

            {/* Quality Settings */}
            <div className="relative">
                <button 
                    onClick={() => setShowSettings(!showSettings)} 
                    className="text-white hover:text-gray-300 transition-colors flex items-center space-x-1 space-x-reverse"
                >
                    <Settings size={20} />
                    <span className="text-[10px] font-bold">{currentQuality?.quality}</span>
                </button>
                
                {showSettings && (
                    <div className="absolute bottom-8 left-0 bg-dark-surface border border-separator rounded-lg p-2 shadow-xl w-32 animate-fadeIn z-50">
                        <p className="text-[10px] text-content-secondary mb-2 px-2">کیفیت پخش</p>
                        {streams.map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => changeQuality(s)}
                                className={`w-full text-right text-xs px-2 py-1.5 rounded hover:bg-white/10 ${currentQuality?.quality === s.quality ? 'text-primary font-bold' : 'text-white'}`}
                            >
                                {s.quality}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Centered Play Button (Initial State) */}
      {!isPlaying && (
        <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
            <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full border border-white/20 shadow-2xl">
                <Play size={40} className="text-white fill-white ml-1" />
            </div>
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default VideoPlayer;