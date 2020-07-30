import { DestinationAccount } from "../traits/destination_account"
import { SourceAccount } from "../traits/source_account"
import { Entry } from "./entry"

export class AccountLedger implements SourceAccount, DestinationAccount {
  public accountID: string = ""
  public version = 0
  public entries: Entry[] = []
  public initialBalance = 0

  constructor(accountID: string) {
    this.accountID = accountID
  }

  get balance(): number {
    return this.initialBalance + this.entries.reduce((sum, e) => sum + e.amount, 0)
  }

  withdraw(amount: number): void {
    this.entries.push({
      amount: - amount,
      version: this.version + this.entries.length + 1,
    })
  }

  deposit(amount: number): void {
    this.entries.push({
      amount,
      version: this.version + this.entries.length + 1,
    })
  }
}