// src/components/AutoJoinPrompt.jsx
import React, { useState } from 'react';
import { getMethodDisplayName } from '../utils/helpers';

const AutoJoinPrompt = ({
  gameCode,
  method,
  onJoin,
  onDecline,
  playerName,
  onPlayerNameChange,
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
        <div className="text-6xl mb-4 select-none">🎮</div>
        <h2 className="text-2xl font-bold text-white mb-2 select-none">
          Join Game?
        </h2>
        <p className="text-white/90 mb-4 font-medium select-none">
          You've been invited to join a Tic Tac Toe game!
        </p>

        <div className="bg-black/25 rounded-xl p-4 mb-6 border border-white/20">
          <div className="text-sm text-white/80 mb-2 font-medium select-none">
            Game Code:
          </div>
          <div
            className="text-3xl font-bold font-mono tracking-widest text-white select-text cursor-text"
            title="Click to select and copy"
          >
            {gameCode}
          </div>
          <div className="text-sm text-white/80 mt-2 font-medium select-none">
            Method: {getMethodDisplayName(method)}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-white text-sm font-semibold mb-2 select-none">
          Your Name (Optional)
        </label>
        <input
          type="text"
          placeholder="Enter your name..."
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          className="w-full p-3 border-none rounded-xl bg-white/15 text-white placeholder-white/70 backdrop-blur border border-white/30 font-medium"
          maxLength={20}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleJoin}
          disabled={isJoining}
          className="flex-1 p-4 rounded-xl bg-green-500/25 hover:bg-green-500/35 border border-green-400/50 font-bold text-white transition-all disabled:opacity-50 select-none"
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
          className="flex-1 p-4 rounded-xl bg-gray-500/25 hover:bg-gray-500/35 border border-gray-400/50 font-bold text-white transition-all select-none"
        >
          ❌ Decline
        </button>
      </div>

      <div className="text-center">
        <p className="text-white/70 text-sm font-medium select-none">
          Click "Join Game" to connect and start playing!
        </p>
      </div>
    </div>
  );
};

export default AutoJoinPrompt;
