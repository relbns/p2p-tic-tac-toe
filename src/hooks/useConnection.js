// src/hooks/useConnection.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { ConnectionService } from '../services/ConnectionService';
import { generateShareUrl, showToast } from '../utils/helpers';

export const useConnection = (onMessage) => {
  const [connectionService, setConnectionService] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [isHosting, setIsHosting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [status, setStatus] = useState({ message: 'Select a connection method above', type: '' });

  // Use ref to store the latest onMessage callback without causing re-renders
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Initialize connection service
  useEffect(() => {
    const handleMessage = (data) => {
      console.log('Connection hook received message:', data);
      if (data.type === 'connectionReady') {
        console.log('Connection is ready for game messages');
        return;
      }
      if (onMessageRef.current) {
        onMessageRef.current(data);
      }
    };

    const handleStatusChange = (message, type) => {
      console.log('Status change:', message, type);
      setStatus({ message, type });
    };

    const service = new ConnectionService(handleMessage, handleStatusChange);
    setConnectionService(service);

    return () => {
      service.disconnect();
    };
  }, []); // Remove onMessage from dependencies

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

  const connectToGame = useCallback(async (codeToJoin = null) => {
    const code = codeToJoin || joinCode;
    if (code.length !== 4) {
      setStatus({ message: 'Please enter a 4-letter code', type: 'error' });
      return false;
    }

    // Store the game code for guests too
    setGameCode(code);

    if (selectedMethod === 'webrtc' && connectionService) {
      await connectionService.joinGame(code);
      return true;
    } else {
      // Simulate for other methods
      setStatus({ message: 'Joining game...', type: 'loading' });
      return true;
    }
  }, [joinCode, selectedMethod, connectionService]);

  const autoJoinGame = useCallback(async (code, method) => {
    setSelectedMethod(method);
    setIsHost(false);
    setIsJoining(true);
    setJoinCode(code);
    
    // Store the game code for auto-join guests too
    setGameCode(code);
    
    if (method === 'webrtc' && connectionService) {
      await connectionService.joinGame(code);
      return true;
    } else {
      setStatus({ message: 'Joining game...', type: 'loading' });
      return true;
    }
  }, [connectionService]);

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
    if (!gameCode || !selectedMethod) {
      showToast('No game code to share', 'error');
      return;
    }

    // Only hosts can share the game
    if (!isHost) {
      showToast('Only the host can share the game room', 'error');
      return;
    }

    const shareUrl = generateShareUrl(gameCode, selectedMethod);
    const shareText = `Join my Tic Tac Toe game!\nCode: ${gameCode}\n${shareUrl}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join my Tic Tac Toe game!',
          text: `Game code: ${gameCode}`,
          url: shareUrl
        });
        showToast('Game shared successfully! 📤');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Game URL copied to clipboard! 📋');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Game URL copied to clipboard! 📋');
      }
    } catch (error) {
      console.error('Failed to share:', error);
      showToast('Failed to share game', 'error');
    }
  }, [gameCode, selectedMethod, isHost]);

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
    autoJoinGame,
    sendMessage,
    disconnect,
    shareGameCode,
    setJoinCode,
    connectionService
  };
};
