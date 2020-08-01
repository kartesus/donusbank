import { Connection, TransactionalConnection } from "./connection";
import { TreasuryAccount as TreasuryAcc } from "../../accounting/entities/tresury_account";
import { mixin } from "../../lib/mixin";

export interface TreasuryAccount extends TreasuryAcc { }

export class TreasuryAccount extends TreasuryAcc {
  private conn: Connection
  public ID = "c89b484b-f1be-4e74-919b-56db532b6ad1"

  constructor(conn: Connection) {
    super()
    this.conn = conn
  }

  async commitWithinTransaction(tx: TransactionalConnection, transactionID: string) {
    for (let entry of this.entries) {
      await tx.execute(
        `INSERT 
         INTO entries (id, transactionID, accountID, amount) 
         VALUES ($1, $2, $3, $4)`,
        [entry.ID, transactionID, entry.accountID, entry.amount]
      )
    }
  }
}
