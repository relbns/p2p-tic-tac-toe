// src/utils/helpers.js

export const showToast = (message, type = 'success') => {
  // Simple toast implementation
  const toast = document.createElement('div');
  toast.className = `fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg font-semibold z-50 transition-opacity ${
    type === 'error' ? 'bg-red-500' : 'bg-green-500'
  } text-white`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

export const formatPlayerName = (name, defaultName = 'Player') => {
  return name?.trim() || defaultName;
};
