import { Entry } from "../entities/entry";

export interface PersistentLedger {
  entries: Entry[]
  commit(): Promise<void>
  rollback(): Promise<void>
}