import BankAccount from "@/models/bank-account";

class TransactionService {
  static tranferMoney(
    senderBankAccounts: BankAccount[],
    reciverBankAccount: BankAccount,
    amount: number
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
      throw new Error("Insufficient funds");
    }

    reciverBankAccount.deposit(amount);
  }
}

export default TransactionService;
