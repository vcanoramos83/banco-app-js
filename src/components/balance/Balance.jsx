import { useAccount } from '../../context/AccountContext';
import moment from 'moment';
import './Balance.css';

function Balance() {
  const { currentAccount } = useAccount();

  if (!currentAccount) {
    return (
      <div className="balance">
        <div className="balance__label">Please log in to view your balance</div>
        <div className="balance__value">0€</div>
        <div className="balance__date">
          As of <span>{moment().format('MMM Do, YYYY')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="balance">
      <div className="balance__label">Current balance</div>
      <div className="balance__value">{currentAccount.balance.toFixed(2)}€</div>
      <div className="balance__date">
        As of <span>{moment().format('MMM Do, YYYY')}</span>
      </div>
    </div>
  );
}

export default Balance;
