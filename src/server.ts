import CPF from "cpf";

import { OpenAccountHandler } from "./customer/handlers/open_account_handler";
import { Connection } from "./platform/postgres/connection"
import { PgCheckingAccount } from "./platform/postgres/pg_checking_account";
import { TreasuryAccount } from "./platform/postgres/treasury_account";
import { DepositHandler } from "./accounting/handlers/deposit_handler";
import { Transaction } from "./platform/postgres/transaction";
import { WithdrawHandler } from "./accounting/handlers/withdraw_handler";
import { TransferHandler } from "./accounting/handlers/transfer_handler";

class ProductionOpenAccountHandler extends OpenAccountHandler {
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

class ProductionDepositHandler extends DepositHandler {
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
    let account = new TreasuryAccount(this.conn)
    return account
  }

  transaction() {
    let transaction = new Transaction(this.conn)
    return transaction
  }

}

class ProductionWithdrawHandler extends WithdrawHandler {
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
    let account = new TreasuryAccount(this.conn)
    return account
  }

  transaction() {
    let transaction = new Transaction(this.conn)
    return transaction
  }

}

class ProductionTransferHandler extends TransferHandler {
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
    let transaction = new Transaction(this.conn)
    return transaction
  }
}

async function main() {
  const POSTGRES_URL = String(process.env.POSTGRES_URL)
  let conn = new Connection(POSTGRES_URL)

  let cpf1 = CPF.generate()
  let cpf2 = CPF.generate()

  let openAccountHandler = new ProductionOpenAccountHandler(conn)
  let depositHandler = new ProductionDepositHandler(conn)
  let withdrawHandler = new ProductionWithdrawHandler(conn)
  let transferHandler = new ProductionTransferHandler(conn)

  let result: any = await openAccountHandler.handle("Alice Gravem", cpf1)
  console.log(result)

  result = await openAccountHandler.handle("Bob Gravem", cpf2)
  console.log(result)

  result = await depositHandler.handle(cpf1, 500)
  console.log(result)

  result = await withdrawHandler.handle(cpf1, 100)
  console.log(result)

  result = await withdrawHandler.handle(cpf2, 100)
  console.log(result)

  result = await transferHandler.handle(cpf1, cpf2, 100)
  console.log(result)
}

main()