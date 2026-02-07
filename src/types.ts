// src/types.ts

export type WeatherState = 'sunny' | 'cloudy' | 'storm';

export interface TrafficPoint {
  time: number | string;
  traffic: number;
  predicted: number | null; // null means "no prediction for this point"
}

export interface SimulationState {
  trafficHistory: TrafficPoint[];
  serverCount: number;
  weather: WeatherState;
  logs: string[];
  triggerSpike: () => void;
  reset: () => void;
}