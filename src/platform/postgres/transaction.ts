import { v4 as uuid } from "uuid";

import { Connection } from "./connection";
import { Transaction as AccountingTransaction } from "../../accounting/entities/transaction";
import { PersistentTransaction } from "../../accounting/traits/persistent_transaction";
import { CheckingAccount } from "./checking_account";

export interface Transaction extends AccountingTransaction { }

export class Transaction extends AccountingTransaction implements PersistentTransaction {
  private conn: Connection

  constructor(conn: Connection) {
    super()
    this.conn = conn
    this.ID = uuid()
  }

  async commit() {
    await this.conn.run(async (conn) => {
      try {
        if (this.source === null) throw new Error("No source account in transaction")
        if (this.destination === null) throw new Error("No destination account in transaction")

        let source = <CheckingAccount>this.source

        let sourceEntries = await this.source.commit(this.ID)
        let destinationEntries = await this.destination.authorizeDeposit(this.ID)

        await conn.execute(
          `INSERT INTO transactions (id, source, destination, amount) 
           VALUES ($1, $2, $3, $4)`,
          [this.ID, this.source.ID, this.destination.ID, this.amount])

        for (let entry of sourceEntries) {
          await conn.execute(
            `INSERT INTO entries (id, transactionID, accountID, amount, version)
             VALUES ($1, $2, $3, $4, $5)`,
            [entry.ID, entry.transactionID, entry.accountID, entry.amount, entry.version]
          )
        }

        for (let entry of destinationEntries) {
          await conn.execute(
            `INSERT INTO entries (id, transactionID, accountID, amount, version)
             VALUES ($1, $2, $3, $4, $5)`,
            [entry.ID, entry.transactionID, entry.accountID, entry.amount, entry.version]
          )
        }

        await conn.commit()
      } catch (err) {
        conn.rollback()
        throw err
      }
    })

  }
}
