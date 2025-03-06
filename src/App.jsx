import { useAccount } from './context/AccountContext';
import Welcome from './components/welcome/Welcome';
import Login from './components/login/Login';
import Balance from './components/balance/Balance';
import Movements from './components/movements/Movements';
import Summary from './components/summary/Summary';
import Transfer from './components/operations/Transfer';
import Loan from './components/operations/Loan';
import Close from './components/operations/Close';
import LogoutTimer from './components/logout-timer/LogoutTimer';
import Notification from './components/notification/Notification';
import './App.css';

function App() {
  const { currentAccount, notification } = useAccount();

  return (
    <>
      <nav>
        <Welcome />
        <Login />
      </nav>

      {currentAccount && (
        <main className="app">
          <Balance />
          <Movements />
          <Summary />
          <Transfer />
          <Loan />
          <Close />
          <LogoutTimer />
        </main>
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
        />
      )}
    </>
  );
}

export default App;