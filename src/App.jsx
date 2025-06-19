// src/App.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import GameBoard from './components/GameBoard';
import ConnectionBadge from './components/ConnectionBadge';
import PlayerInfo from './components/PlayerInfo';
import ConnectionSetup from './components/ConnectionSetup';
import AutoJoinPrompt from './components/AutoJoinPrompt';
import { useGame } from './hooks/useGame';
import { useConnection } from './hooks/useConnection';
import {
  formatPlayerName,
  getQueryParams,
  clearQueryParams,
} from './utils/helpers';

function App() {
  console.log('Deployed commit:', import.meta.env.VITE_COMMIT_SHA);
  // UI state
  const [gamePhase, setGamePhase] = useState('setup'); // 'setup' | 'auto-join' | 'playing'
  const [playerName, setPlayerName] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [isLocalGame, setIsLocalGame] = useState(false);
  const [autoJoinData, setAutoJoinData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Use refs to avoid circular dependencies
  const isHostRef = useRef(false);
  const playerNameRef = useRef('');
  const hostStartsRef = useRef(true);

  // Initialize game logic
  const {
    gameService,
    gameBoard,
    playerSymbol,
    opponentSymbol,
    myTurn,
    gameEnded,
    gameResult,
    hostStarts,
    assignPlayerSymbols,
    makeMove,
    makeLocalMove,
    handleOpponentMove,
    resetGame,
    simulateOpponentMove,
  } = useGame();

  // Update refs when values change
  useEffect(() => {
    playerNameRef.current = playerName;
  }, [playerName]);

  useEffect(() => {
    hostStartsRef.current = hostStarts;
  }, [hostStarts]);

  // Handle messages from connection - stable callback
  const handleMessage = useCallback(
    (data) => {
      console.log('App received message:', data);

      switch (data.type) {
        case 'playerInfo':
          console.log('Received player info:', data);
          setOpponentName(data.name || 'Guest');

          if (isHostRef.current) {
            // Host receives guest info, send back game start info
            console.log('Host sending game start info');
            // Use timeout to ensure connection is stable
            setTimeout(() => {
              connectionRef.current?.sendMessage({
                type: 'gameStart',
                hostStarts: hostStartsRef.current,
                hostName: formatPlayerName(playerNameRef.current, 'Host'),
              });

              // Start game after sending info
              setTimeout(() => {
                assignPlayerSymbols(true, hostStartsRef.current);
                setGamePhase('playing');
              }, 300);
            }, 100);
          }
          break;

        case 'gameStart':
          console.log('Received game start:', data);
          setOpponentName(data.hostName || 'Host');

          // Guest receives game start, assign symbols and start
          setTimeout(() => {
            assignPlayerSymbols(false, data.hostStarts);
            setGamePhase('playing');
          }, 300);
          break;

        case 'move':
          console.log('Received move:', data);
          handleOpponentMove(data.index, data.symbol);
          break;

        case 'newGame':
          console.log('Received new game request');
          resetGame();
          assignPlayerSymbols(isHostRef.current, !hostStartsRef.current);
          break;
      }
    },
    [assignPlayerSymbols, handleOpponentMove, resetGame]
  );

  // Initialize connection logic
  const {
    selectedMethod,
    isHost,
    isHosting,
    isJoining,
    gameCode,
    joinCode,
    status,
    selectMethod,
    hostGame: connectionHostGame,
    joinGame,
    connectToGame,
    autoJoinGame,
    sendMessage,
    disconnect: connectionDisconnect,
    shareGameCode,
    setJoinCode,
    connectionService,
  } = useConnection(handleMessage);

  // Store connection service reference
  const connectionRef = useRef(null);
  useEffect(() => {
    connectionRef.current = { sendMessage };
  }, [sendMessage]);

  // Update host ref when isHost changes
  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  // Check for query parameters on app start
  useEffect(() => {
    const queryParams = getQueryParams();
    if (queryParams.code && queryParams.code.length === 4) {
      setAutoJoinData({
        code: queryParams.code,
        method: queryParams.method,
      });
      setGamePhase('auto-join');
      clearQueryParams();
    }
  }, []);

  // Monitor connection status
  useEffect(() => {
    if (status.type === 'success' && status.message.includes('Connected')) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [status]);

  // Game actions
  const handleLocalGame = useCallback(() => {
    setIsLocalGame(true);
    setOpponentName('Player 2');
    setGamePhase('playing');
  }, []);

  const handleCellClick = useCallback(
    (index) => {
      if (isLocalGame) {
        makeLocalMove(index);
      } else {
        const moveSuccessful = makeMove(index, sendMessage);

        // If no real connection, simulate opponent move
        if (moveSuccessful && !isConnected) {
          setTimeout(() => simulateOpponentMove(gameBoard), 1000);
        }
      }
    },
    [
      makeMove,
      makeLocalMove,
      sendMessage,
      simulateOpponentMove,
      gameBoard,
      isLocalGame,
      isConnected,
    ]
  );

  const handleHostGame = useCallback(async () => {
    await connectionHostGame(gameService);
  }, [connectionHostGame, gameService]);

  const handleConnectToGame = useCallback(async () => {
    const success = await connectToGame();
    if (success) {
      // Send player info immediately after connection is established
      setTimeout(() => {
        console.log('Guest sending player info');
        sendMessage({
          type: 'playerInfo',
          name: formatPlayerName(playerName, 'Guest'),
        });
      }, 1000);
    }
  }, [connectToGame, sendMessage, playerName]);

  const handleAutoJoin = useCallback(async () => {
    if (!autoJoinData) return;

    const success = await autoJoinGame(autoJoinData.code, autoJoinData.method);
    if (success) {
      // Send player info after auto-joining
      setTimeout(() => {
        console.log('Auto-join guest sending player info');
        sendMessage({
          type: 'playerInfo',
          name: formatPlayerName(playerName, 'Guest'),
        });
      }, 1500);
    }
  }, [autoJoinGame, autoJoinData, sendMessage, playerName]);

  const handleDeclineAutoJoin = useCallback(() => {
    setAutoJoinData(null);
    setGamePhase('setup');
  }, []);

  const handleNewGame = useCallback(() => {
    if (isLocalGame) {
      resetGame();
    } else {
      // Send new game message and reset locally
      sendMessage({ type: 'newGame' });
      resetGame();
      assignPlayerSymbols(isHost, !hostStarts);
    }
  }, [
    sendMessage,
    resetGame,
    assignPlayerSymbols,
    isHost,
    hostStarts,
    isLocalGame,
  ]);

  const handleDisconnect = useCallback(() => {
    if (!isLocalGame) {
      connectionDisconnect();
    }

    // Reset all state
    setGamePhase('setup');
    setOpponentName('');
    setIsLocalGame(false);
    setAutoJoinData(null);
    setIsConnected(false);
    resetGame();
  }, [connectionDisconnect, resetGame, isLocalGame]);

  // Handle successful connection from host side
  useEffect(() => {
    if (
      isHost &&
      status.type === 'success' &&
      status.message.includes('Player connected')
    ) {
      console.log('Host detected player connection');
      setIsConnected(true);
    }
  }, [isHost, status]);

  // Helper functions for display
  const getCurrentPlayer = () => {
    if (gameEnded) return 0;
    if (isLocalGame) {
      return myTurn ? 1 : 2;
    }
    if (isHost) {
      return myTurn ? 1 : 2;
    } else {
      return myTurn ? 2 : 1;
    }
  };

  const getTurnIndicator = () => {
    if (gameEnded) return 'Game Over';
    if (isLocalGame) {
      return myTurn ? "Player 1's turn (X)" : "Player 2's turn (O)";
    }
    return myTurn ? 'Your turn' : `${opponentName}'s turn`;
  };

  const getPlayer1 = () => {
    if (isLocalGame) {
      return {
        name: formatPlayerName(playerName, 'Player 1'),
        symbol: 'X',
      };
    }
    return {
      name: isHost ? formatPlayerName(playerName, 'Host') : opponentName,
      symbol: isHost ? playerSymbol : opponentSymbol,
    };
  };

  const getPlayer2 = () => {
    if (isLocalGame) {
      return {
        name: 'Player 2',
        symbol: 'O',
      };
    }
    return {
      name: isHost ? opponentName : formatPlayerName(playerName, 'Guest'),
      symbol: isHost ? opponentSymbol : playerSymbol,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-5 select-none">
      <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/25">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
            🎮 Tic Tac Toe
          </h1>

          {gamePhase === 'playing' && !isLocalGame && (
            <ConnectionBadge
              method={selectedMethod}
              code={gameCode}
              onShare={shareGameCode}
              isHost={isHost}
            />
          )}

          {gamePhase === 'playing' && isLocalGame && (
            <div className="inline-block px-4 py-2 bg-blue-500/25 border border-blue-400/50 rounded-full text-sm mb-2 text-white font-medium">
              🏠 Local Game
            </div>
          )}
        </div>

        {/* Auto Join Phase */}
        {gamePhase === 'auto-join' && autoJoinData && (
          <AutoJoinPrompt
            gameCode={autoJoinData.code}
            method={autoJoinData.method}
            onJoin={handleAutoJoin}
            onDecline={handleDeclineAutoJoin}
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
          />
        )}

        {/* Setup Phase */}
        {gamePhase === 'setup' && (
          <ConnectionSetup
            selectedMethod={selectedMethod}
            onMethodSelect={selectMethod}
            onHost={handleHostGame}
            onJoin={joinGame}
            onLocalGame={handleLocalGame}
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            gameCode={gameCode}
            joinCode={joinCode}
            onJoinCodeChange={setJoinCode}
            onConnect={handleConnectToGame}
            onShareCode={shareGameCode}
            status={status}
            isHosting={isHosting}
            isJoining={isJoining}
          />
        )}

        {/* Game Phase */}
        {gamePhase === 'playing' && (
          <div className="space-y-4">
            <PlayerInfo
              player1={getPlayer1()}
              player2={getPlayer2()}
              currentPlayer={getCurrentPlayer()}
              isHost={isLocalGame ? true : isHost}
            />

            <div className="text-center">
              <div
                className={`text-xl font-bold mb-4 ${
                  myTurn ? 'text-yellow-300' : 'text-gray-300'
                }`}
              >
                {getTurnIndicator()}
              </div>
            </div>

            <GameBoard
              board={gameBoard}
              onCellClick={handleCellClick}
              myTurn={isLocalGame ? true : myTurn} // In local game, always allow moves
              gameEnded={gameEnded}
              playerSymbol={isLocalGame ? (myTurn ? 'X' : 'O') : playerSymbol}
            />

            {gameResult && (
              <div className="text-center p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                <div className="text-2xl font-bold text-white">
                  {gameResult.type === 'tie'
                    ? "🤝 It's a Tie!"
                    : isLocalGame
                    ? `🎉 ${
                        gameResult.winner === 'X' ? 'Player 1' : 'Player 2'
                      } Wins!`
                    : gameResult.isPlayerWin
                    ? '🎉 You Win!'
                    : `😔 ${opponentName} Wins!`}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {gameEnded && (
                <button
                  onClick={handleNewGame}
                  className="flex-1 p-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 font-semibold transition-all text-white"
                >
                  New Game
                </button>
              )}
              <button
                onClick={handleDisconnect}
                className="flex-1 p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 font-semibold transition-all text-white"
              >
                {isLocalGame ? 'Back to Menu' : 'Disconnect'}
              </button>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="text-center mt-6 text-white/60 text-xs">
          © 2024 @relbns - Open Source
        </div>
      </div>
    </div>
  );
}

export default App;
