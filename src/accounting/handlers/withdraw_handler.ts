import { Transaction } from "../entities/transaction";
import { PersistentTransaction } from "../traits/persistent_transaction";
import { VerifiableAccount } from "../traits/verifiable_account";
import { FeeCalculator } from "../traits/fee_calculator";
import { DestinationAccount } from "../traits/destination_account";
import { SourceAccount } from "../traits/source_account";
import { BusinessError } from "../../lib/errors";

interface Source extends SourceAccount, VerifiableAccount { }
interface Destination extends DestinationAccount, FeeCalculator { }
interface WithdrawTransaction extends Transaction, PersistentTransaction { }

export abstract class WithdrawHandler {
  abstract source(fiscalNumber: string): Source
  abstract destination(): Destination
  abstract transaction(): WithdrawTransaction

  async handle(fiscalNumber: string, amount: number): Promise<WithdrawTransaction> {
    let source = this.source(fiscalNumber)
    let destination = this.destination()
    let fee = destination.calculateFeeFor(amount)

    let transaction = this.transaction()
    transaction.amount = amount + fee
    transaction.source = source
    transaction.destination = destination

    try {
      await source.verify()

      source.withdraw(amount)
      source.withdraw(fee)

      destination.deposit(amount)
      destination.deposit(fee)

      await transaction.commit()
      return transaction
    } catch (err) {
      throw new BusinessError(err.message)
    }
  }
}