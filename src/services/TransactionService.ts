import BankAccount from "@/models/bank-account";

class TransactionService {
  static withdrawMoneyFromAccounts(
    amount: number,
    accounts: BankAccount[],
    haveSufficientBalance: Boolean
  ): boolean {
    if (haveSufficientBalance) {
      let transferedAmount = 0;
      for (const account of accounts) {
        const balance = account.getBalance();
        const withdrawAbleAmount = Math.min(balance, amount - transferedAmount);
        transferedAmount += withdrawAbleAmount;
        account.withdraw(withdrawAbleAmount);
        if (transferedAmount >= amount) break;
      }
    } else {
      let transferedAmount = 0;
      for (const account of accounts) {
        const balance = account.getBalance();
        transferedAmount += balance;
        account.withdraw(balance);
      }

      accounts[0].withdraw(amount - transferedAmount);
    }
    return true;
  }
}

export default TransactionService;
