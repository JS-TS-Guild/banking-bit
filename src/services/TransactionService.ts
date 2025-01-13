import BankAccount from "@/models/bank-account";

class TransactionService {
  static sendMoney(senderBankAccount: BankAccount, amount: number): Boolean {
    try {
      senderBankAccount.withdraw(amount);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default TransactionService;
