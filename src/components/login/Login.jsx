import { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const { accounts, setCurrentAccount } = useAccount();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const account = accounts.find(
      acc => acc.owner === username && acc.pin === pin && acc.active
    );

    if (account) {
      setCurrentAccount(account);
      setUsername('');
      setPin('');
      // Reset timer when logging in
      window.dispatchEvent(new Event('userActivity'));
    } else {
      alert('Invalid credentials or account is closed');
    }
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="user"
        className="login__input login__input--user"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="PIN"
        maxLength="4"
        className="login__input login__input--pin"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <button className="login__btn">&rarr;</button>
    </form>
  );
}

export default Login;