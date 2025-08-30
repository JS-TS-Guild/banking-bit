import type { BankAccountId, UserId, BankId } from "@/types/Common";
import User from "@/models/user";
import Bank from "@/models/bank";
import BankAccount from "@/models/bank-account";

export default class GlobalRegistry {
  private static users: Map<UserId, User> = new Map();
  private static banks: Map<BankId, Bank> = new Map();
  private static accounts: Map<BankAccountId, BankAccount> = new Map();

  static clear(): void {
    GlobalRegistry.users.clear();
    GlobalRegistry.banks.clear();
    GlobalRegistry.accounts.clear();
  }

  static registerUser(user: User): void {
    GlobalRegistry.users.set(user.getId(), user);
  }

  static getUser(userId: UserId): User | undefined {
    return GlobalRegistry.users.get(userId);
  }

  static registerBank(bank: Bank): void {
    GlobalRegistry.banks.set(bank.getId(), bank);
  }

  static getBank(bankId: BankId): Bank | undefined {
    return GlobalRegistry.banks.get(bankId);
  }

  static registerAccount(account: BankAccount): void {
    GlobalRegistry.accounts.set(account.getId(), account);
  }

  static getAccount(accountId: BankAccountId): BankAccount | undefined {
    return GlobalRegistry.accounts.get(accountId);
  }

  static getAllBanks(): Bank[] {
    return Array.from(GlobalRegistry.banks.values());
  }
}
