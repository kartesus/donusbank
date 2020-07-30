import { SourceAccount } from "../accounting/traits/source_account";
import { DestinationAccount } from "../accounting/traits/destination_account";
import { BonusCalculator } from "../accounting/traits/bonus_calculator";
import { VerifiableAccount } from "../accounting/traits/verifiable_account";
import { Transaction } from "../accounting/entities/transaction";
import { PersistentTransaction } from "../accounting/traits/persistent_transaction";
import { PersistentLedger } from "../accounting/traits/persistent_ledger";

interface BonusSourceLedger extends SourceAccount, BonusCalculator, PersistentLedger { }
interface VerifiableDestinationLedger extends DestinationAccount, VerifiableAccount, PersistentLedger { }
interface DepositTransaction extends Transaction, PersistentTransaction { }

export abstract class DepositHandler {
  abstract transaction(): DepositTransaction
  abstract source(): BonusSourceLedger
  abstract destination(fiscalNumber: string): VerifiableDestinationLedger

  async handle(fiscalNumber: string, amount: number): Promise<void> {
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
    } catch (err) {
      await transaction.rollback()
    }
  }
}