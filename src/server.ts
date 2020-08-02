import CPF from "cpf";

import { Connection } from "./platform/postgres/connection"

import { LiveOpenAccountHandler } from "./platform/handlers/live_open_account_handler";
import { LiveDepositHandler } from "./platform/handlers/live_deposit_handler";
import { LiveWithdrawHandler } from "./platform/handlers/live_withdraw_handler";
import { LiveTransferHandler } from "./platform/handlers/live_transfer_handler";


async function main() {
  const POSTGRES_URL = String(process.env.POSTGRES_URL)
  let conn = new Connection(POSTGRES_URL)

  let cpf1 = CPF.generate()
  let cpf2 = CPF.generate()

  let openAccountHandler = new LiveOpenAccountHandler(conn)
  let depositHandler = new LiveDepositHandler(conn)
  let withdrawHandler = new LiveWithdrawHandler(conn)
  let transferHandler = new LiveTransferHandler(conn)

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