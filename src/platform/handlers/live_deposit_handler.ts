import { Connection } from "../postgres/connection";
import { DepositHandler } from "../../accounting/handlers/deposit_handler";
import { PgCheckingAccount } from "../postgres/pg_checking_account";
import { PgTreasuryAccount } from "../postgres/pg_treasury_account";
import { PgTransaction } from "../postgres/pg_transaction";

export class LiveDepositHandler extends DepositHandler {
  private conn: Connection

  constructor(conn: Connection) {
    super()
    this.conn = conn
  }

  destination(fiscalNumber: string) {
    let account = new PgCheckingAccount(this.conn)
    account.fiscalNumber = fiscalNumber
    return account
  }

  source() {
    let account = new PgTreasuryAccount(this.conn)
    return account
  }

  transaction() {
    let transaction = new PgTransaction(this.conn)
    return transaction
  }

}
