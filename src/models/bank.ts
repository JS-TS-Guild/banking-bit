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
    receiverBankId?: string
  ): void {
    const senderBankAccountsIds = GlobalRegistry.getUserBankAccounts(senderId);
    const recieverBankAccountsIds =
      GlobalRegistry.getUserBankAccounts(recieverId);

    const totalMoneySenderHave = GlobalRegistry.getBankBalanceOfUser(senderId);

    const isNegativeAllowed = this.getAllowNegativeBalance();

    if (totalMoneySenderHave < amount && !isNegativeAllowed) {
      throw new Error("Insufficient funds");
    }

    let reciverBankAccount: BankAccount;

    if (receiverBankId && receiverBankId !== this.id) {
      const BankToSendMoney = GlobalRegistry.getBank(receiverBankId);

      const matchingAccounts = recieverBankAccountsIds.filter((accountId) =>
        BankToSendMoney.getAccounts().some(
          (bankAccount) => bankAccount.getId() === accountId
        )
      );

      if (matchingAccounts.length === 0) {
        throw new Error(
          "The receiver does not have an account in thespecified bank"
        );
      }

      reciverBankAccount = BankToSendMoney.getAccount(matchingAccounts[0]);
    } else {
      const matchingAccounts = recieverBankAccountsIds.filter((accountId) =>
        this.getAccounts().some(
          (bankAccount) => bankAccount.getId() === accountId
        )
      );

      if (matchingAccounts.length === 0) {
        throw new Error("The receiver's account could not be found");
      }
      reciverBankAccount = this.getAccount(matchingAccounts[0]);
    }

    let transferedMoney = 0;

    for (const senderBankAccountId of senderBankAccountsIds) {
      if (transferedMoney >= amount) break;
      const senderBankAccount =
        GlobalRegistry.getBankAccount(senderBankAccountId);
      const balance = senderBankAccount.getBalance();
      const transferableMoney = Math.min(balance, amount - transferedMoney);
      transferedMoney += transferableMoney;

      TransactionService.sendMoney(
        senderBankAccount,
        reciverBankAccount,
        transferableMoney
      );
    }
  }
}

export default Bank;
