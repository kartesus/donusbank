import { SourceAccount } from "../traits/source_account";
import { DestinationAccount } from "../traits/destination_account";
import { BonusCalculator } from "../traits/bonus_calculator";
import { VerifiableAccount } from "../traits/verifiable_account";
import { Transaction } from "../entities/transaction";
import { PersistentTransaction } from "../traits/persistent_transaction";
import { Result, wrapped } from "../../lib/result";

interface Source extends SourceAccount, BonusCalculator { }
interface Destination extends DestinationAccount, VerifiableAccount { }
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
      return wrapped(err)
    }
  }
}