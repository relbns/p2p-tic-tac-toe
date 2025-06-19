// src/components/GameBoard.jsx
import React from 'react';

const GameBoard = ({ board, onCellClick, myTurn, gameEnded, playerSymbol }) => (
  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto my-5">
    {board.map((cell, index) => (
      <div
        key={index}
        onClick={() => onCellClick(index)}
        className={`
          aspect-square bg-white/15 border-2 border-white/35 rounded-xl 
          flex items-center justify-center text-3xl font-bold 
          backdrop-blur transition-all duration-300
          ${cell ? 'cursor-not-allowed opacity-70' : 
            (!myTurn || gameEnded) ? 'cursor-not-allowed opacity-60' : 
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
);

export default GameBoard;
