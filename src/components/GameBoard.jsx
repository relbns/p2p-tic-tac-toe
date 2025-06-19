import React from 'react';

const GameBoard = ({ board, onCellClick, myTurn, gameEnded, playerSymbol }) => (
  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto my-5">
    {board.map((cell, index) => (
      <div
        key={index}
        onClick={() => onCellClick(index)}
        className={`
          aspect-square bg-white/10 border-2 border-white/30 rounded-xl 
          flex items-center justify-center text-3xl font-bold 
          backdrop-blur transition-all duration-300
          ${
            cell
              ? 'cursor-not-allowed opacity-60'
              : !myTurn || gameEnded
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer hover:bg-white/20 hover:border-white/50 hover:scale-105'
          }
          ${cell === 'X' ? 'text-red-400' : cell === 'O' ? 'text-blue-400' : ''}
        `}
      >
        {cell}
      </div>
    ))}
  </div>
);

export default GameBoard;
