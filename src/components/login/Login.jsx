import { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const { login } = useAccount();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, pin);
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="login__input login__input--user"
      />
      <input
        type="password"
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="login__input login__input--pin"
        maxLength="4"
      />
      <button className="login__btn">&rarr;</button>
    </form>
  );
};

export default Login;