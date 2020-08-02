import express from "express"
import CPF from "cpf"

import { LiveTransferHandler } from "../handlers/live_transfer_handler"

export function transfersRoutes(transfer: LiveTransferHandler) {
  let router = express.Router()
  router.use(express.json())
  router.post("/", async (req, res) => {
    try {
      let sourceFiscalNumber = CPF.format(req.body.sourceFiscalNumber)
      let destinationFiscalNumber = CPF.format(req.body.destinationFiscalNumber)
      let amount = Number(req.body.amount)
      await transfer.handle(sourceFiscalNumber, destinationFiscalNumber, amount)
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