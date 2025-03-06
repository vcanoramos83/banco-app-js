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

  const value = {
    accounts,
    setAccounts,
    currentAccount,
    setCurrentAccount,
    closeAccount
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
