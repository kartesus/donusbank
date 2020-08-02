import { WithdrawHandler } from "../../accounting/handlers/withdraw_handler";
import { Connection } from "../postgres/connection";
import { PgTreasuryAccount } from "../postgres/pg_treasury_account";
import { PgCheckingAccount } from "../postgres/pg_checking_account";
import { PgTransaction } from "../postgres/pg_transaction";

export class LiveWithdrawHandler extends WithdrawHandler {
  private conn: Connection

  constructor(conn: Connection) {
    super()
    this.conn = conn
  }

  source(fiscalNumber: string) {
    let account = new PgCheckingAccount(this.conn)
    account.fiscalNumber = fiscalNumber
    return account
  }

  destination() {
    let account = new PgTreasuryAccount(this.conn)
    return account
  }

  transaction() {
    let transaction = new PgTransaction(this.conn)
    return transaction
  }

}
