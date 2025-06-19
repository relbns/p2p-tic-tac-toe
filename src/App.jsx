// src/App.jsx
import React, { useState, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import ConnectionBadge from './components/ConnectionBadge';
import PlayerInfo from './components/PlayerInfo';
import ConnectionSetup from './components/ConnectionSetup';
import { useGame } from './hooks/useGame';
import { useConnection } from './hooks/useConnection';
import { formatPlayerName } from './utils/helpers';

function App() {
  // UI state
  const [gamePhase, setGamePhase] = useState('setup'); // 'setup' | 'playing'
  const [playerName, setPlayerName] = useState('');
  const [opponentName, setOpponentName] = useState('');

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
    handleOpponentMove,
    resetGame,
    simulateOpponentMove,
  } = useGame();

  // Handle messages from connection
  const handleMessage = useCallback(
    (data) => {
      switch (data.type) {
        case 'playerInfo':
          setOpponentName(data.name);
          // We'll handle this after connection is established
          break;
        case 'gameStart':
          setOpponentName(data.hostName);
          setTimeout(() => startGame(), 1000);
          break;
        case 'move':
          handleOpponentMove(data.index, data.symbol);
          break;
        case 'newGame':
          resetGame();
          // assignPlayerSymbols will be called after connection details are available
          break;
      }
    },
    [handleOpponentMove, resetGame]
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
    sendMessage,
    disconnect: connectionDisconnect,
    shareGameCode,
    setJoinCode,
  } = useConnection(handleMessage);

  // Game actions
  const startGame = useCallback(() => {
    assignPlayerSymbols(isHost, hostStarts);
    setGamePhase('playing');
  }, [assignPlayerSymbols, isHost, hostStarts]);

  const handleCellClick = useCallback(
    (index) => {
      const moveSuccessful = makeMove(index, sendMessage);

      // If no real connection, simulate opponent move
      if (moveSuccessful && !sendMessage({ type: 'ping' })) {
        setTimeout(() => simulateOpponentMove(gameBoard), 1000);
      }
    },
    [makeMove, sendMessage, simulateOpponentMove, gameBoard]
  );

  const handleHostGame = useCallback(async () => {
    await connectionHostGame(gameService);

    // For demo purposes, simulate connection after a delay
    setTimeout(() => {
      setOpponentName('Guest Player');
      startGame();
    }, 3000);
  }, [connectionHostGame, gameService, startGame]);

  const handleConnectToGame = useCallback(async () => {
    await connectToGame();

    // For demo purposes, simulate connection after a delay
    setTimeout(() => {
      setOpponentName('Host Player');
      startGame();
    }, 1000);
  }, [connectToGame, startGame]);

  const handleNewGame = useCallback(() => {
    sendMessage({ type: 'newGame' });
    resetGame();
    assignPlayerSymbols(isHost, !hostStarts);
  }, [sendMessage, resetGame, assignPlayerSymbols, isHost, hostStarts]);

  const handleDisconnect = useCallback(() => {
    connectionDisconnect();

    // Reset all state
    setGamePhase('setup');
    setOpponentName('');
    resetGame();
  }, [connectionDisconnect, resetGame]);

  // Helper functions for display
  const getCurrentPlayer = () => {
    if (gameEnded) return 0;
    if (isHost) {
      return myTurn ? 1 : 2;
    } else {
      return myTurn ? 2 : 1;
    }
  };

  const getTurnIndicator = () => {
    if (gameEnded) return 'Game Over';
    return myTurn ? 'Your turn' : `${opponentName}'s turn`;
  };

  const getPlayer1 = () => ({
    name: isHost ? formatPlayerName(playerName, 'Host') : opponentName,
    symbol: isHost ? playerSymbol : opponentSymbol,
  });

  const getPlayer2 = () => ({
    name: isHost ? opponentName : formatPlayerName(playerName, 'Guest'),
    symbol: isHost ? opponentSymbol : playerSymbol,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-5">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
            🎮 Tic Tac Toe
          </h1>

          {gamePhase === 'playing' && (
            <ConnectionBadge
              method={selectedMethod}
              code={gameCode}
              onShare={shareGameCode}
            />
          )}
        </div>

        {/* Setup Phase */}
        {gamePhase === 'setup' && (
          <ConnectionSetup
            selectedMethod={selectedMethod}
            onMethodSelect={selectMethod}
            onHost={handleHostGame}
            onJoin={joinGame}
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            gameCode={gameCode}
            joinCode={joinCode}
            onJoinCodeChange={setJoinCode}
            onConnect={handleConnectToGame}
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
              isHost={isHost}
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
              myTurn={myTurn}
              gameEnded={gameEnded}
              playerSymbol={playerSymbol}
            />

            {gameResult && (
              <div className="text-center p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
                <div className="text-2xl font-bold">
                  {gameResult.type === 'tie'
                    ? "🤝 It's a Tie!"
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
                  className="flex-1 p-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 font-semibold transition-all"
                >
                  New Game
                </button>
              )}
              <button
                onClick={handleDisconnect}
                className="flex-1 p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 font-semibold transition-all"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
