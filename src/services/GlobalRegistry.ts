import type BankAccount from "../models/bank-account";
import type Bank from "../models/bank";
import type User from "../models/user";

class GlobalRegistry {
  private static users: User[] = [];
  private static banks: Bank[] = [];
  private static bankAccounts: BankAccount[] = [];

  static getBankAccounts(): BankAccount[] {
    return this.bankAccounts;
  }

  static getBanks(): Bank[] {
    return this.banks;
  }

  static getUsers(): User[] {
    return this.users;
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