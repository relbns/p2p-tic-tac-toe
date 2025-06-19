import React from 'react';

const PlayerInfo = ({ player1, player2, currentPlayer, isHost }) => (
  <div className="flex justify-between mb-4 p-3 bg-black/10 rounded-lg">
    <div
      className={`text-center flex-1 ${
        currentPlayer === 1 ? 'bg-yellow-500/20 rounded p-2' : ''
      }`}
    >
      <div className="font-medium">{player1.name}</div>
      <div className="text-xl font-bold">{player1.symbol}</div>
    </div>
    <div
      className={`text-center flex-1 ${
        currentPlayer === 2 ? 'bg-yellow-500/20 rounded p-2' : ''
      }`}
    >
      <div className="font-medium">{player2.name}</div>
      <div className="text-xl font-bold">{player2.symbol}</div>
    </div>
  </div>
);

export default PlayerInfo;
