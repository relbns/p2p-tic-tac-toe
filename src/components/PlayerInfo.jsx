// src/components/PlayerInfo.jsx
import React from 'react';

const PlayerInfo = ({ player1, player2, currentPlayer, isHost }) => (
  <div className="flex justify-between mb-4 p-3 bg-black/15 rounded-lg border border-white/20 select-none">
    <div
      className={`text-center flex-1 ${
        currentPlayer === 1
          ? 'bg-yellow-500/25 rounded p-2 border border-yellow-400/40'
          : ''
      }`}
    >
      <div className="font-medium text-white">{player1.name}</div>
      <div className="text-xl font-bold text-white">{player1.symbol}</div>
    </div>
    <div
      className={`text-center flex-1 ${
        currentPlayer === 2
          ? 'bg-yellow-500/25 rounded p-2 border border-yellow-400/40'
          : ''
      }`}
    >
      <div className="font-medium text-white">{player2.name}</div>
      <div className="text-xl font-bold text-white">{player2.symbol}</div>
    </div>
  </div>
);

export default PlayerInfo;
