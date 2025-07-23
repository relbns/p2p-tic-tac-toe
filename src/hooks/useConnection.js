// src/hooks/useConnection.js - Restored WebRTC Hook
import { useState, useEffect, useCallback, useRef } from 'react';
import { ConnectionService } from '../services/ConnectionService';
import { generateShareUrl, showToast } from '../utils/helpers';

export const useConnection = (onMessage) => {
  const [connectionService, setConnectionService] = useState(null);
  const [selectedMethod, selectMethod] = useState('webrtc');
  const [isHost, setIsHost] = useState(false);
  const [isHosting, setIsHosting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [status, setStatus] = useState({ message: 'Ready to play!', type: '' });

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
  }, []);

  const hostGame = useCallback(async (gameService) => {
    setIsHost(true);
    setIsHosting(true);
    const code = gameService.generateGameCode();
    setGameCode(code);

    if (connectionService) {
      await connectionService.hostGame(code);
    }
  }, [connectionService]);

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

    if (connectionService) {
      await connectionService.joinGame(code);
      return true;
    }
    return false;
  }, [joinCode, connectionService]);

  const autoJoinGame = useCallback(async (code, method) => {
    setIsHost(false);
    setIsJoining(true);
    setJoinCode(code);

    // Store the game code for auto-join guests too
    setGameCode(code);

    if (connectionService) {
      await connectionService.joinGame(code);
      return true;
    }
    return false;
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
    setIsHost(false);
    setIsHosting(false);
    setIsJoining(false);
    setGameCode('');
    setJoinCode('');
    setStatus({ message: 'Ready to play!', type: '' });
  }, [connectionService]);

  const shareGameCode = useCallback(async () => {
    if (!gameCode) {
      showToast('No game code to share', 'error');
      return;
    }

    // Only hosts can share the game
    if (!isHost) {
      showToast('Only the host can share the game room', 'error');
      return;
    }

    const shareUrl = generateShareUrl(gameCode, 'webrtc');
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
  }, [gameCode, isHost]);

  return {
    selectedMethod,
    selectMethod,
    isHost,
    isHosting,
    isJoining,
    gameCode,
    joinCode,
    status,
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
