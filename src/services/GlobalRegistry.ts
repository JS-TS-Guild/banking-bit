import type BankAccount from "../models/bank-account";
import type Bank from "../models/bank";
import type User from "../models/user";

class GlobalRegistry {
  private static users: User[] = [];
  private static banks: Bank[] = [];
  private static bankAccounts: BankAccount[] = [];

  static getBank(bankId: string): Bank {
    return this.banks.filter((bank) => bank.getId() === bankId)[0];
  }

  static getUser(userId: string): User[] {
    return this.users.filter((user) => user.getId() === userId);
  }

  static getUserBankAccounts(userId: string): string[] {
    return this.users
      .filter((user) => user.getId() === userId)[0]
      .getAccounts();
  }

  static getBankBalanceOfUser(userId: string): number {
    const userAccountIds = this.getUserBankAccounts(userId);

    const totalBalance = userAccountIds.reduce((total, accountId) => {
      const account = this.getBankAccount(accountId);
      return total + account.getBalance();
    }, 0);

    return totalBalance;
  }
  static getBankAccount(accountId: string): BankAccount {
    return this.bankAccounts.filter(
      (account) => account.getId() === accountId
    )[0];
  }

  static registerBankAccount(account: BankAccount): void {
    this.bankAccounts.push(account);
  }

  static registerBank(bank: Bank): void {
    this.banks.push(bank);
  }

  static registerUser(user: User): void {
    this.users.push(user);
  }

  static clear(): void {
    GlobalRegistry.users = [];
    GlobalRegistry.banks = [];
    GlobalRegistry.bankAccounts = [];
  }
}

export default GlobalRegistry;
