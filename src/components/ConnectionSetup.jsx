// src/components/ConnectionSetup.jsx
import React from 'react';

const ConnectionSetup = ({
  selectedMethod,
  onMethodSelect,
  onHost,
  onJoin,
  playerName,
  onPlayerNameChange,
  gameCode,
  joinCode,
  onJoinCodeChange,
  onConnect,
  status,
  isHosting,
  isJoining,
  onLocalGame
}) => (
  <div className="space-y-6">
    <input
      type="text"
      placeholder="Enter your name (optional)"
      value={playerName}
      onChange={(e) => onPlayerNameChange(e.target.value)}
      className="w-full p-3 border-none rounded-xl bg-white/15 text-white placeholder-white/70 backdrop-blur border border-white/30 font-medium"
      maxLength={20}
    />

    <div>
      <h3 className="text-xl font-semibold mb-4 text-white">
        Choose Game Mode:
      </h3>
      
      {/* Quick Start Local Game */}
      <div className="mb-6">
        <button
          onClick={onLocalGame}
          className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-bold text-white transition-all transform hover:scale-[1.02] shadow-lg border border-blue-400/30"
        >
          🎮 Local Game (Same Device)
          <div className="text-sm font-normal opacity-90 mt-1">
            Play with someone next to you
          </div>
        </button>
      </div>

      <div className="text-center text-white/70 text-sm mb-4 font-medium">
        OR connect with remote players:
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { id: 'webrtc', label: '🌐 WebRTC', subtitle: 'Internet Required' },
          { id: 'bluetooth', label: '📶 Bluetooth', subtitle: 'No Internet' },
          {
            id: 'hotspot',
            label: '📡 WiFi Hotspot',
            subtitle: 'Local Network',
          },
          { id: 'qr', label: '📱 QR Code', subtitle: 'Pass & Play' },
        ].map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodSelect(method.id)}
            className={`p-4 rounded-xl font-semibold transition-all backdrop-blur border text-center
              ${
                selectedMethod === method.id
                  ? 'bg-green-500/30 border-green-400/60 text-white'
                  : 'bg-white/15 border-white/30 hover:bg-white/25 text-white'
              }`}
          >
            <div>{method.label}</div>
            <div className="text-xs opacity-75">{method.subtitle}</div>
          </button>
        ))}
      </div>
    </div>

    <div
      className={`p-4 rounded-xl min-h-[60px] flex items-center justify-center border font-medium
      ${
        status.type === 'success'
          ? 'bg-green-500/20 border-green-400/50 text-white'
          : status.type === 'error'
          ? 'bg-red-500/20 border-red-400/50 text-white'
          : status.type === 'loading'
          ? 'bg-blue-500/20 border-blue-400/50 text-white'
          : 'bg-white/10 border-white/25 text-white'
      }`}
    >
      {status.type === 'loading' && (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
      )}
      {status.message}
    </div>

    {selectedMethod && !isHosting && !isJoining && (
      <div className="flex gap-3">
        <button
          onClick={onHost}
          className="flex-1 p-3 rounded-xl bg-white/20 hover:bg-white/30 font-semibold transition-all backdrop-blur border border-white/30 text-white"
        >
          Host Game
        </button>
        <button
          onClick={onJoin}
          className="flex-1 p-3 rounded-xl bg-white/20 hover:bg-white/30 font-semibold transition-all backdrop-blur border border-white/30 text-white"
        >
          Join Game
        </button>
      </div>
    )}

    {isHosting && (
      <div className="text-center space-y-4">
        <p className="text-lg text-white font-medium">Share this code with your friend:</p>
        <div className="text-4xl font-bold font-mono tracking-widest p-4 bg-black/20 rounded-xl border-2 border-dashed border-white/50 cursor-pointer hover:bg-black/30 transition-all text-white">
          {gameCode}
        </div>
        <p className="text-sm text-white/70">Tap to share</p>
      </div>
    )}

    {isJoining && (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter game code"
          value={joinCode}
          onChange={(e) => onJoinCodeChange(e.target.value.toUpperCase())}
          className="w-full p-4 text-center text-2xl font-mono tracking-widest bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/70 backdrop-blur font-bold"
          maxLength={4}
        />
        <button
          onClick={onConnect}
          className="w-full p-3 rounded-xl bg-white/20 hover:bg-white/30 font-semibold transition-all backdrop-blur border border-white/30 text-white"
        >
          Connect
        </button>
      </div>
    )}
  </div>
);

export default ConnectionSetup;
