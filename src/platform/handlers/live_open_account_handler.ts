import { OpenAccountHandler } from "../../customer/handlers/open_account_handler";
import { Connection } from "../postgres/connection";
import { PgCheckingAccount } from "../postgres/pg_checking_account";

export class LiveOpenAccountHandler extends OpenAccountHandler {
  private conn: Connection

  constructor(conn: Connection) {
    super()
    this.conn = conn
  }

  creatableAccount(name: string, fiscalNumber: string) {
    let account = new PgCheckingAccount(this.conn)
    account.name = name
    account.fiscalNumber = fiscalNumber
    return account
  }
}