import BankAccount from "./bank-account";
import User from "./user";
import GlobalRegistry from "@/services/GlobalRegistry";
import type { BankAccountId, BankId, UserId } from "@/types/Common";

let bankCounter = 1;
let accountCounter = 1;

export interface BankCreateOptions {
  isNegativeAllowed?: boolean;
}

export default class Bank {
  private id: BankId;
  private accounts: Map<BankAccountId, BankAccount> = new Map();
  private allowsNegative: boolean;

  private constructor(id: BankId, allowsNegative = false) {
    this.id = id;
    this.allowsNegative = allowsNegative;
  }

  static create(opts?: BankCreateOptions): Bank {
    const id = `bank-${bankCounter++}`;
    const bank = new Bank(id, Boolean(opts && opts.isNegativeAllowed));
    GlobalRegistry.registerBank(bank);
    return bank;
  }

  static getById(id: BankId): Bank | undefined {
    return GlobalRegistry.getBank(id);
  }

  getId(): BankId {
    return this.id;
  }

  createAccount(initialBalance = 0): BankAccount {
    const id = `acct-${accountCounter++}`;
    const acct = new BankAccount(id, initialBalance, this.id);
    this.accounts.set(id, acct);
    GlobalRegistry.registerAccount(acct);
    return acct;
  }

  getAccount(accountId: BankAccountId): BankAccount {
    const acct = this.accounts.get(accountId);
    if (!acct)
      throw new Error(`Account ${accountId} not found in bank ${this.id}`);
    return acct;
  }

  private getUserAccountsInThisBankInPriorityOrder(
    userId: UserId
  ): BankAccount[] {
    const user = User.getById(userId);
    if (!user) return [];
    const accIds = user.getAccountIds();
    const accountsInBank: BankAccount[] = [];
    for (const accId of accIds) {
      const acc = this.accounts.get(accId);
      if (acc) accountsInBank.push(acc);
    }
    return accountsInBank;
  }

  send(
    fromUserId: UserId,
    toUserId: UserId,
    amount: number,
    toBankId?: BankId
  ): void {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const fromUser = User.getById(fromUserId);
    const toUser = User.getById(toUserId);
    if (!fromUser) throw new Error("Sender not found");
    if (!toUser) throw new Error("Recipient not found");

    const sourceBank = this;
    const targetBank = toBankId ? Bank.getById(toBankId) : sourceBank;
    if (!targetBank) throw new Error("Target bank not found");

    const sourceAccounts =
      sourceBank.getUserAccountsInThisBankInPriorityOrder(fromUserId);
    if (sourceAccounts.length === 0) {
      throw new Error("Insufficient funds");
    }

    if (sourceBank.allowsNegative) {
      const first = sourceAccounts[0];
      first.withdraw(amount);
    } else {
      const totalAvailable = sourceAccounts.reduce(
        (s, a) => s + a.getBalance(),
        0
      );
      if (totalAvailable < amount) {
        throw new Error("Insufficient funds");
      }

      let remaining = amount;
      for (const acc of sourceAccounts) {
        if (remaining <= 0) break;
        const avail = acc.getBalance();
        if (avail <= 0) continue;
        const take = Math.min(avail, remaining);
        acc.withdraw(take);
        remaining -= take;
      }
    }

    const targetAccounts =
      targetBank.getUserAccountsInThisBankInPriorityOrder(toUserId);
    if (targetAccounts.length === 0) {
      throw new Error("Recipient has no account in target bank");
    }
    const recipientAccount = targetAccounts[0];
    recipientAccount.deposit(amount);
  }
}
