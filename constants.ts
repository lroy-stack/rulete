
import { Prize } from './types';

export const WINTER_PRIZES: Prize[] = [
  { id: '1', label: 'Frozen Chest', value: 'chest', color: '#e0f2fe', icon: '🧊' },
  { id: '2', label: 'Snowball x10', value: '10', color: '#bae6fd', icon: '❄️' },
  { id: '3', label: 'Arctic Gem', value: 'gem', color: '#7dd3fc', icon: '💎' },
  { id: '4', label: 'Hot Cocoa', value: 'cocoa', color: '#38bdf8', icon: '☕' },
  { id: '5', label: 'Yeti Hug', value: '0', color: '#0ea5e9', icon: '🐾' },
  { id: '6', label: 'Ice Skates', value: 'skates', color: '#0284c7', icon: '⛸️' },
  { id: '7', label: 'Magic Sled', value: 'sled', color: '#0369a1', icon: '🛷' },
  { id: '8', label: 'Jack Frost', value: 'jackpot', color: '#f8fafc', icon: '☃️' },
];

export const WHEEL_SIZE = 400;
export const SPIN_DURATION = 4000;
export const MIN_ROTATIONS = 6;
