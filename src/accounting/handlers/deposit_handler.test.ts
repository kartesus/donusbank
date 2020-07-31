import { DepositHandler } from "./deposit_handler";
import { AccountLedger } from "../entities/account_ledger";
import { TreasuryAccount } from "../entities/tresury_account";
import { Transaction } from "../entities/transaction";
import { PersistentLedger } from "../traits/persistent_ledger";
import { PersistentTransaction } from "../traits/persistent_transaction";

class TestSourceAccount extends TreasuryAccount implements PersistentLedger {
  async commit(): Promise<void> { }
  async rollback(): Promise<void> { }
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

class TestDepositHandler extends DepositHandler {
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
  let handler = new TestDepositHandler()
  let result = await handler.handle("111.111.111-11", 500)
  expect(result.ok).toBeTruthy()
  expect(result.data).toMatchObject({
    amount: 502,
    source: handler._source,
    destination: handler._destination
  })
})

test("Destination is verified", async () => {
  let handler = new TestDepositHandler()
  jest.spyOn(handler._destination, "verify")
  await handler.handle("111.111.111-11", 500)
  expect(handler._destination.verify).toHaveBeenCalled()
})

test("There's two withdraw entries in source", async () => {
  let handler = new TestDepositHandler()
  jest.spyOn(handler._source, "withdraw")
  await handler.handle("111.111.111-11", 500)
  expect(handler._source.withdraw).toHaveBeenCalledWith(500)
  expect(handler._source.withdraw).toHaveBeenCalledWith(2)
})

test("There's two desposit entries in destination", async () => {
  let handler = new TestDepositHandler()
  jest.spyOn(handler._destination, "deposit")
  await handler.handle("111.111.111-11", 500)
  expect(handler._destination.deposit).toHaveBeenCalledWith(500)
  expect(handler._destination.deposit).toHaveBeenCalledWith(2)
})

test("Transaction commits", async () => {
  let handler = new TestDepositHandler()
  jest.spyOn(handler._transaction, "commit")
  await handler.handle("111.111.111-11", 500)
  expect(handler._transaction.commit).toHaveBeenCalled()
})

test("Transactino rolls back when something goes wrong", async () => {
  let handler = new TestDepositHandler()
  handler._transaction.commit = async () => { throw new Error() }
  jest.spyOn(handler._transaction, "rollback")
  let result = await handler.handle("111.111.111-11", 500)
  expect(handler._transaction.rollback).toHaveBeenCalled()
  expect(result.ok).toBeFalsy()
  expect(result.data).toBeInstanceOf(Error)
})