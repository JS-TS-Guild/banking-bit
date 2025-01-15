import GlobalRegistry from "@/services/GlobalRegistry";
import BankAccount from "./bank-account";
import { v4 as uuidv4 } from "uuid";
import TransactionService from "@/services/TransactionService";
class Bank {
  private id: string;
  private isNegativeAllowed: boolean;
  private accounts: BankAccount[] = [];

  constructor() {
    this.id = uuidv4();
  }

  static create(options?: { isNegativeAllowed?: boolean }): Bank {
    const bank = new Bank();
    bank.isNegativeAllowed = options?.isNegativeAllowed ?? false;
    GlobalRegistry.registerBank(bank);
    return bank;
  }

  getId(): string {
    return this.id;
  }

  getAllowNegativeBalance(): boolean {
    return this.isNegativeAllowed;
  }

  createAccount(initialBalance: number): BankAccount {
    const account = new BankAccount(this, initialBalance);
    this.accounts.push(account);
    GlobalRegistry.registerBankAccount(account);
    return account;
  }

  getAccounts(): BankAccount[] {
    return this.accounts;
  }

  getAccount(accountId: string): BankAccount {
    const account = this.accounts.filter(
      (account) => account.getId() === accountId
    )[0];
    return account;
  }

  send(
    senderId: string,
    recieverId: string,
    amount: number,
    bankId?: string
  ): void {
    const senderBankAccounts = GlobalRegistry.getUserBankAccounts(
      senderId,
      this.id
    );
    const totalMoneySenderHave =
      GlobalRegistry.getTotalMoneyInAccounts(senderBankAccounts);
    const isNegativeAllowed = this.getAllowNegativeBalance();

    const reciverBankId = bankId ?? this.id;
    const reciverBankAccount = GlobalRegistry.getUserBankAccounts(
      recieverId,
      reciverBankId
    )[0];

    if (totalMoneySenderHave >= amount) {
      TransactionService.withdrawMoneyFromAccounts(
        amount,
        senderBankAccounts,
        true
      );
      reciverBankAccount.deposit(amount);
    } else if (isNegativeAllowed) {
      TransactionService.withdrawMoneyFromAccounts(
        amount,
        senderBankAccounts,
        false
      );
      reciverBankAccount.deposit(amount);
    } else {
      throw new Error("Insufficient funds");
    }
  }
}

export default Bank;
