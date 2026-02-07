// src/hooks/useFestSimulation.ts
import { useState, useEffect, useRef } from 'react';
import type { WeatherState, TrafficPoint, SimulationState } from '../types';

export const useFestSimulation = (): SimulationState => {
  const [trafficHistory, setTrafficHistory] = useState<TrafficPoint[]>([]);
  const [serverCount, setServerCount] = useState<number>(2);
  const [weather, setWeather] = useState<WeatherState>('sunny');
  const [logs, setLogs] = useState<string[]>(["System initialized..."]);
  
  // Future buffer for the "Yellow Line"
  const [prediction, setPrediction] = useState<TrafficPoint[]>([]);

  const timeRef = useRef<number>(0);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const triggerSpike = () => {
    addLog("⚠️ USER: Manual Load Test Initiated");
    
    // 1. AI "Predicts" the spike (Cloudy)
    setTimeout(() => {
        setWeather('cloudy');
        addLog("🤖 AI: High Traffic Vector Detected (+400%)");
        
        // Generate the "Yellow Dotted Line" data
        const futureData: TrafficPoint[] = Array.from({length: 20}, (_, i) => ({
            time: timeRef.current + i + 1,
            traffic: 0, // Placeholder
            predicted: 400 + Math.random() * 50
        }));
        setPrediction(futureData);
    }, 1000);

    // 2. The Storm Hits & Scaling Begins (Storm)
    setTimeout(() => {
        setWeather('storm');
        addLog("⚡ SCALER: Provisioning 8 new containers...");
        setServerCount(10); // AUTO SCALE
    }, 3000);
  };

  const reset = () => {
    setServerCount(2);
    setWeather('sunny');
    setPrediction([]);
    addLog("✅ System Stabilized.");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      timeRef.current += 1;
      
      // Calculate "Real" Traffic
      let currentLoad = 30 + Math.random() * 10;
      if (weather === 'storm') currentLoad = 400 + Math.random() * 50;
      
      const newPoint: TrafficPoint = {
        time: new Date().toLocaleTimeString(),
        traffic: currentLoad,
        predicted: prediction.length > 0 ? prediction[0].predicted : null
      };

      // Shift prediction array if it exists
      if(prediction.length > 0) setPrediction(prev => prev.slice(1));

      setTrafficHistory(prev => [...prev.slice(-20), newPoint]); 
    }, 1000);

    return () => clearInterval(interval);
  }, [weather, prediction]);

  return { trafficHistory, serverCount, weather, logs, triggerSpike, reset };
};