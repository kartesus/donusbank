import { Entry } from "../entities/entry";

export interface PersistentLedger {
  entries: Entry[]
  commit(transactionID: string): Promise<void>
}