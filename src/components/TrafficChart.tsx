// src/components/TrafficChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type{ TrafficPoint } from '../types';

interface TrafficChartProps {
  data: TrafficPoint[];
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl h-64 flex flex-col">
      <h3 className="text-lg font-bold mb-2">Real-Time Traffic vs Prediction</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" hide />
            <YAxis stroke="#fff" fontSize={12} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} 
            />
            
            <Area 
                type="monotone" 
                dataKey="traffic" 
                stroke="#22d3ee" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTraffic)" 
                isAnimationActive={false} 
            />
             <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#facc15" 
                strokeDasharray="5 5"
                fill="transparent"
                strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficChart;