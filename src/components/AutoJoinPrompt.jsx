// src/components/AutoJoinPrompt.jsx
import React, { useState } from 'react';
import { getMethodDisplayName } from '../utils/helpers';

const AutoJoinPrompt = ({ 
  gameCode, 
  method, 
  onJoin, 
  onDecline,
  playerName,
  onPlayerNameChange 
}) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    await onJoin();
    setIsJoining(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Join Game?
        </h2>
        <p className="text-white/80 mb-4">
          You've been invited to join a Tic Tac Toe game!
        </p>
        
        <div className="bg-black/20 rounded-xl p-4 mb-6">
          <div className="text-sm text-white/70 mb-2">Game Code:</div>
          <div className="text-3xl font-bold font-mono tracking-widest text-white">
            {gameCode}
          </div>
          <div className="text-sm text-white/70 mt-2">
            Method: {getMethodDisplayName(method)}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Your Name (Optional)
        </label>
        <input
          type="text"
          placeholder="Enter your name..."
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          className="w-full p-3 border-none rounded-xl bg-white/10 text-white placeholder-white/70 backdrop-blur border border-white/30"
          maxLength={20}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleJoin}
          disabled={isJoining}
          className="flex-1 p-4 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 font-bold text-white transition-all disabled:opacity-50"
        >
          {isJoining ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2"></div>
              Joining...
            </>
          ) : (
            '🚀 Join Game'
          )}
        </button>
        <button
          onClick={onDecline}
          className="flex-1 p-4 rounded-xl bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 font-bold text-white transition-all"
        >
          ❌ Decline
        </button>
      </div>

      <div className="text-center">
        <p className="text-white/60 text-sm">
          Click "Join Game" to connect and start playing!
        </p>
      </div>
    </div>
  );
};

export default AutoJoinPrompt;
