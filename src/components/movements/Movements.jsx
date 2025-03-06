import { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import moment from 'moment';
import './Movements.css';

function Movements() {
  const { currentAccount } = useAccount();
  const [sortByDate, setSortByDate] = useState('desc');

  const formatDate = (date) => {
    return moment(date).fromNow();
  };

  const getSortedMovements = () => {
    if (!currentAccount?.movements?.length) return [];
    
    return [...currentAccount.movements].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortByDate === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleSortChange = () => {
    setSortByDate(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  if (!currentAccount) {
    return (
      <div className="movements">
        <div className="movements__row">
          <p>Please log in to view movements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movements">
      <div className="movements__header">
        <h2>Movements</h2>
        <button onClick={handleSortChange}>
          Sort by date ({sortByDate === 'desc' ? 'Newest first' : 'Oldest first'})
        </button>
      </div>
      {getSortedMovements().map((movement, index) => (
        <div key={index} className="movements__row">
          <div className={`movements__type movements__type--${movement.amount > 0 ? 'deposit' : 'withdrawal'}`}>
            {movement.amount > 0 ? 'deposit' : 'withdrawal'}
          </div>
          <div className="movements__date">{formatDate(movement.date)}</div>
          <div className="movements__value">{movement.amount}€</div>
        </div>
      ))}
    </div>
  );
}

export default Movements;
