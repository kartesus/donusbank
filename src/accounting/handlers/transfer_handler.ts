import { SourceAccount } from "../traits/source_account";
import { VerifiableAccount } from "../traits/verifiable_account";
import { PersistentTransaction } from "../traits/persistent_transaction";
import { DestinationAccount } from "../traits/destination_account";
import { Transaction } from "../entities/transaction";
import { BusinessError } from "../../lib/errors";

interface Source extends SourceAccount, VerifiableAccount { }
interface Destination extends DestinationAccount, VerifiableAccount { }
interface TransferTransaction extends Transaction, PersistentTransaction { }

export abstract class TransferHandler {
  abstract source(fiscalNumber: string): Source
  abstract destination(fiscalNumber: string): Destination
  abstract transaction(): TransferTransaction

  async handle(sourceFn: string, destinationFn: string, amount: number): Promise<TransferTransaction> {
    let source = this.source(sourceFn)
    let destination = this.destination(destinationFn)

    let transaction = this.transaction()
    transaction.amount = amount
    transaction.source = source
    transaction.destination = destination

    try {
      await source.verify()
      await destination.verify()

      source.withdraw(amount)
      destination.deposit(amount)

      await transaction.commit()
      return transaction
    } catch (err) {
      throw new BusinessError(err.message)
    }
  }
}