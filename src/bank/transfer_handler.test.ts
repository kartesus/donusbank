import { TransferHandler } from "./transfer_handler";
import { AccountLedger } from "../accounting/entities/account_ledger";
import { TreasuryAccount } from "../accounting/entities/tresury_account";
import { Transaction } from "../accounting/entities/transaction";
import { PersistentLedger } from "../accounting/traits/persistent_ledger";
import { PersistentTransaction } from "../accounting/traits/persistent_transaction";

class TestSourceAccount extends AccountLedger implements PersistentLedger {
  async commit(): Promise<void> { }
  async rollback(): Promise<void> { }
  async verify(): Promise<void> { }
}

class TestDestinationAccount extends AccountLedger implements PersistentLedger {
  async commit(): Promise<void> { }
  async rollback(): Promise<void> { }
  async verify(): Promise<void> { }
}

class TestTransaction extends Transaction implements PersistentTransaction {
  async commit(): Promise<void> { }
  async rollback(): Promise<void> { }
}

class TestTransferHandler extends TransferHandler {
  _source: TestSourceAccount
  _destination: TestDestinationAccount
  _transaction: TestTransaction

  source = () => this._source
  destination = (fiscalNumber: string) => this._destination
  transaction = () => this._transaction

  constructor() {
    super()
    this._source = new TestSourceAccount("42")
    this._destination = new TestDestinationAccount("12")
    this._transaction = new TestTransaction()
  }

}

test("Transaction is setup correctly", async () => {
  let handler = new TestTransferHandler()
  let result = await handler.handle("111.111.111-11", "222.222.222-22", 500)
  expect(result.ok).toBeTruthy()
  expect(result.data).toMatchObject({
    amount: 500,
    source: handler._source,
    destination: handler._destination
  })
})

test("Destination is verified", async () => {
  let handler = new TestTransferHandler()
  jest.spyOn(handler._destination, "verify")
  await handler.handle("111.111.111-11", "222.222.222-22", 500)
  expect(handler._destination.verify).toHaveBeenCalled()
})

test("There's a withdraw entries in source", async () => {
  let handler = new TestTransferHandler()
  jest.spyOn(handler._source, "withdraw")
  await handler.handle("111.111.111-11", "222.222.222-22", 500)
  expect(handler._source.withdraw).toHaveBeenCalledWith(500)
})

test("There's a desposit entries in destination", async () => {
  let handler = new TestTransferHandler()
  jest.spyOn(handler._destination, "deposit")
  await handler.handle("111.111.111-11", "222.222.222-22", 500)
  expect(handler._destination.deposit).toHaveBeenCalledWith(500)
})

test("Transaction commits", async () => {
  let handler = new TestTransferHandler()
  jest.spyOn(handler._transaction, "commit")
  await handler.handle("111.111.111-11", "222.222.222-22", 500)
  expect(handler._transaction.commit).toHaveBeenCalled()
})

test("Transactino rolls back when something goes wrong", async () => {
  let handler = new TestTransferHandler()
  handler._transaction.commit = async () => { throw new Error() }
  jest.spyOn(handler._transaction, "rollback")
  let result = await handler.handle("111.111.111-11", "222.222.222-22", 500)
  expect(handler._transaction.rollback).toHaveBeenCalled()
  expect(result.ok).toBeFalsy()
  expect(result.data).toBeInstanceOf(Error)
})