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

  static getUser(userId: string): User {
    return this.users.filter((user) => user.getId() === userId)[0];
  }

  static getUserBankAccounts(userId: string, bankId?: string): BankAccount[] {
    const user = this.getUser(userId);
    let bankAccountIds = user.getAccounts();

    if (bankId) {
      bankAccountIds = bankAccountIds.filter((accountId) => {
        const account = this.getBankAccount(accountId);
        return account?.getBank().getId() === bankId;
      });
    }

    return bankAccountIds.map((accountId) => this.getBankAccount(accountId));
  }

  static getTotalMoneyInAccounts(accounts: BankAccount[]): number {
    let amount = 0;
    for (const account of accounts) {
      amount += account.getBalance();
    }
    return amount;
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
