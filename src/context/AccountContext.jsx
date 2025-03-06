import { createContext, useContext, useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

const AccountContext = createContext();

const generateInitials = (fullName) => {
  const names = fullName.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toLowerCase();
  }
  return fullName.substring(0, 2).toLowerCase();
};

const generateRandomMovement = () => {
  const isDeposit = faker.datatype.boolean();
  const amount = faker.number.float({ min: 100, max: 2000, precision: 0.01 });
  
  const descriptions = [
    'Nómina',
    'Transferencia recibida',
    'Pago recibido',
    'Depósito en efectivo',
    'Pago de factura',
    'Transferencia enviada',
    'Compra con tarjeta',
    'Retiro en cajero'
  ];
  
  return {
    amount: isDeposit ? amount : -amount,
    date: faker.date.past({ years: 1 }).toISOString(),
    description: descriptions[faker.number.int({ min: 0, max: descriptions.length - 1 })]
  };
};

const generateRandomAccount = () => {
  const fullName = faker.person.fullName();
  const movements = Array.from(
    { length: faker.number.int({ min: 3, max: 8 }) }, 
    generateRandomMovement
  );

  const balance = movements.reduce((acc, mov) => acc + mov.amount, 0);

  return {
    owner: fullName,
    username: generateInitials(fullName),
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
      username: 'jd',
      pin: '1111',
      movements: [
        {
          amount: 1000,
          date: new Date().toISOString(),
          description: 'Saldo inicial'
        }
      ],
      balance: 1000,
      active: true
    },
    generateRandomAccount(),
    generateRandomAccount(),
    generateRandomAccount()
  ]);

  // Mostrar las cuentas en la consola
  useEffect(() => {
    console.log('Cuentas disponibles:');
    accounts.forEach(account => {
      if (account.active) {
        console.log(`Usuario: ${account.owner} (${account.username}), PIN: ${account.pin}, Balance: ${account.balance.toFixed(2)}€`);
      }
    });
  }, [accounts]);

  const [currentAccount, setCurrentAccount] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const addMovement = (accountIndex, amount, description = '') => {
    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = {
      ...updatedAccounts[accountIndex],
      movements: [
        ...updatedAccounts[accountIndex].movements,
        {
          amount,
          date: new Date().toISOString(),
          description
        }
      ],
      balance: updatedAccounts[accountIndex].balance + amount
    };
    return updatedAccounts;
  };

  const transfer = (receiverUsername, amount) => {
    if (!currentAccount) {
      showNotification('Por favor, inicia sesión primero', 'error');
      throw new Error('Por favor, inicia sesión primero');
    }

    const numAmount = Number(amount);
    if (numAmount <= 0) {
      showNotification('El importe debe ser positivo', 'error');
      throw new Error('El importe debe ser positivo');
    }

    if (numAmount > currentAccount.balance) {
      showNotification('Saldo insuficiente', 'error');
      throw new Error('Saldo insuficiente');
    }

    const receiverIndex = accounts.findIndex(
      acc => acc.username === receiverUsername && acc.active
    );

    if (receiverIndex === -1) {
      showNotification('Cuenta no encontrada', 'error');
      throw new Error('Cuenta no encontrada');
    }

    const senderIndex = accounts.findIndex(acc => acc.username === currentAccount.username);

    // Primero actualizamos la cuenta del remitente (resta)
    let updatedAccounts = [...accounts];
    updatedAccounts[senderIndex] = {
      ...updatedAccounts[senderIndex],
      movements: [
        ...updatedAccounts[senderIndex].movements,
        {
          amount: -numAmount,
          date: new Date().toISOString(),
          description: `Transferencia enviada a ${accounts[receiverIndex].owner}`
        }
      ],
      balance: updatedAccounts[senderIndex].balance - numAmount
    };

    // Luego actualizamos la cuenta del destinatario (suma)
    updatedAccounts[receiverIndex] = {
      ...updatedAccounts[receiverIndex],
      movements: [
        ...updatedAccounts[receiverIndex].movements,
        {
          amount: numAmount,
          date: new Date().toISOString(),
          description: `Transferencia recibida de ${currentAccount.owner}`
        }
      ],
      balance: updatedAccounts[receiverIndex].balance + numAmount
    };

    setAccounts(updatedAccounts);
    setCurrentAccount(updatedAccounts[senderIndex]);
    
    showNotification(
      `Transferencia de ${numAmount.toFixed(2)}€ realizada`, 
      'success'
    );
  };

  const closeAccount = (username, pin) => {
    const accountIndex = accounts.findIndex(
      acc => acc.username === username && acc.pin === pin && acc.active
    );
    
    if (accountIndex === -1) {
      showNotification('Credenciales inválidas o cuenta ya cerrada', 'error');
      throw new Error('Credenciales inválidas o cuenta ya cerrada');
    }

    const updatedAccounts = [...accounts];
    updatedAccounts[accountIndex] = {
      ...updatedAccounts[accountIndex],
      active: false,
      movements: [
        ...updatedAccounts[accountIndex].movements,
        {
          amount: -updatedAccounts[accountIndex].balance,
          date: new Date().toISOString(),
          description: 'Cierre de cuenta'
        }
      ],
      balance: 0
    };
    
    setAccounts(updatedAccounts);
    setCurrentAccount(null);
    showNotification('Cuenta cerrada exitosamente. ¡Hasta pronto!', 'success');
  };

  const requestLoan = (amount) => {
    if (!currentAccount) {
      showNotification('Por favor, inicia sesión primero', 'error');
      throw new Error('Por favor, inicia sesión primero');
    }

    const numAmount = Number(amount);
    if (numAmount <= 0) {
      showNotification('El importe debe ser positivo', 'error');
      throw new Error('El importe debe ser positivo');
    }

    // Verificar si hay algún depósito que sea al menos el 10% del préstamo solicitado
    const hasQualifyingDeposit = currentAccount.movements.some(
      mov => mov.amount > 0 && mov.amount >= numAmount * 0.1
    );

    if (!hasQualifyingDeposit) {
      showNotification(
        `Necesitas al menos un depósito del ${(numAmount * 0.1).toFixed(2)}€ para este préstamo`, 
        'error'
      );
      throw new Error('No cumple requisitos de depósito previo');
    }

    const maxLoanAmount = currentAccount.balance * 2;
    if (numAmount > maxLoanAmount) {
      showNotification(
        `Préstamo máximo: ${maxLoanAmount.toFixed(2)}€`, 
        'error'
      );
      throw new Error(`Préstamo máximo: ${maxLoanAmount}`);
    }

    const accountIndex = accounts.findIndex(acc => acc.username === currentAccount.username);
    const updatedAccounts = addMovement(accountIndex, numAmount, 'Préstamo aprobado');

    setAccounts(updatedAccounts);
    setCurrentAccount(updatedAccounts[accountIndex]);
    
    showNotification(
      `Préstamo de ${numAmount.toFixed(2)}€ aprobado`, 
      'success'
    );
  };

  const login = (username, pin) => {
    const account = accounts.find(
      acc => acc.username === username.toLowerCase() && acc.pin === pin && acc.active
    );

    if (account) {
      setCurrentAccount(account);
      showNotification(`¡Bienvenido/a ${account.owner}!`, 'success');
      return true;
    }
    showNotification('Usuario o PIN inválido', 'error');
    return false;
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
    hideNotification,
    login
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
