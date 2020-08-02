import express from "express"
import CPF from "cpf"

import { LiveOpenAccountHandler } from "../handlers/live_open_account_handler";
import { LiveDepositHandler } from "../handlers/live_deposit_handler";
import { LiveWithdrawHandler } from "../handlers/live_withdraw_handler";

export function accountsRoutes(open: LiveOpenAccountHandler, deposit: LiveDepositHandler, withdraw: LiveWithdrawHandler) {
  let router = express.Router()
  router.use(express.json())
  router.post("/", async (req, res) => {
    try {
      let name = String(req.body.name)
      let fiscalNumber = CPF.format(req.body.fiscalNumber)
      await open.handle(name, fiscalNumber)
      res.status(201)
      res.json({ ok: true, data: null })
    } catch (err) {
      if (err.name === "BusinessError") {
        res.status(400)
        res.json({ ok: false, data: { message: err.message } })
      } else {
        res.status(500)
        res.json({ ok: false, data: null })
      }
    }
  })
  router.post("/:fiscalNumber/deposits", async (req, res) => {
    try {
      let fiscalNumber = CPF.format(req.params.fiscalNumber)
      let amount = Number(req.body.amount)
      await deposit.handle(fiscalNumber, amount)
      res.status(201)
      res.json({ ok: true, data: null })
    } catch (err) {
      if (err.name == "BusinessError") {
        res.status(400)
        res.json({ ok: false, data: { message: err.message } })
      } else {
        res.status(500)
        res.json({ ok: false, data: null })
      }
    }
  })
  router.post("/:fiscalNumber/withdraws", async (req, res) => {
    try {
      let fiscalNumber = CPF.format(req.params.fiscalNumber)
      let amount = Number(req.body.amount)
      await withdraw.handle(fiscalNumber, amount)
      res.status(201)
      res.json({ ok: true, data: null })
    } catch (err) {
      if (err.name == "BusinessError") {
        res.status(400)
        res.json({ ok: false, data: { message: err.message } })
      } else {
        res.status(500)
        res.json({ ok: false, data: null })
      }
    }
  })
  return router
}