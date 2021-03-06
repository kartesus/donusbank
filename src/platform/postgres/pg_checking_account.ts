import { v4 as uuid } from "uuid";

import { mixin } from "../../lib/mixin";

import { Connection } from "./connection";
import { CheckingAccount } from "../../customer/entities/checking_account";
import { AccountCreator } from "../../customer/traits/account_creator";
import { VerifiableAccount } from "../../accounting/traits/verifiable_account";
import { AccountLedger } from "../../accounting/entities/account_ledger";
import { TransactionalConnection } from "./connection";
import { BusinessError } from "../../lib/errors";

export interface PgCheckingAccount extends CheckingAccount, AccountLedger { }

export class PgCheckingAccount implements VerifiableAccount, AccountCreator {
  private conn: Connection | TransactionalConnection

  constructor(conn: Connection) {
    this.conn = conn
  }

  async createAccount() {
    this.ID = uuid()
    await this.conn.execute(
      `INSERT INTO accounts (ID, name, fiscalNumber) 
        VALUES($1,$2,$3)`, [this.ID, this.name, this.fiscalNumber])
  }

  async verify() {
    let r = await this.conn.query(
      `SELECT a.id, a.name, MAX(version) AS version, SUM(amount) AS balance
       FROM accounts AS a
       LEFT JOIN entries AS e ON a.ID = e.accountID
       WHERE a.fiscalNumber = $1
       GROUP BY a.id`, [this.fiscalNumber])

    if (r.length === 0) throw new BusinessError("No account found")

    let data = r[0]
    console.log(data)
    this.ID = data.id
    this.name = data.name
    this.version = Number(data.version) || 0
    this.initialBalance = Number(data.balance) || 0
  }

  async commitWithinTransaction(tx: TransactionalConnection, transactionID: string) {
    if (this.balance < 0) throw new BusinessError("Account balance cannot be below 0")
    for (let entry of this.entries) {
      await tx.execute(
        `INSERT INTO entries (id, transactionID, accountID, amount, version) VALUES ($1, $2, $3, $4, $5)`,
        [entry.ID, transactionID, entry.accountID, entry.amount, entry.version]
      )
    }
  }
}

mixin(PgCheckingAccount, [CheckingAccount, AccountLedger])