// src/components/WeatherWrapper.tsx
import React from 'react';
import { Cloud, Sun, Zap } from 'lucide-react';
import type{ WeatherState } from '../types';
import VideoBackground from './VideoBackground'; // Import the new component

interface WeatherWrapperProps {
  weather: WeatherState;
  children: React.ReactNode;
}

const WeatherWrapper: React.FC<WeatherWrapperProps> = ({ weather, children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden text-white font-sans">
      
      {/* --- LAYER 1: The Seamless Video Background --- */}
      <VideoBackground weather={weather} />

      {/* --- LAYER 2: Ambient Icons (Optional, keeps the UI feeling 3D) --- */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {/* Sun (Only visible in Sunny) */}
        <div className={`absolute top-10 right-10 transition-all duration-1000 ${weather === 'sunny' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <Sun size={80} className="text-yellow-300/80 animate-pulse-slow" />
        </div>

        {/* Clouds (Visible in Cloudy/Storm) */}
        <div className={`absolute top-20 left-20 transition-all duration-1000 ${weather !== 'sunny' ? 'opacity-80 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <Cloud size={100} className="text-gray-300/50" />
        </div>

        {/* Lightning Flash (Only in Storm) */}
        {weather === 'storm' && (
            <div className="absolute inset-0 animate-pulse bg-white/5">
                 <Zap className="absolute top-10 left-1/2 text-yellow-400 animate-bounce" size={64} />
            </div>
        )}
      </div>

      {/* --- LAYER 3: The Dashboard Content --- */}
      <div className="relative z-40 p-6 h-full flex flex-col gap-6 backdrop-blur-[2px]">
        {children}
      </div>
    </div>
  );
};

export default WeatherWrapper;