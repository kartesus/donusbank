import { PersistentLedger } from "../traits/persistent_ledger"
import { AccountLedger } from "./account_ledger"
import { SourceAccount } from "../traits/source_account"
import { DestinationAccount } from "../traits/destination_account"

export class Transaction {
  public ID = ""
  public source: SourceAccount & PersistentLedger | null = null
  public destination: DestinationAccount & PersistentLedger | null = null
  public amount = 0
}