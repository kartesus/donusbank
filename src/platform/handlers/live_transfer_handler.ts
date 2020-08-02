import { TransferHandler } from "../../accounting/handlers/transfer_handler";
import { Connection } from "../postgres/connection";
import { PgCheckingAccount } from "../postgres/pg_checking_account";
import { PgTransaction } from "../postgres/pg_transaction";

export class LiveTransferHandler extends TransferHandler {
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

  destination(fiscalNumber: string) {
    let account = new PgCheckingAccount(this.conn)
    account.fiscalNumber = fiscalNumber
    return account
  }

  transaction() {
    let transaction = new PgTransaction(this.conn)
    return transaction
  }
}
