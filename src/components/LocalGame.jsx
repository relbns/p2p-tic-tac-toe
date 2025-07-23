// src/components/LocalGame.jsx
import React, { useState, useCallback } from 'react';
import { formatPlayerName } from '../utils/helpers';

const LocalGame = ({ playerName }) => {
  const [gameBoard, setGameBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X'); // X always goes first
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const checkWinner = useCallback((board) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }, []);

  const handleCellClick = useCallback((index) => {
    if (gameBoard[index] !== '' || gameEnded) return;

    const newBoard = [...gameBoard];
    newBoard[index] = currentPlayer;
    setGameBoard(newBoard);

    // Check for winner
    const winner = checkWinner(newBoard);
    if (winner) {
      setGameEnded(true);
      setGameResult({ type: 'win', winner });
    } else if (newBoard.every(cell => cell !== '')) {
      setGameEnded(true);
      setGameResult({ type: 'tie' });
    } else {
      // Switch players
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [gameBoard, currentPlayer, gameEnded, checkWinner]);

  const resetGame = useCallback(() => {
    setGameBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setGameEnded(false);
    setGameResult(null);
  }, []);

  const getPlayerName = (symbol) => {
    if (symbol === 'X') {
      return formatPlayerName(playerName, 'Player 1');
    } else {
      return 'Player 2';
    }
  };

  return (
    <div className="space-y-4">
      {/* Player Info */}
      <div className="flex justify-between mb-4 p-3 bg-black/15 rounded-lg border border-white/20">
        <div className={`text-center flex-1 ${currentPlayer === 'X' && !gameEnded ? 'bg-yellow-500/25 rounded p-2 border border-yellow-400/40' : ''}`}>
          <div className="font-medium text-white">{getPlayerName('X')}</div>
          <div className="text-xl font-bold text-red-400">X</div>
        </div>
        <div className={`text-center flex-1 ${currentPlayer === 'O' && !gameEnded ? 'bg-yellow-500/25 rounded p-2 border border-yellow-400/40' : ''}`}>
          <div className="font-medium text-white">{getPlayerName('O')}</div>
          <div className="text-xl font-bold text-blue-400">O</div>
        </div>
      </div>

      {/* Turn Indicator */}
      <div className="text-center">
        <div className="text-xl font-bold mb-4 text-yellow-300">
          {gameEnded ? 'Game Over' : `${getPlayerName(currentPlayer)}'s Turn`}
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto my-5">
        {gameBoard.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            className={`
              aspect-square bg-white/15 border-2 border-white/35 rounded-xl 
              flex items-center justify-center text-3xl font-bold 
              backdrop-blur transition-all duration-300
              ${cell ? 'cursor-not-allowed opacity-70' : 
                gameEnded ? 'cursor-not-allowed opacity-60' : 
                'cursor-pointer hover:bg-white/25 hover:border-white/55 hover:scale-105'}
              ${cell === 'X' ? 'text-red-400 shadow-lg' : cell === 'O' ? 'text-blue-400 shadow-lg' : ''}
            `}
            style={{
              textShadow: cell ? '0 2px 8px rgba(0, 0, 0, 0.5)' : 'none'
            }}
          >
            {cell}
          </div>
        ))}
      </div>

      {/* Game Result */}
      {gameResult && (
        <div className="text-center p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
          <div className="text-2xl font-bold text-white">
            {gameResult.type === 'tie'
              ? "🤝 It's a Tie!"
              : `🎉 ${getPlayerName(gameResult.winner)} Wins!`
            }
          </div>
        </div>
      )}

      {/* New Game Button */}
      {gameEnded && (
        <div className="text-center mt-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 font-semibold transition-all text-white"
          >
            🔄 New Game
          </button>
        </div>
      )}
    </div>
  );
};

export default LocalGame;