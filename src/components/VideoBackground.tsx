// src/components/VideoBackground.tsx
import React, { useEffect, useRef } from 'react';
import type { WeatherState } from '../types';

// Assets are now served from /public/videos for better static asset handling on Vercel
const VIDEOS = {
  sunny: '/videos/sunny.mp4',
  cloudy: '/videos/cloudy.mp4',
  storm: '/videos/thunder.mp4'
};

interface VideoBackgroundProps {
  weather: WeatherState;
}

const VideoBackground: React.FC<VideoBackgroundProps> = React.memo(({ weather }) => {
  const sunnyRef = useRef<HTMLVideoElement>(null);
  const cloudyRef = useRef<HTMLVideoElement>(null);
  const stormRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Helper to safely play
    const playVideo = (ref: React.RefObject<HTMLVideoElement | null>) => {
      if (ref.current && ref.current.paused) {
        ref.current.play().catch(e => console.log("Playback prevented:", e));
      }
    };

    // Helper to pause
    const pauseVideo = (ref: React.RefObject<HTMLVideoElement | null>) => {
      if (ref.current && !ref.current.paused) {
        ref.current.pause();
      }
    };

    // 1. Manage Sunny Video (Base)
    // Always play unless fully covered by Storm (optimization)
    // Actually, let's keep it playing in Cloudy too just in case of transparency,
    // but definitely pause in Storm as it's 2 layers down.
    if (weather === 'storm') {
      pauseVideo(sunnyRef);
    } else {
      playVideo(sunnyRef);
    }

    // 2. Manage Cloudy Video
    // Visible in Cloudy and Storm
    if (weather === 'cloudy' || weather === 'storm') {
      playVideo(cloudyRef);
    } else {
      pauseVideo(cloudyRef);
    }

    // 3. Manage Storm Video
    // Visible only in Storm
    if (weather === 'storm') {
      playVideo(stormRef);
    } else {
      pauseVideo(stormRef);
    }
  }, [weather]);
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-900">
      {/* 1. SUNNY VIDEO LAYER - Base Layer, always visible */}
      <video
        ref={sunnyRef}
        muted loop playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEOS.sunny} type="video/mp4" />
      </video>

      {/* 2. CLOUDY VIDEO LAYER - Visible for cloudy AND storm */}
      <video
        ref={cloudyRef}
        muted loop playsInline preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ease-in-out z-10 ${
          weather === 'cloudy' || weather === 'storm' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src={VIDEOS.cloudy} type="video/mp4" />
      </video>

      {/* 3. STORM VIDEO LAYER - Visible only for storm */}
      <div className={`absolute inset-0 w-full h-full transition-opacity duration-3000 ease-in-out z-20 ${
          weather === 'storm' ? 'opacity-100' : 'opacity-0'
      }`}>
        <video
          ref={stormRef}
          muted loop playsInline preload="auto"
          className="w-full h-full object-cover"
        >
          <source src={VIDEOS.storm} type="video/mp4" />
        </video>
      </div>

      {/* Overlay: Essential for text readability over chaotic video */}
      <div className={`absolute inset-0 transition-colors duration-5000 z-30 
        ${weather === 'sunny' ? 'bg-blue-900/20' : ''}
        ${weather === 'cloudy' ? 'bg-gray-900/40' : ''}
        ${weather === 'storm' ? 'bg-red-900/30' : ''}
      `} />
      
      {/* Texture Mesh (Optional): Adds a "Tech" feel over the video */}
      <div className="absolute inset-0 z-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>
  );
});

export default VideoBackground;