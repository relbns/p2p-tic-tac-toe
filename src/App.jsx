// src/App.jsx - Fixed Container Issue
import React, { useState, useRef, useEffect } from 'react';
import LocalGame from './components/LocalGame';
import { showToast } from './utils/helpers';

function App() {
  const [gameMode, setGameMode] = useState('menu');
  const [gameStatus, setGameStatus] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [netplayReady, setNetplayReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Checking NetplayJS...');
  const gameContainerRef = useRef(null);
  const netplayWrapperRef = useRef(null);

  // Check for NetplayJS availability with polling
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50;
    
    const checkNetplayJS = () => {
      attempts++;
      console.log(`Checking NetplayJS availability... Attempt ${attempts}`);
      
      if (window.netplayjs) {
        console.log('✅ NetplayJS is available!', Object.keys(window.netplayjs));
        setNetplayReady(true);
        setDebugInfo('✅ NetplayJS loaded and ready');
        return true;
      } else if (attempts >= maxAttempts) {
        console.error('❌ NetplayJS failed to load after maximum attempts');
        setDebugInfo('❌ NetplayJS failed to load');
        return false;
      } else {
        console.log(`NetplayJS not ready yet, attempt ${attempts}/${maxAttempts}`);
        setDebugInfo(`Loading NetplayJS... (${attempts}/${maxAttempts})`);
        setTimeout(checkNetplayJS, 100);
        return false;
      }
    };
    
    setTimeout(checkNetplayJS, 100);
  }, []);

  const startOnlineGame = () => {
    console.log('startOnlineGame called');
    
    if (!netplayReady || !window.netplayjs) {
      console.error('NetplayJS not ready');
      showToast('NetplayJS is still loading, please wait...', 'error');
      return;
    }

    // First set the mode to online to render the container
    setGameMode('online');
    setGameStatus('Initializing multiplayer...');
    setDebugInfo('Setting up game container...');

    // Use setTimeout to ensure the container is rendered before trying to use it
    setTimeout(() => {
      console.log('Container ref:', gameContainerRef.current);
      
      if (!gameContainerRef.current) {
        console.error('Game container still not found after mode change');
        setGameStatus('Error: Could not create game container');
        setDebugInfo('❌ Container creation failed');
        return;
      }

      try {
        console.log('NetplayJS available:', Object.keys(window.netplayjs));
        setDebugInfo('Creating multiplayer game...');

        // Clear any existing content
        gameContainerRef.current.innerHTML = '';
        
        // Create NetplayJS Tic Tac Toe Game
        class NetplayTicTacToe extends window.netplayjs.Game {
          static timestep = 1000 / 10;
          static canvasSize = { width: 300, height: 300 };
          
          constructor() {
            super();
            console.log('NetplayTicTacToe game created');
            this.board = Array(9).fill('');
            this.currentPlayer = 0;
            this.winner = null;
            this.gameOver = false;
            this.lastMoveTime = 0;
          }
          
          tick(playerInputs) {
            if (this.gameOver) return;
            
            const currentTime = Date.now();
            if (currentTime - this.lastMoveTime < 200) return;
            
            for (const [player, input] of playerInputs.entries()) {
              if (player.getID() !== this.currentPlayer) continue;
              
              if (input.mouse && input.mouse.justPressed()) {
                const mousePos = input.mouse.position();
                const cellIndex = this.getCellFromPosition(mousePos.x, mousePos.y);
                
                if (cellIndex !== -1 && this.board[cellIndex] === '') {
                  console.log(`Player ${player.getID()} clicked cell ${cellIndex}`);
                  this.board[cellIndex] = player.getID() === 0 ? 'X' : 'O';
                  this.currentPlayer = 1 - this.currentPlayer;
                  this.lastMoveTime = currentTime;
                  this.checkWinner();
                  break;
                }
              }
            }
          }
          
          getCellFromPosition(x, y) {
            const cellSize = 100;
            const col = Math.floor(x / cellSize);
            const row = Math.floor(y / cellSize);
            
            if (col >= 0 && col < 3 && row >= 0 && row < 3) {
              return row * 3 + col;
            }
            return -1;
          }
          
          checkWinner() {
            const winPatterns = [
              [0, 1, 2], [3, 4, 5], [6, 7, 8],
              [0, 3, 6], [1, 4, 7], [2, 5, 8],
              [0, 4, 8], [2, 4, 6]
            ];
            
            for (const pattern of winPatterns) {
              const [a, b, c] = pattern;
              if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winner = this.board[a];
                this.gameOver = true;
                console.log(`Game over! Winner: ${this.winner}`);
                return;
              }
            }
            
            if (this.board.every(cell => cell !== '')) {
              this.winner = 'tie';
              this.gameOver = true;
              console.log('Game over! Tie game');
            }
          }
          
          draw(canvas) {
            const ctx = canvas.getContext('2d');
            const size = 300;
            const cellSize = size / 3;
            
            // Clear canvas with gradient
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#f8f9fa');
            gradient.addColorStop(1, '#e9ecef');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // Draw grid lines
            ctx.strokeStyle = '#495057';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            
            for (let i = 1; i < 3; i++) {
              ctx.beginPath();
              ctx.moveTo(i * cellSize, 10);
              ctx.lineTo(i * cellSize, size - 10);
              ctx.stroke();
              
              ctx.beginPath();
              ctx.moveTo(10, i * cellSize);
              ctx.lineTo(size - 10, i * cellSize);
              ctx.stroke();
            }
            
            // Draw X's and O's
            ctx.font = `bold ${cellSize * 0.6}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            for (let i = 0; i < 9; i++) {
              if (this.board[i]) {
                const row = Math.floor(i / 3);
                const col = i % 3;
                const x = col * cellSize + cellSize / 2;
                const y = row * cellSize + cellSize / 2;
                
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                
                ctx.fillStyle = this.board[i] === 'X' ? '#e74c3c' : '#3498db';
                ctx.fillText(this.board[i], x, y);
                
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
              }
            }
            
            // Draw current player indicator
            if (!this.gameOver) {
              ctx.strokeStyle = this.currentPlayer === 0 ? '#e74c3c' : '#3498db';
              ctx.lineWidth = 3;
              ctx.setLineDash([8, 4]);
              ctx.strokeRect(5, 5, size - 10, size - 10);
              ctx.setLineDash([]);
            }
            
            // Draw game over overlay
            if (this.gameOver) {
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.fillRect(0, 0, size, size);
              
              ctx.fillStyle = 'white';
              ctx.font = 'bold 24px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              const message = this.winner === 'tie' ? "It's a Tie!" : `${this.winner} Wins!`;
              ctx.fillText(message, size / 2, size / 2 - 20);
              
              ctx.font = '16px Arial';
              ctx.fillText('Refresh to play again', size / 2, size / 2 + 20);
            }
          }
          
          serialize() {
            return {
              board: this.board,
              currentPlayer: this.currentPlayer,
              winner: this.winner,
              gameOver: this.gameOver,
              lastMoveTime: this.lastMoveTime
            };
          }
          
          deserialize(value) {
            this.board = value.board || Array(9).fill('');
            this.currentPlayer = value.currentPlayer || 0;
            this.winner = value.winner || null;
            this.gameOver = value.gameOver || false;
            this.lastMoveTime = value.lastMoveTime || 0;
          }
        }

        console.log('Creating RollbackWrapper...');
        const wrapper = new window.netplayjs.RollbackWrapper(NetplayTicTacToe);
        netplayWrapperRef.current = wrapper;
        
        setGameStatus('Connecting to multiplayer...');
        setDebugInfo('✅ Starting multiplayer game...');
        
        // Start the game
        wrapper.start(gameContainerRef.current);
        
        console.log('✅ Multiplayer game started successfully!');
        setDebugInfo('✅ Multiplayer game running!');
        showToast('Multiplayer game started! Share this URL!', 'success');
        
        setTimeout(() => {
          setGameStatus('🎮 Share this URL with friends to play together!');
        }, 1500);
        
      } catch (error) {
        console.error('Failed to start online game:', error);
        setGameStatus(`Error: ${error.message}`);
        setDebugInfo(`❌ Error: ${error.message}`);
        showToast(`Failed to start multiplayer: ${error.message}`, 'error');
      }
    }, 100); // Wait 100ms for React to render the container
  };

  const startLocalGame = () => {
    console.log('Starting local game...');
    setGameMode('local');
    setDebugInfo('Local game mode');
  };

  const backToMenu = () => {
    console.log('Returning to menu...');
    
    // Clean up NetplayJS game
    if (netplayWrapperRef.current && gameContainerRef.current) {
      try {
        gameContainerRef.current.innerHTML = '';
        netplayWrapperRef.current = null;
        console.log('Game cleaned up');
      } catch (error) {
        console.error('Error cleaning up game:', error);
      }
    }
    
    setGameMode('menu');
    setGameStatus('');
    setDebugInfo(netplayReady ? '✅ NetplayJS ready' : 'Loading NetplayJS...');
  };

  const shareGame = async () => {
    const shareData = {
      title: 'Play Tic Tac Toe with me!',
      text: `Join my Tic Tac Toe game! ${playerName ? `I'm ${playerName}` : ''}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Game shared successfully! 📤', 'success');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Game URL copied to clipboard! 📋', 'success');
      } else {
        const dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showToast('Game URL copied! 📋', 'success');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      showToast('Failed to share game', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-5">
      <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/25">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
            🎮 Tic Tac Toe
          </h1>
          {gameMode === 'online' && (
            <div className="inline-block px-4 py-2 bg-green-500/25 border border-green-400/50 rounded-full text-sm mb-2 text-white font-medium">
              🌐 Online Multiplayer
            </div>
          )}
          {gameMode === 'local' && (
            <div className="inline-block px-4 py-2 bg-blue-500/25 border border-blue-400/50 rounded-full text-sm mb-2 text-white font-medium">
              🏠 Local Game
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-2 bg-black/20 rounded-lg border border-white/20 text-xs text-white/80 font-mono">
          Status: {debugInfo}
        </div>

        {/* Menu */}
        {gameMode === 'menu' && (
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Enter your name (optional)"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-3 border-none rounded-xl bg-white/15 text-white placeholder-white/70 backdrop-blur border border-white/30 font-medium"
              maxLength={20}
            />

            <div>
              <h3 className="text-xl font-semibold mb-4 text-white select-none">
                Choose Game Mode:
              </h3>

              {/* Local Game */}
              <div className="mb-4">
                <button
                  onClick={startLocalGame}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-bold text-white transition-all transform hover:scale-[1.02] shadow-lg border border-blue-400/30 select-none"
                >
                  🎮 Local Game (Same Device)
                  <div className="text-sm font-normal opacity-90 mt-1">
                    Play with someone next to you
                  </div>
                </button>
              </div>

              {/* Online Multiplayer */}
              <div className="mb-4">
                <button
                  onClick={startOnlineGame}
                  disabled={!netplayReady}
                  className={`w-full p-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] shadow-lg border select-none ${
                    netplayReady 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-green-400/30' 
                      : 'bg-gray-500/50 border-gray-400/30 cursor-not-allowed'
                  }`}
                >
                  🌐 Online Multiplayer
                  <div className="text-sm font-normal opacity-90 mt-1">
                    {netplayReady ? 'Play with friends anywhere' : 'Loading...'}
                  </div>
                </button>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-white/70 bg-white/10 rounded-lg p-3 border border-white/20">
                <strong>Online Multiplayer:</strong><br/>
                • Works on WiFi and cellular networks<br/>
                • No servers needed - direct P2P connection<br/>
                • Share URL to invite friends instantly
              </div>
            </div>
          </div>
        )}

        {/* Local Game */}
        {gameMode === 'local' && (
          <div className="space-y-4">
            <LocalGame playerName={playerName} />
            <button
              onClick={backToMenu}
              className="w-full p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 font-semibold transition-all text-white"
            >
              Back to Menu
            </button>
          </div>
        )}

        {/* Online Game - Container always rendered when in online mode */}
        {gameMode === 'online' && (
          <div className="space-y-4">
            <div className="text-center">
              {/* Game Container - This is always rendered when in online mode */}
              <div 
                ref={gameContainerRef}
                className="mx-auto mb-4 rounded-xl overflow-hidden shadow-lg border-2 border-white/20"
                style={{ 
                  width: '300px', 
                  height: '300px', 
                  background: 'rgba(255,255,255,0.1)',
                  margin: '0 auto'
                }}
              />
              
              {gameStatus && (
                <div className="text-white text-sm mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/50">
                  {gameStatus}
                </div>
              )}
              
              <div className="text-xs text-white/60 mb-4">
                Powered by NetplayJS - Advanced P2P networking
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={shareGame}
                className="flex-1 p-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 font-semibold transition-all text-white"
              >
                📤 Share Game
              </button>
              <button
                onClick={backToMenu}
                className="flex-1 p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 font-semibold transition-all text-white"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="text-center mt-6 text-white/60 text-xs">
          © {new Date().getFullYear()} relbns - Powered by NetplayJS
        </div>
      </div>
    </div>
  );
}

export default App;