import { v4 as uuid } from "uuid";

import { Connection } from "./connection";
import { Transaction as AccountingTransaction } from "../../accounting/entities/transaction";
import { PersistentTransaction } from "../../accounting/traits/persistent_transaction";
import { PgCheckingAccount } from "./pg_checking_account";
import { BusinessError } from "../../lib/errors";

export interface PgTransaction extends AccountingTransaction { }

export class PgTransaction extends AccountingTransaction implements PersistentTransaction {
  private conn: Connection
  public source: PgCheckingAccount | null = null
  public destination: PgCheckingAccount | null = null

  constructor(conn: Connection) {
    super()
    this.conn = conn
    this.ID = uuid()
  }

  async commit() {
    await this.conn.run(async (conn) => {
      try {
        if (this.source === null) throw new BusinessError("No source account in transaction")
        if (this.destination === null) throw new BusinessError("No destination account in transaction")

        await conn.execute(
          `INSERT INTO transactions (id, source, destination, amount) 
           VALUES ($1, $2, $3, $4)`,
          [this.ID, this.source.ID, this.destination.ID, this.amount])

        await this.source.commitWithinTransaction(conn, this.ID)
        await this.destination.commitWithinTransaction(conn, this.ID)

        await conn.commit()
      } catch (err) {
        conn.rollback()
        throw err
      }
    })

  }
}
