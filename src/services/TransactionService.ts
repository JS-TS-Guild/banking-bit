import Bank from "@/models/bank";

export default class TransactionService {
  static transfer(
    bank: Bank,
    fromUserId: string,
    toUserId: string,
    amount: number,
    toBankId?: string
  ) {
    return bank.send(fromUserId, toUserId, amount, toBankId);
  }
}
