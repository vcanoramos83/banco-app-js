import { createContext, useContext, useState } from 'react';

const AccountContext = createContext();

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState([
    {
      owner: 'Juan Daniel',
      pin: '1111',
      movements: [],
      balance: 1000,
      active: true
    }
  ]);

  const [currentAccount, setCurrentAccount] = useState(null);

  const closeAccount = (username, pin) => {
    const accountIndex = accounts.findIndex(
      acc => acc.owner === username && acc.pin === pin && acc.active
    );
    
    if (accountIndex === -1) {
      throw new Error('Invalid credentials or account already closed');
    }

    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = {
      ...updatedAccounts[accountIndex],
      active: false
    };
    
    setAccounts(updatedAccounts);
    setCurrentAccount(null);
  };

  const transfer = (receiverName, amount) => {
    if (!currentAccount) {
      throw new Error('Please log in first');
    }

    if (amount <= 0) {
      throw new Error('Transfer amount must be positive');
    }

    if (amount > currentAccount.balance) {
      throw new Error('Insufficient funds');
    }

    const receiverIndex = accounts.findIndex(
      acc => acc.owner === receiverName && acc.active
    );

    if (receiverIndex === -1) {
      throw new Error('Receiver account not found or inactive');
    }

    const updatedAccounts = [...accounts];
    const senderIndex = accounts.findIndex(acc => acc.owner === currentAccount.owner);

    // Update sender's account
    updatedAccounts[senderIndex] = {
      ...updatedAccounts[senderIndex],
      movements: [...updatedAccounts[senderIndex].movements, -amount],
      balance: updatedAccounts[senderIndex].balance - amount
    };

    // Update receiver's account
    updatedAccounts[receiverIndex] = {
      ...updatedAccounts[receiverIndex],
      movements: [...updatedAccounts[receiverIndex].movements, amount],
      balance: updatedAccounts[receiverIndex].balance + amount
    };

    setAccounts(updatedAccounts);
    setCurrentAccount(updatedAccounts[senderIndex]);
  };

  const value = {
    accounts,
    setAccounts,
    currentAccount,
    setCurrentAccount,
    closeAccount,
    transfer
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
