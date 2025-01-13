import BankAccount from "@/models/bank-account";

class TransactionService {
  static tranferMoney(
    senderBankAccounts: BankAccount[],
    reciverBankAccount: BankAccount,
    amount: number,
    isNegativeAllowed: boolean
  ): void {
    let remaning = amount;
    console.log(remaning);
    for (const senderBankAccount of senderBankAccounts) {
      const balance = senderBankAccount.getBalance();
      if (balance > 0) {
        const transferableMoney = Math.min(balance, remaning);
        senderBankAccount.withdraw(transferableMoney);
        remaning -= transferableMoney;
        if (remaning <= 0) break;
      }
    }

    if (remaning > 0) {
      if (isNegativeAllowed) {
        console.log("Negative Balance");
        senderBankAccounts
          .filter(
            (account) => account.getBank().getAllowNegativeBalance() === true
          )[0]
          .withdraw(remaning);
      } else {
        throw new Error("Insufficient funds");
      }
    }

    reciverBankAccount.deposit(amount);
  }
}

export default TransactionService;
