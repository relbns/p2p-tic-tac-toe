import { useState, useCallback } from 'react';
import { GameService } from '../services/GameService';

export const useGame = () => {
    const [gameService] = useState(new GameService());
    const [gameBoard, setGameBoard] = useState(Array(9).fill(''));
    const [playerSymbol, setPlayerSymbol] = useState('');
    const [opponentSymbol, setOpponentSymbol] = useState('');
    const [myTurn, setMyTurn] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [hostStarts, setHostStarts] = useState(true);

    const assignPlayerSymbols = useCallback((isHost, hostStartsGame) => {
        const hostGoesFirst = hostStartsGame;

        if (isHost) {
            setPlayerSymbol(hostGoesFirst ? 'X' : 'O');
            setOpponentSymbol(hostGoesFirst ? 'O' : 'X');
        } else {
            setPlayerSymbol(hostGoesFirst ? 'O' : 'X');
            setOpponentSymbol(hostGoesFirst ? 'X' : 'O');
        }

        setMyTurn(isHost ? hostGoesFirst : !hostGoesFirst);
    }, []);

    const makeMove = useCallback((index, onSendMessage) => {
        if (!myTurn || gameBoard[index] !== '' || gameEnded) return false;

        const newBoard = [...gameBoard];
        newBoard[index] = playerSymbol;
        setGameBoard(newBoard);
        setMyTurn(false);

        // Update game service
        gameService.gameBoard = newBoard;

        // Send move to opponent
        if (onSendMessage) {
            onSendMessage({
                type: 'move',
                index: index,
                symbol: playerSymbol
            });
        }

        // Check game end
        const gameEnd = gameService.checkGameEnd();
        if (gameEnd) {
            setGameEnded(true);
            if (gameEnd.type === 'win') {
                setGameResult({
                    type: 'win',
                    winner: gameEnd.winner,
                    isPlayerWin: gameEnd.winner === playerSymbol
                });
            } else {
                setGameResult({ type: 'tie' });
            }
        }

        return true;
    }, [myTurn, gameBoard, gameEnded, playerSymbol, gameService]);

    const handleOpponentMove = useCallback((index, symbol) => {
        const newBoard = [...gameBoard];
        newBoard[index] = symbol;
        setGameBoard(newBoard);
        setMyTurn(true);

        gameService.gameBoard = newBoard;
        const gameEnd = gameService.checkGameEnd();
        if (gameEnd) {
            setGameEnded(true);
            if (gameEnd.type === 'win') {
                setGameResult({
                    type: 'win',
                    winner: gameEnd.winner,
                    isPlayerWin: gameEnd.winner === playerSymbol
                });
            } else {
                setGameResult({ type: 'tie' });
            }
        }
    }, [gameBoard, playerSymbol, gameService]);

    const resetGame = useCallback(() => {
        gameService.resetGame();
        setGameBoard(Array(9).fill(''));
        setGameEnded(false);
        setGameResult(null);
        setHostStarts(!hostStarts);
    }, [gameService, hostStarts]);

    const simulateOpponentMove = useCallback((currentBoard) => {
        const emptyCells = currentBoard.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
        if (emptyCells.length > 0 && !gameEnded) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            handleOpponentMove(randomIndex, opponentSymbol);
        }
    }, [gameEnded, opponentSymbol, handleOpponentMove]);

    return {
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
        setGameBoard,
        setGameEnded,
        setGameResult,
        setHostStarts
    };
};