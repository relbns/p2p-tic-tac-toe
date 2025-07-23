// src/components/ConnectionTroubleshooting.jsx
import React from 'react';

const ConnectionTroubleshooting = ({ onRetry, onSwitchMethod }) => (
  <div className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-white space-y-3">
    <h4 className="font-bold text-lg">Connection Problems?</h4>
    <p className="text-sm">
      WebRTC can sometimes be blocked by restrictive networks. Here are a couple of things to try:
    </p>
    <div className="flex gap-3 pt-2">
      <button
        onClick={onRetry}
        className="flex-1 p-3 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 border border-blue-400/60 font-semibold transition-all text-white"
      >
        🔄 Retry
      </button>
      <button
        onClick={onSwitchMethod}
        className="flex-1 p-3 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 border border-purple-400/60 font-semibold transition-all text-white"
      >
        📡 Switch to Hotspot
      </button>
    </div>
  </div>
);

export default ConnectionTroubleshooting;
