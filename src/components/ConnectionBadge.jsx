// src/components/ConnectionBadge.jsx
import React from 'react';
import { showToast } from '../utils/helpers';

const ConnectionBadge = ({ method, code, onShare, isHost }) => {
  const handleClick = () => {
    if (isHost) {
      onShare();
    } else {
      showToast('Only the host can share the game room', 'error');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="inline-block px-4 py-2 bg-green-500/25 border border-green-400/50 rounded-full text-sm mb-2 text-white font-medium transition-all cursor-pointer hover:bg-green-500/35 select-none"
      title={isHost ? 'Click to share game room' : 'Connected to game room'}
    >
      <span className="font-semibold">{method.toUpperCase()}</span> •
      <span
        className="font-mono font-bold tracking-wider ml-1 select-text cursor-text"
        title="Click to select and copy"
      >
        {code}
      </span>
      {isHost && <span className="ml-2 text-xs opacity-75">📤</span>}
      {!isHost && <span className="ml-2 text-xs opacity-75">🔗</span>}
    </div>
  );
};

export default ConnectionBadge;
