// src/hooks/useFestSimulation.ts
import { useState, useEffect, useRef } from 'react';
import type { WeatherState, TrafficPoint, SimulationState } from '../types';

export const useFestSimulation = (): SimulationState => {
  const [trafficHistory, setTrafficHistory] = useState<TrafficPoint[]>([]);
  const [serverCount, setServerCount] = useState<number>(2);
  const [weather, setWeather] = useState<WeatherState>('sunny');
  const [logs, setLogs] = useState<string[]>(["System connecting..."]);
  const wsRef = useRef<WebSocket | null>(null);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  // Connect to Backend
  useEffect(() => {
    const checkHealth = async () => {
        try {
            const res = await fetch('http://localhost:4000/');
            if(res.ok) addLog("✅ Backend System Online");
            else addLog("⚠️ Backend Initializing...");
        } catch (e) {
            addLog("❌ Backend Unreachable");
        }
    };
    checkHealth();

    // Setup WebSocket
    const ws = new WebSocket("ws://localhost:4000");
    wsRef.current = ws;

    ws.onopen = () => {
        addLog("🔌 Realtime Data Stream Connected");
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            const { currentRPS, predictedRPS, serversRunning } = data;

            const newPoint: TrafficPoint = {
                time: new Date().toLocaleTimeString(),
                traffic: currentRPS,
                predicted: predictedRPS
            };

            setTrafficHistory(prev => [...prev.slice(-20), newPoint]);
            setServerCount(serversRunning);

            // Dynamic Weather Logic
            if (currentRPS > 150) {
                setWeather('storm');
            } else if (predictedRPS > 150) {
                setWeather('cloudy');
            } else {
                setWeather('sunny');
            }

        } catch (e) {
            console.error("WS Parse Error", e);
        }
    };

    ws.onerror = (e) => {
        // console.error("WS Error", e);
        // addLog("⚠️ Stream Error");
    };

    return () => {
        ws.close();
    };
  }, []);

  const triggerSpike = async () => {
    addLog("⚠️ Sending Load Test Command...");
    // Optimistic Update: Prevent double-click
    setWeather('cloudy');
    
    try {
        const res = await fetch('http://localhost:4000/simulate/flood/start', { method: 'POST' });
        const data = await res.json();
        addLog(`🚀 ${data.status}`);
    } catch (e) {
        addLog("❌ Start Failed");
        setWeather('sunny'); // Revert if failed
    }
  };

  const reset = async () => {
    addLog("🛑 Sending Stop Command...");
    
    try {
        const res = await fetch('http://localhost:4000/simulate/flood/stop', { method: 'POST' });
        const data = await res.json();
        addLog(`✅ ${data.status}`);
        setWeather('sunny');
    } catch (e) {
        addLog("❌ Stop Failed");
    }
  };

  return { trafficHistory, serverCount, weather, logs, triggerSpike, reset };
};