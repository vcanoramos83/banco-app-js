import { useEffect } from 'react';
import { useAccount } from '../../context/AccountContext';
import './Notification.css';

export default function Notification() {
  const { notification, hideNotification } = useAccount();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000); // 3 segundos exactos

      return () => clearTimeout(timer);
    }
  }, [notification, hideNotification]);

  if (!notification) return null;

  return (
    <div className={`notification notification--${notification.type}`}>
      <p>{notification.message}</p>
    </div>
  );
}
