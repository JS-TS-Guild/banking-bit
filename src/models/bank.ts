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

    let reciverBankAccount: BankAccount;

    if (receiverBankId) {
      const matchingBankAccounts = recieverBankAccountsIds.filter(
        (accountId) => {
          const account = GlobalRegistry.getBankAccount(accountId);
          return account.getBank().getId() === receiverBankId;
        }
      );

      if (matchingBankAccounts.length === 0) {
        throw new Error("Reciever does not have an account in the bank");
      }
      reciverBankAccount = GlobalRegistry.getBankAccount(
        matchingBankAccounts[0]
      );
    } else {
      reciverBankAccount = GlobalRegistry.getBankAccount(
        recieverBankAccountsIds[0]
      );
    }

    const totalMoneySenderHave = GlobalRegistry.getBankBalanceOfUser(senderId);

    const isNegativeAllowed = this.getAllowNegativeBalance();

    console.log(isNegativeAllowed);
    console.log(totalMoneySenderHave);

    if (totalMoneySenderHave < amount && !isNegativeAllowed) {
      throw new Error("Insufficient funds");
    }

    let transferedMoney = 0;

    for (const senderBankAccountId of senderBankAccountsIds) {
      if (transferedMoney >= amount) break;
      const senderBankAccount =
        GlobalRegistry.getBankAccount(senderBankAccountId);

      if (
        senderBankAccount.getId() !== reciverBankAccount.getId() &&
        !receiverBankId
      ) {
        throw new Error(
          "Can't transfer money between two different banks without receiver bank id"
        );
      }
      const balance = senderBankAccount.getBalance();
      const transferableMoney = Math.min(balance, amount - transferedMoney);
      transferedMoney += transferableMoney;

      console.log(senderBankAccount);
      console.log(reciverBankAccount);
      console.log(transferableMoney);

      TransactionService.sendMoney(
        senderBankAccount,
        reciverBankAccount,
        transferableMoney
      );
    }
  }
}

export default Bank;
