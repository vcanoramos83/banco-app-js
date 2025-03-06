import { useState, useEffect } from 'react';
import { useAccount } from '../../context/AccountContext';
import './LogoutTimer.css';

export default function LogoutTimer() {
  const { currentAccount, setCurrentAccount } = useAccount();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!currentAccount) {
      setTimeLeft(300);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCurrentAccount(null);
          return 300;
        }
        // Activar advertencia cuando quedan 60 segundos
        if (prev === 60) {
          setIsWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    const resetTimer = () => {
      setTimeLeft(300);
      setIsWarning(false);
    };

    // Reset timer on user activity
    window.addEventListener('userActivity', resetTimer);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    return () => {
      clearInterval(timer);
      window.removeEventListener('userActivity', resetTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      setIsWarning(false);
    };
  }, [currentAccount, setCurrentAccount]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (!currentAccount) return null;

  return (
    <div className={`timer ${isWarning ? 'timer--warning' : ''}`}>
      {isWarning && <span className="timer__warning">¡Sesión por expirar! </span>}
      You will be logged out in <span>{formatTime(timeLeft)}</span>
    </div>
  );
}
