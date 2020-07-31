import { Result, wrapped } from "../../lib/result";
import { SourceAccount } from "../traits/source_account";
import { VerifiableAccount } from "../traits/verifiable_account";
import { PersistentTransaction } from "../traits/persistent_transaction";
import { PersistentLedger } from "../traits/persistent_ledger";
import { DestinationAccount } from "../traits/destination_account";
import { Transaction } from "../entities/transaction";

interface Source extends SourceAccount, VerifiableAccount, PersistentLedger { }
interface Destination extends DestinationAccount, VerifiableAccount, PersistentLedger { }
interface TransferTransaction extends Transaction, PersistentTransaction { }

export abstract class TransferHandler {
  abstract source(fiscalNumber: string): Source
  abstract destination(fiscalNumber: string): Destination
  abstract transaction(): TransferTransaction

  async handle(sourceFn: string, destinationFn: string, amount: number): Promise<Result<TransferTransaction>> {
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
      return wrapped(transaction)
    } catch (err) {
      transaction.rollback()
      return wrapped(err)
    }
  }
}