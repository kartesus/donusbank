import { OpenAccountHandler } from "./customer/handlers/open_account_handler";
import { Connection } from "./platform/postgres/connection"
import { CheckingAccount } from "./platform/postgres/checking_account";

class ProductionOpenAccountHandler extends OpenAccountHandler {
  private conn: Connection

  constructor(conn: Connection) {
    super()
    this.conn = conn
  }

  creatableAccount(name: string, fiscalNumber: string) {
    let account = new CheckingAccount(this.conn)
    account.name = name
    account.fiscalNumber = fiscalNumber
    return account
  }
}

async function main() {
  const POSTGRES_URL = String(process.env.POSTGRES_URL)
  let conn = new Connection(POSTGRES_URL)

  let openAccountHandler = new ProductionOpenAccountHandler(conn)
  let result = await openAccountHandler.handle("Alex Gravem", "994.783.230-91")
  console.log(result)
}

main()