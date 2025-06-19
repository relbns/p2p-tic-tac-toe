export class GameService {
    constructor () {
        this.gameBoard = Array(9).fill('');
        this.gameEnded = false;
        this.gameCount = 0;
        this.hostStarts = true;
    }

    checkWinner (board = this.gameBoard) {
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
    }

    makeMove (index, symbol) {
        if (this.gameBoard[index] !== '' || this.gameEnded) return false;

        this.gameBoard[index] = symbol;
        return true;
    }

    checkGameEnd () {
        const winner = this.checkWinner();
        if (winner) {
            this.gameEnded = true;
            return { type: 'win', winner };
        } else if (this.gameBoard.every(cell => cell !== '')) {
            this.gameEnded = true;
            return { type: 'tie' };
        }
        return null;
    }

    resetGame () {
        this.gameBoard = Array(9).fill('');
        this.gameEnded = false;
        this.gameCount++;
        this.hostStarts = !this.hostStarts;
    }

    generateGameCode () {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}