import { SourceAccount } from "../accounting/traits/source_account";
import { DestinationAccount } from "../accounting/traits/destination_account";
import { BonusCalculator } from "../accounting/traits/bonus_calculator";
import { VerifiableAccount } from "../accounting/traits/verifiable_account";
import { Transaction } from "../accounting/entities/transaction";
import { PersistentTransaction } from "../accounting/traits/persistent_transaction";
import { PersistentLedger } from "../accounting/traits/persistent_ledger";
import { Result, wrapped } from "../lib/result";

interface Source extends SourceAccount, BonusCalculator, PersistentLedger { }
interface Destination extends DestinationAccount, VerifiableAccount, PersistentLedger { }
interface DepositTransaction extends Transaction, PersistentTransaction { }

export abstract class DepositHandler {
  abstract transaction(): DepositTransaction
  abstract source(): Source
  abstract destination(fiscalNumber: string): Destination

  async handle(fiscalNumber: string, amount: number): Promise<Result<DepositTransaction>> {
    let source = this.source()
    let destination = this.destination(fiscalNumber)
    let bonus = source.calculateBonusFor(amount)

    let transaction = this.transaction()
    transaction.amount = amount + bonus
    transaction.source = source
    transaction.destination = destination

    try {
      await destination.verify()

      source.withdraw(amount)
      source.withdraw(bonus)

      destination.deposit(amount)
      destination.deposit(bonus)

      await transaction.commit()
      return wrapped(transaction)
    } catch (err) {
      await transaction.rollback()
      return wrapped(err)
    }
  }
}