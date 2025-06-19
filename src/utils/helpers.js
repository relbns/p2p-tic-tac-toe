export const showToast = (message, type = 'success') => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg font-semibold z-50 transition-opacity ${type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
};

export const formatPlayerName = (name, defaultName = 'Player') => {
    return name?.trim() || defaultName;
};

export const getMethodDisplayName = (method) => {
    const methodNames = {
        webrtc: 'WebRTC',
        bluetooth: 'Bluetooth',
        hotspot: 'WiFi Hotspot',
        qr: 'QR Code'
    };
    return methodNames[method] || method;
};

export const validateGameCode = (code) => {
    return code && code.length === 4 && /^[A-Z0-9]+$/.test(code);
};

export const copyToClipboard = async (text) => {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};