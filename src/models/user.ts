import { v4 as uuidv4 } from "uuid";
import GlobalRegistry from "@/services/GlobalRegistry";

class User {
  private id: string;
  private name: string;
  private accounts: string[];

  constructor(name: string, accounts: string[]) {
    this.id = uuidv4();
    this.name = name;
    this.accounts = accounts;
  }

  static create(name: string, accounts: string[]): User {
    const user = new User(name, accounts);
    GlobalRegistry.registerUser(user);
    return user;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  addAccount(accountId: string): void {
    this.accounts.push(accountId);
  }

  getAccounts(): string[] {
    const accountIds = this.accounts;
    return accountIds;
  }
}

export default User;
