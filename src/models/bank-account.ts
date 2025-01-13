import Bank from "@/models/bank";
import GlobalRegistry from "@/services/GlobalRegistry";
import { v4 as uuidv4 } from "uuid";
class BankAccount {
  private id: string;
  private balance: number;
  private bank: Bank;

  constructor(bank: Bank, initialBalance: number) {
    this.id = uuidv4();
    this.bank = bank;
    this.balance = initialBalance;
  }

  getId(): string {
    return this.id;
  }

  getBalance(): number {
    return this.balance;
  }

  getBank(): Bank {
    return this.bank;
  }

  deposit(amount: number): void {
    if (amount < 0) throw new Error("Deposit amount must be positive.");
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount < 0) throw new Error("Withdrawal amount must be positive.");
    const moneyCanBeWithdrawn = Math.min(this.getBalance(), amount);

    if (!this.bank.getAllowNegativeBalance()) {
      this.balance -= moneyCanBeWithdrawn;
    } else {
      this.balance -= amount;
    }
  }
}

export default BankAccount;
