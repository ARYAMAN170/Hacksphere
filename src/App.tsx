// src/App.tsx
import React, { useState } from 'react';
import WeatherWrapper from './components/WeatherWrapper';
import ServerGrid from './components/ServerGrid';
import TrafficChart from './components/TrafficChart';
import { useFestSimulation } from './hooks/useFestSimulation';
import { Terminal, Activity, DollarSign } from 'lucide-react';

const App: React.FC = () => {
  const { trafficHistory, serverCount, weather, logs, triggerSpike, reset } = useFestSimulation();
  const [secretClicks, setSecretClicks] = useState(0);

  const handleSecretClick = () => {
    const newCount = secretClicks + 1;
    setSecretClicks(newCount);
    if (newCount === 7) {
      window.location.href = '/red.html';
    }
  };

  return (
    <WeatherWrapper weather={weather}>
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div 
          onClick={handleSecretClick} 
          className="cursor-default select-none transition-opacity duration-200 active:opacity-50"
        >
          <h1 className="text-4xl font-black tracking-tighter">STORM<span className="text-cyan-400">BREAKER</span></h1>
          <p className="text-white/70 text-sm">Predictive Autoscaling System</p>
        </div>
        <div className="flex gap-4">
           {weather === 'storm' && (
               <button onClick={reset} className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg font-bold border border-white/20 transition-all">
                 RESET DEMO
               </button>
           )}
           <button 
             onClick={triggerSpike}
             disabled={weather !== 'sunny'}
             className={`px-6 py-2 rounded-lg font-bold shadow-lg transition-transform active:scale-95 ${
               weather === 'sunny' 
               ? 'bg-red-500 hover:bg-red-600 text-white' 
               : 'bg-gray-500 cursor-not-allowed opacity-50'
             }`}
           >
             {weather === 'sunny' ? '🔥 TRIGGER SPIKE' : 'SCALING IN PROGRESS...'}
           </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        
        {/* Left Col: Charts */}
        <div className="md:col-span-2 flex flex-col gap-6">
           <TrafficChart data={trafficHistory} />
           
           {/* Stats Row */}
           <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900/40 backdrop-blur p-4 rounded-xl border border-white/10 shadow-2xl">
                 <div className="text-white/50 text-xs uppercase font-bold flex items-center gap-2"><Activity size={14}/> Latency</div>
                 <div className="text-4xl font-mono">{weather === 'storm' ? '24ms' : '18ms'}</div>
              </div>
              <div className="bg-gray-900/40 backdrop-blur p-4 rounded-xl border border-white/10 shadow-2xl">
                 <div className="text-white/50 text-xs uppercase font-bold flex items-center gap-2"><DollarSign size={14}/> Hrly Cost</div>
                 <div className="text-4xl font-mono">${(serverCount * 0.04).toFixed(2)}</div>
              </div>
              <div className="bg-gray-900/40 backdrop-blur p-4 rounded-xl border border-white/10 shadow-2xl">
                 <div className="text-white/50 text-xs uppercase font-bold">Prediction Confidence</div>
                 <div className="text-4xl font-mono text-green-400">98.4%</div>
              </div>
           </div>
        </div>

        {/* Right Col: Servers & Logs */}
        <div className="flex flex-col gap-6">
           <ServerGrid count={serverCount} />
           
           {/* Terminal Log */}
           <div className="bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-white/10 flex-1 font-mono text-xs overflow-hidden flex flex-col min-h-[200px] shadow-2xl">
              <div className="flex items-center gap-2 text-gray-400 mb-2 border-b border-gray-700 pb-2">
                 <Terminal size={14} /> SYSTEM LOGS
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                  {logs.map((log, i) => (
                      <div key={i} className={log.includes('⚠️') ? 'text-yellow-400' : 'text-green-400'}>
                          <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                      </div>
                  ))}
              </div>
           </div>
        </div>
      </div>
    </WeatherWrapper>
  );
};

export default App;