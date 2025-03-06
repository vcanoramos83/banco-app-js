import { createContext, useContext, useState } from 'react';
import { faker } from '@faker-js/faker';

const AccountContext = createContext();

const generateRandomAccount = () => {
  const movements = Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
    amount: faker.number.float({ min: -1000, max: 2000, precision: 0.01 }),
    date: faker.date.past({ years: 1 }).toISOString()
  }));

  const balance = movements.reduce((acc, mov) => acc + mov.amount, 0);

  return {
    owner: faker.person.fullName(),
    pin: faker.string.numeric(4),
    movements,
    balance,
    active: true
  };
};

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState([
    {
      owner: 'Juan Daniel',
      pin: '1111',
      movements: [],
      balance: 1000,
      active: true
    },
    generateRandomAccount(),
    generateRandomAccount(),
    generateRandomAccount()
  ]);

  const [currentAccount, setCurrentAccount] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const addMovement = (accountIndex, amount) => {
    const movement = {
      amount,
      date: new Date().toISOString(),
    };
    
    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = {
      ...updatedAccounts[accountIndex],
      movements: [...updatedAccounts[accountIndex].movements, movement],
      balance: updatedAccounts[accountIndex].balance + amount
    };
    
    return updatedAccounts;
  };

  const closeAccount = (username, pin) => {
    const accountIndex = accounts.findIndex(
      acc => acc.owner === username && acc.pin === pin && acc.active
    );
    
    if (accountIndex === -1) {
      showNotification('Invalid credentials or account already closed', 'error');
      throw new Error('Invalid credentials or account already closed');
    }

    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = {
      ...updatedAccounts[accountIndex],
      active: false
    };
    
    setAccounts(updatedAccounts);
    setCurrentAccount(null);
    showNotification('Account closed successfully', 'success');
  };

  const transfer = (receiverName, amount) => {
    if (!currentAccount) {
      showNotification('Please log in first', 'error');
      throw new Error('Please log in first');
    }

    if (amount <= 0) {
      showNotification('Transfer amount must be positive', 'error');
      throw new Error('Transfer amount must be positive');
    }

    if (amount > currentAccount.balance) {
      showNotification('Insufficient funds', 'error');
      throw new Error('Insufficient funds');
    }

    const receiverIndex = accounts.findIndex(
      acc => acc.owner === receiverName && acc.active
    );

    if (receiverIndex === -1) {
      showNotification('Receiver account not found or inactive', 'error');
      throw new Error('Receiver account not found or inactive');
    }

    const senderIndex = accounts.findIndex(acc => acc.owner === currentAccount.owner);
    
    // Update both accounts with movements
    let updatedAccounts = addMovement(senderIndex, -amount);
    updatedAccounts = addMovement(receiverIndex, amount);

    setAccounts(updatedAccounts);
    setCurrentAccount(updatedAccounts[senderIndex]);
    showNotification(`Successfully transferred ${amount}€ to ${receiverName}`, 'success');
  };

  const requestLoan = (amount) => {
    if (!currentAccount) {
      showNotification('Please log in first', 'error');
      throw new Error('Please log in first');
    }

    if (amount <= 0) {
      showNotification('Loan amount must be positive', 'error');
      throw new Error('Loan amount must be positive');
    }

    const maxLoanAmount = currentAccount.balance * 2;
    if (amount > maxLoanAmount) {
      showNotification(`Maximum loan amount is ${maxLoanAmount}€ (200% of your balance)`, 'error');
      throw new Error(`Maximum loan amount is ${maxLoanAmount} (200% of your balance)`);
    }

    const accountIndex = accounts.findIndex(acc => acc.owner === currentAccount.owner);
    const updatedAccounts = addMovement(accountIndex, amount);

    setAccounts(updatedAccounts);
    setCurrentAccount(updatedAccounts[accountIndex]);
    showNotification(`Loan approved! ${amount}€ has been deposited to your account`, 'success');
  };

  const value = {
    accounts,
    setAccounts,
    currentAccount,
    setCurrentAccount,
    closeAccount,
    transfer,
    requestLoan,
    notification,
    hideNotification
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}
