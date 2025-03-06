import { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import moment from 'moment';
import 'moment/locale/es';
import './Movements.css';

moment.locale('es');

export default function Movements() {
  const { currentAccount } = useAccount();
  const [sortOrder, setSortOrder] = useState('desc');

  const formatMovementDate = (date) => {
    const now = moment();
    const movementDate = moment(date);
    const days = now.diff(movementDate, 'days');

    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days <= 7) return `Hace ${days} días`;
    return movementDate.format('D [de] MMMM[,] YYYY');
  };

  const handleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  if (!currentAccount) return null;

  const sortedMovements = [...currentAccount.movements].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="movements">
      <div className="movements__header">
        <h2>Movimientos</h2>
        <button 
          onClick={handleSort} 
          className={`sort-button sort-button--${sortOrder}`}
        >
          {sortOrder === 'desc' ? '↓ Más recientes' : '↑ Más antiguos'}
        </button>
      </div>
      <div className="movements__container">
        {sortedMovements.map((mov, i) => (
          <div className="movements__row" key={i}>
            <div className={`movements__type movements__type--${mov.amount > 0 ? 'deposit' : 'withdrawal'}`}>
              {mov.amount > 0 ? 'ingreso' : 'retiro'}
            </div>
            <div className="movements__description">{mov.description}</div>
            <div className="movements__date">{formatMovementDate(mov.date)}</div>
            <div className="movements__value">{Math.abs(mov.amount).toFixed(2)}€</div>
          </div>
        ))}
      </div>
    </div>
  );
}
