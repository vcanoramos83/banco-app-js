import { useState, useEffect } from 'react';
import { useAccount } from '../../context/AccountContext';
import './LogoutTimer.css';

function LogoutTimer() {
  const { currentAccount, setCurrentAccount } = useAccount();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

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
        return prev - 1;
      });
    }, 1000);

    const resetTimer = () => {
      setTimeLeft(300);
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
    };
  }, [currentAccount, setCurrentAccount]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (!currentAccount) return null;

  return (
    <div className="timer">
      You will be logged out in <span>{formatTime(timeLeft)}</span>
    </div>
  );
}

export default LogoutTimer;
