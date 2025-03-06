import { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import './Operation.css';

function Transfer() {
  const [receiverName, setReceiverName] = useState('');
  const [amount, setAmount] = useState('');
  const { transfer, currentAccount } = useAccount();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      transfer(receiverName, Number(amount));
      setReceiverName('');
      setAmount('');
      alert('Transfer successful!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="operation operation--transfer">
      <h2>Transfer money</h2>
      <form className="form form--transfer" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form__input form__input--to"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          placeholder="receiver name"
          disabled={!currentAccount}
        />
        <input
          type="number"
          className="form__input form__input--amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="amount"
          disabled={!currentAccount}
        />
        <button className="form__btn form__btn--transfer" disabled={!currentAccount}>
          &rarr;
        </button>
        <label className="form__label">Transfer to</label>
        <label className="form__label">Amount</label>
      </form>
    </div>
  );
}

export default Transfer;
