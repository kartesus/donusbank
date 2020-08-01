import { AccountLedger } from "./account_ledger"
import { SourceAccount } from "../traits/source_account"
import { DestinationAccount } from "../traits/destination_account"

export class Transaction {
  public ID = ""
  public source: SourceAccount | null = null
  public destination: DestinationAccount | null = null
  public amount = 0
}