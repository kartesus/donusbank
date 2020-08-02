import CPF from "cpf";
import express from "express"
import pino from "pino"
import pino_http from "pino-http"

import { Connection } from "./platform/postgres/connection"
import { transfersRoutes } from "./platform/http/transfers_router";
import { accountsRoutes } from "./platform/http/accounts_router";

import { LiveOpenAccountHandler } from "./platform/handlers/live_open_account_handler";
import { LiveDepositHandler } from "./platform/handlers/live_deposit_handler";
import { LiveWithdrawHandler } from "./platform/handlers/live_withdraw_handler";
import { LiveTransferHandler } from "./platform/handlers/live_transfer_handler";


async function main() {
  const POSTGRES_URL = String(process.env.POSTGRES_URL)
  let conn = new Connection(POSTGRES_URL)

  let logger = pino()

  let openAccountHandler = new LiveOpenAccountHandler(conn)
  let depositHandler = new LiveDepositHandler(conn)
  let withdrawHandler = new LiveWithdrawHandler(conn)
  let transferHandler = new LiveTransferHandler(conn)

  const PORT = Number(process.env.PORT || 3000)
  let app = express()
  app.use(pino_http())
  app.use("/accounts", accountsRoutes(openAccountHandler, depositHandler, withdrawHandler))
  app.use("/transfers", transfersRoutes(transferHandler))
  app.listen(PORT, () => logger.info(`Running on port ${PORT}...`))
}

main()