import type { BankAccountId, BankId } from "@/types/Common";

export default class BankAccount {
  private id: BankAccountId;
  private balance: number;
  private bankId: BankId;

  constructor(id: BankAccountId, initialBalance: number, bankId: BankId) {
    this.id = id;
    this.balance = Number(initialBalance) || 0;
    this.bankId = bankId;
  }

  getId(): BankAccountId {
    return this.id;
  }

  getBalance(): number {
    return this.balance;
  }

  getBankId(): BankId {
    return this.bankId;
  }

  deposit(amount: number): void {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      throw new Error("Invalid deposit amount");
    }
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      throw new Error("Invalid withdraw amount");
    }
    this.balance -= amount;
  }
}
