import { Connection } from "./connection";
import { TreasuryAccount as TreasuryAcc } from "../../accounting/entities/tresury_account";
import { mixin } from "../../lib/mixin";
import { PersistentLedger } from "../../accounting/traits/persistent_ledger";

export interface TreasuryAccount extends TreasuryAcc { }

export class TreasuryAccount extends TreasuryAcc implements PersistentLedger {
  private conn: Connection
  public ID = "c89b484b-f1be-4e74-919b-56db532b6ad1"

  constructor(conn: Connection) {
    super()
    this.conn = conn
  }

  async authorizeDeposit(transactionID: string) {
    return this.entries.map(e => Object.assign(e, { transactionID }))
  }

  async authorizeWithdraw(transactionID: string) {
    return this.entries.map(e => Object.assign(e, { transactionID }))
  }
}
