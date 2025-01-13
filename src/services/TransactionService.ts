import BankAccount from "@/models/bank-account";

class TransactionService {
  static tranferMoney(
    senderBankAccounts: BankAccount[],
    reciverBankAccount: BankAccount,
    amount: number,
    isNegativeAllowed: boolean
  ): void {
    let remaningAmount = amount;
    for (const senderBankAccount of senderBankAccounts) {
      const balance = senderBankAccount.getBalance();
      const transferableMoney = Math.min(balance, remaningAmount);
      senderBankAccount.withdraw(transferableMoney);
      remaningAmount -= transferableMoney;
      if (remaningAmount <= 0) break;
    }

    if (remaningAmount > 0) {
      if (isNegativeAllowed) {
        senderBankAccounts[0].withdraw(remaningAmount);
      } else {
        throw new Error("Insufficient funds");
      }
    }

    reciverBankAccount.deposit(amount);
  }
}

export default TransactionService;
