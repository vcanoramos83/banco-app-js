import { useAccount } from '../../context/AccountContext';
import './Welcome.css';

const Welcome = () => {
  const { currentAccount } = useAccount();

  return (
    <p className="welcome">
      {currentAccount
        ? `Bienvenido/a, ${currentAccount.owner}`
        : 'Inicia sesión para comenzar'}
    </p>
  );
};

export default Welcome;