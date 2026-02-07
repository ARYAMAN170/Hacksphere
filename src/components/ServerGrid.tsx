// src/components/ServerGrid.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Server } from 'lucide-react';

interface ServerGridProps {
  count: number;
}

const ServerGrid: React.FC<ServerGridProps> = ({ count }) => {
  return (
    <div className="bg-gray-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Server size={20} /> Active Nodes ({count})
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="h-12 w-12 bg-emerald-500/20 border border-emerald-400/50 rounded flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.4)] relative"
          >
            <Server size={24} className="text-emerald-400" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
          </motion.div>
        ))}
        {/* Ghost slots for grid stability */}
        {Array.from({ length: Math.max(0, 15 - count) }).map((_, i) => (
            <div key={`ghost-${i}`} className="h-12 w-12 bg-black/50 border-2 border-dashed border-white/10 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-white/5 rounded-full" />
            </div>
        ))}
      </div>
    </div>
  );
};

export default ServerGrid;