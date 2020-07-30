import { PersistentLedger } from "../traits/persistent_ledger"

export class Transaction {
  public ID = ""
  public source: PersistentLedger | null = null
  public destination: PersistentLedger | null = null
  public amount = 0
}