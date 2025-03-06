import { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import './Operation.css';

function Close() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const { closeAccount } = useAccount();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      closeAccount(username, pin);
      setUsername('');
      setPin('');
      alert('Account closed successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="operation operation--close">
      <h2>Close account</h2>
      <form className="form form--close" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form__input form__input--user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
        <input
          type="password"
          maxLength="6"
          className="form__input form__input--pin"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
        />
        <button className="form__btn form__btn--close">&rarr;</button>
        <label className="form__label">Confirm user</label>
        <label className="form__label">Confirm PIN</label>
      </form>
    </div>
  );
}

export default Close;
