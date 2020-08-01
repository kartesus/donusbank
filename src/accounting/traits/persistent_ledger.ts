import { Entry } from "../entities/entry";

export interface PersistentLedger {
  entries: Entry[]
  authorizeWithdraw(transactionID: string): Promise<Entry[]>
  authorizeDeposit(transactionID: string): Promise<Entry[]>
}