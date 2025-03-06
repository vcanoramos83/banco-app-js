import { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import './Operation.css';

function Loan() {
  const [amount, setAmount] = useState('');
  const { requestLoan, currentAccount } = useAccount();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      requestLoan(Number(amount));
      setAmount('');
      alert('Loan approved!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="operation operation--loan">
      <h2>Request loan</h2>
      <form className="form form--loan" onSubmit={handleSubmit}>
        <input
          type="number"
          className="form__input form__input--loan-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="amount"
          disabled={!currentAccount}
        />
        <button className="form__btn form__btn--loan" disabled={!currentAccount}>
          &rarr;
        </button>
        <label className="form__label">Amount</label>
      </form>
    </div>
  );
}

export default Loan;
