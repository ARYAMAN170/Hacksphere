// src/components/VideoBackground.tsx
import React from 'react';
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

const VideoBackground: React.FC<VideoBackgroundProps> = ({ weather }) => {
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-900">
      {/* 1. SUNNY VIDEO LAYER - Base Layer, always visible */}
      <video
        autoPlay muted loop playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEOS.sunny} type="video/mp4" />
      </video>

      {/* 2. CLOUDY VIDEO LAYER - Visible for cloudy AND storm */}
      <video
        autoPlay muted loop playsInline preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ease-in-out z-10 ${
          weather === 'cloudy' || weather === 'storm' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src={VIDEOS.cloudy} type="video/mp4" />
      </video>

      {/* 3. STORM VIDEO LAYER - Visible only for storm */}
      <div className={`absolute inset-0 w-full h-full transition-opacity duration-[3000ms] ease-in-out z-20 ${
          weather === 'storm' ? 'opacity-100' : 'opacity-0'
      }`}>
        <video
          autoPlay muted loop playsInline preload="auto"
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
};

export default VideoBackground;