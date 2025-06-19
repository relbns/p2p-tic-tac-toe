// src/components/ConnectionBadge.jsx
import React from 'react';

const ConnectionBadge = ({ method, code, onShare }) => (
  <div 
    onClick={onShare}
    className="inline-block px-4 py-2 bg-green-500/25 border border-green-400/50 rounded-full text-sm mb-2 cursor-pointer hover:bg-green-500/35 transition-all text-white font-medium"
  >
    <span className="font-semibold">{method.toUpperCase()}</span> • 
    <span className="font-mono font-bold tracking-wider ml-1">{code}</span>
  </div>
);

export default ConnectionBadge;
