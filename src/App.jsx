import './App.css';
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
import { AccountProvider, useAccount } from './context/AccountContext';

function AppContent() {
  const { notification, hideNotification } = useAccount();

  return (
    <>
      <nav>
        <Welcome />
        <img src="logo.png" alt="Logo" className="logo" />
        <Login />
      </nav>

      <main className="app">
        {/* BALANCE */}
        <Balance />

        {/* MOVEMENTS */}
        <Movements />

        {/* SUMMARY */}
        <Summary />

        {/* OPERATION: TRANSFERS */}
        <Transfer />

        {/* OPERATION: LOAN */}
        <Loan />

        {/* OPERATION: CLOSE */}
        <Close />

        {/* TIMER */}
        <LogoutTimer />
      </main>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AccountProvider>
      <AppContent />
    </AccountProvider>
  );
}

export default App;