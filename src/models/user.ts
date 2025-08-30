import GlobalRegistry from "@/services/GlobalRegistry";
import type { BankAccountId, UserId } from "@/types/Common";

let userCounter = 1;

export default class User {
  private id: UserId;
  private name: string;
  private accountIds: BankAccountId[];

  private constructor(
    id: UserId,
    name: string,
    accountIds: BankAccountId[] = []
  ) {
    this.id = id;
    this.name = name;
    this.accountIds = [...accountIds];
  }

  static create(name: string, accountIds: BankAccountId[] = []): User {
    const id = `user-${userCounter++}`;
    const user = new User(id, name, accountIds);
    GlobalRegistry.registerUser(user);
    return user;
  }

  static getById(id: UserId): User | undefined {
    return GlobalRegistry.getUser(id);
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getAccountIds(): BankAccountId[] {
    return [...this.accountIds];
  }

  addAccount(accountId: BankAccountId): void {
    if (!this.accountIds.includes(accountId)) {
      this.accountIds.push(accountId);
    }
  }

  removeAccount(accountId: BankAccountId): void {
    this.accountIds = this.accountIds.filter((a) => a !== accountId);
  }
}
