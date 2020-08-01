import { v4 as uuid } from "uuid";

import { DestinationAccount } from "../traits/destination_account"
import { SourceAccount } from "../traits/source_account"
import { Entry } from "./entry"

export class AccountLedger implements SourceAccount, DestinationAccount {
  public ID: string
  public version: number
  public entries: Entry[]
  public initialBalance: number

  constructor() {
    this.ID = ""
    this.version = 0
    this.entries = []
    this.initialBalance = 0
  }

  get balance(): number {
    return (this.initialBalance || 0) + this.entries.reduce((sum, e) => sum + e.amount, 0)
  }

  withdraw(amount: number): void {
    if (!this.entries) this.entries = []
    this.entries.push({
      ID: uuid(),
      accountID: this.ID,
      amount: - amount,
      version: this.version + this.entries.length + 1,
    })
  }

  deposit(amount: number): void {
    if (!this.entries) this.entries = []
    this.entries.push({
      ID: uuid(),
      accountID: this.ID,
      amount,
      version: this.version + this.entries.length + 1,
    })
  }
}