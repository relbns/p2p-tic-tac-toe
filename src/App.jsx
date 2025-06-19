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
  const [isLocalGame, setIsLocalGame] = useState(false);

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
    if (isLocalGame) {
      // For local games, player 1 is always X and goes first
      setGamePhase('playing');
    } else {
      assignPlayerSymbols(isHost, hostStarts);
      setGamePhase('playing');
    }
  }, [assignPlayerSymbols, isHost, hostStarts, isLocalGame]);

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
        if (moveSuccessful && !sendMessage({ type: 'ping' })) {
          setTimeout(() => simulateOpponentMove(gameBoard), 1000);
        }
      }
    },
    [makeMove, makeLocalMove, sendMessage, simulateOpponentMove, gameBoard, isLocalGame]
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
    if (isLocalGame) {
      resetGame();
    } else {
      sendMessage({ type: 'newGame' });
      resetGame();
      assignPlayerSymbols(isHost, !hostStarts);
    }
  }, [sendMessage, resetGame, assignPlayerSymbols, isHost, hostStarts, isLocalGame]);

  const handleDisconnect = useCallback(() => {
    if (!isLocalGame) {
      connectionDisconnect();
    }

    // Reset all state
    setGamePhase('setup');
    setOpponentName('');
    setIsLocalGame(false);
    resetGame();
  }, [connectionDisconnect, resetGame, isLocalGame]);

  // Helper functions for display
  const getCurrentPlayer = () => {
    if (gameEnded) return 0;
    if (isLocalGame) {
      // For local games, X is player 1, O is player 2
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
        symbol: 'X'
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
        symbol: 'O'
      };
    }
    return {
      name: isHost ? opponentName : formatPlayerName(playerName, 'Guest'),
      symbol: isHost ? opponentSymbol : playerSymbol,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-5">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
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
            />
          )}

          {gamePhase === 'playing' && isLocalGame && (
            <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm mb-2">
              🏠 Local Game
            </div>
          )}
        </div>

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
                <div className="text-2xl font-bold">
                  {gameResult.type === 'tie'
                    ? "🤝 It's a Tie!"
                    : isLocalGame
                    ? `🎉 ${gameResult.winner === 'X' ? 'Player 1' : 'Player 2'} Wins!`
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
                {isLocalGame ? 'Back to Menu' : 'Disconnect'}
              </button>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="text-center mt-6 text-white/40 text-xs">
          © {new Date().getFullYear()} @relbns - Open Source
        </div>
      </div>
    </div>
  );
}

export default App;
