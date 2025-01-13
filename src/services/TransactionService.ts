import BankAccount from "@/models/bank-account";

class TransactionService {
  static sendMoney(
    senderBankAccount: BankAccount,
    receiverBankAccount: BankAccount,
    amount: number
  ): Boolean {
    console.log("tranc");
    try {
      senderBankAccount.withdraw(amount);
      receiverBankAccount.deposit(amount);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default TransactionService;
