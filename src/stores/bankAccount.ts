import { defineStore } from 'pinia';

type Transaction = {
  id: number;
  type: 'charge' | 'refund' | 'payment';
  amount: number;
  status: 'pending' | 'processed';
};

type BankDetails = {
  balance: number;
  transactions: Transaction[];
};

export const useBankAccountStore = defineStore({
  id: 'bankAccount',
  state: () => {
    return {
      balance: 0,
      transactions: [],
    } as BankDetails;
  },
  getters: {
    // For simple getters, use arrow function and use state directly
    processedTransactions: (state) =>
      state.transactions.filter((t) => t.status === 'processed'),

    pendingTransactions: (state) =>
      state.transactions.filter((t) => t.status === 'pending'),

    // To compose getters together and you need access to entire store which is inside of 'this', use regular function
    runningBalance(): number {
      return (
        this.balance +
        this.processedTransactions
          .map((t) => t.amount)
          .reduce((acc, curr) => acc + curr, 0)
      );
    },

    pendingAmount(): number {
      return this.pendingTransactions
        .map((t) => t.amount)
        .reduce((acc, curr) => acc + curr, 0);
    },
  },
  actions: {
    // can also do api calls (async await) in actions
    charge(amount: number) {
      const id = Date.now(); //Dummy id
      this.transactions.push({
        id,
        type: 'charge',
        amount,
        status: 'pending',
      });
      return id;
    },

    pay(amount: number) {
      const id = Date.now();
      this.transactions.push({
        id,
        type: 'payment',
        amount: -amount,
        status: 'processed',
      });
      return id;
    },

    reconcile() {
      this.balance = this.runningBalance;
      this.transactions = [];
    },

    processTransaction(transactionId: number) {
      setTimeout(() => {
        this.transactions = this.transactions.map((t) => {
          if (t.id === transactionId) {
            return { ...t, status: 'processed' };
          }
          return t;
        });
      }, 5000);
    },
  },
});
