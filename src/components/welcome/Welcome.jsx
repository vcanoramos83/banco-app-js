import { useAccount } from '../../context/AccountContext';
import './Welcome.css';

function Welcome() {
  const { currentAccount } = useAccount();

  return (
    <p className="welcome">
      {currentAccount ? (
        <>
          Welcome back, <span className="welcome__user">{currentAccount.owner}</span>
        </>
      ) : (
        'Log in to get started'
      )}
    </p>
  );
}

export default Welcome;