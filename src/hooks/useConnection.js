import { useState, useEffect, useCallback } from 'react';
import { ConnectionService } from '../services/ConnectionService';

export const useConnection = (onMessage) => {
    const [connectionService, setConnectionService] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [isHosting, setIsHosting] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [gameCode, setGameCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [status, setStatus] = useState({ message: 'Select a connection method above', type: '' });

    // Initialize connection service
    useEffect(() => {
        const handleStatusChange = (message, type) => {
            setStatus({ message, type });
        };

        const service = new ConnectionService(onMessage, handleStatusChange);
        setConnectionService(service);

        return () => {
            service.disconnect();
        };
    }, [onMessage]);

    const selectMethod = useCallback((method) => {
        setSelectedMethod(method);
        setStatus({ message: `${method.toUpperCase()} selected. Choose host or join.`, type: '' });
    }, []);

    const hostGame = useCallback(async (gameService) => {
        setIsHost(true);
        setIsHosting(true);
        const code = gameService.generateGameCode();
        setGameCode(code);

        if (selectedMethod === 'webrtc' && connectionService) {
            await connectionService.hostGame(code);
        } else {
            // Simulate for other methods
            setStatus({ message: 'Game room created! Share the code.', type: 'success' });
        }
    }, [selectedMethod, connectionService]);

    const joinGame = useCallback(() => {
        setIsHost(false);
        setIsJoining(true);
    }, []);

    const connectToGame = useCallback(async () => {
        if (joinCode.length !== 4) {
            setStatus({ message: 'Please enter a 4-letter code', type: 'error' });
            return;
        }

        if (selectedMethod === 'webrtc' && connectionService) {
            await connectionService.joinGame(joinCode);
        } else {
            // Simulate for other methods
            setStatus({ message: 'Joining game...', type: 'loading' });
        }
    }, [joinCode, selectedMethod, connectionService]);

    const sendMessage = useCallback((message) => {
        if (connectionService) {
            return connectionService.sendMessage(message);
        }
        return false;
    }, [connectionService]);

    const disconnect = useCallback(() => {
        if (connectionService) {
            connectionService.disconnect();
        }

        // Reset connection state
        setSelectedMethod(null);
        setIsHost(false);
        setIsHosting(false);
        setIsJoining(false);
        setGameCode('');
        setJoinCode('');
        setStatus({ message: 'Select a connection method above', type: '' });
    }, [connectionService]);

    const shareGameCode = useCallback(async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}`;
        const shareText = `Join my Tic Tac Toe game! Code: ${gameCode}\n${shareUrl}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Join my Tic Tac Toe game!',
                    text: `Game code: ${gameCode}`,
                    url: shareUrl
                });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareText);
                // You could add a toast notification here
                console.log('Copied to clipboard!');
            }
        } catch (error) {
            console.error('Failed to share:', error);
        }
    }, [gameCode]);

    return {
        selectedMethod,
        isHost,
        isHosting,
        isJoining,
        gameCode,
        joinCode,
        status,
        selectMethod,
        hostGame,
        joinGame,
        connectToGame,
        sendMessage,
        disconnect,
        shareGameCode,
        setJoinCode
    };
};