import { useAccount } from '../../context/AccountContext';
import './Summary.css';

function Summary() {
  const { currentAccount } = useAccount();

  if (!currentAccount) {
    return (
      <div className="summary">
        <p className="summary__label">Please log in to view your summary</p>
      </div>
    );
  }

  const deposits = currentAccount.movements
    .filter(mov => mov.amount > 0)
    .reduce((acc, mov) => acc + mov.amount, 0);

  const withdrawals = currentAccount.movements
    .filter(mov => mov.amount < 0)
    .reduce((acc, mov) => acc + mov.amount, 0);

  return (
    <div className="summary">
      <p className="summary__label">In</p>
      <p className="summary__value summary__value--in">{deposits.toFixed(2)}€</p>
      <p className="summary__label">Out</p>
      <p className="summary__value summary__value--out">{Math.abs(withdrawals).toFixed(2)}€</p>
    </div>
  );
}

export default Summary;
