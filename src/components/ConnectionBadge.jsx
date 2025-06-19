// src/components/ConnectionBadge.jsx
import React from 'react';

const ConnectionBadge = ({ method, code, onShare, isHost }) => (
  <div 
    onClick={isHost ? onShare : undefined}
    className={`inline-block px-4 py-2 bg-green-500/25 border border-green-400/50 rounded-full text-sm mb-2 text-white font-medium transition-all ${
      isHost 
        ? 'cursor-pointer hover:bg-green-500/35' 
        : 'cursor-default'
    }`}
    title={isHost ? 'Click to share game room' : 'Connected to game room'}
  >
    <span className="font-semibold">{method.toUpperCase()}</span> • 
    <span className="font-mono font-bold tracking-wider ml-1">{code}</span>
    {isHost && (
      <span className="ml-2 text-xs opacity-75">📤</span>
    )}
    {!isHost && (
      <span className="ml-2 text-xs opacity-75">🔗</span>
    )}
  </div>
);

export default ConnectionBadge;
