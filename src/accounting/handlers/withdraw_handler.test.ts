import { WithdrawHandler } from "./withdraw_handler";
import { AccountLedger } from "../entities/account_ledger";
import { TreasuryAccount } from "../entities/tresury_account";
import { Transaction } from "../entities/transaction";
import { PersistentLedger } from "../traits/persistent_ledger";
import { PersistentTransaction } from "../traits/persistent_transaction";
import { Entry } from "../entities/entry";

class TestSourceAccount extends AccountLedger implements PersistentLedger {
  async authorizeWithdraw(transactionID: string): Promise<Entry[]> { return [] }
  async authorizeDeposit(transactionID: string): Promise<Entry[]> { return [] }
  async commit(): Promise<void> { }
  async rollback(): Promise<void> { }
  async verify(): Promise<void> { }
}

class TestDestinationAccount extends TreasuryAccount implements PersistentLedger {
  async authorizeWithdraw(transactionID: string): Promise<Entry[]> { return [] }
  async authorizeDeposit(transactionID: string): Promise<Entry[]> { return [] }
  async commit(): Promise<void> { }
  async rollback(): Promise<void> { }
}

class TestTransaction extends Transaction implements PersistentTransaction {
  async commit(): Promise<void> { }
  async rollback(): Promise<void> { }
}

class TestWithDrawHandler extends WithdrawHandler {
  _source: TestSourceAccount
  _destination: TestDestinationAccount
  _transaction: TestTransaction

  source = (fiscalNumber: string) => this._source
  destination = () => this._destination
  transaction = () => this._transaction

  constructor() {
    super()
    this._source = new TestSourceAccount()
    this._destination = new TestDestinationAccount()
    this._transaction = new TestTransaction()
  }

}

test("Transaction is setup correctly", async () => {
  let handler = new TestWithDrawHandler()
  let result = await handler.handle("111.111.111-11", 500)
  expect(result.ok).toBeTruthy()
  expect(result.data).toMatchObject({
    amount: 505,
    source: handler._source,
    destination: handler._destination
  })
})

test("Source is verified", async () => {
  let handler = new TestWithDrawHandler()
  jest.spyOn(handler._source, "verify")
  await handler.handle("111.111.111-11", 500)
  expect(handler._source.verify).toHaveBeenCalled()
})

test("There's two withdraw entries in source", async () => {
  let handler = new TestWithDrawHandler()
  jest.spyOn(handler._source, "withdraw")
  await handler.handle("111.111.111-11", 500)
  expect(handler._source.withdraw).toHaveBeenCalledWith(500)
  expect(handler._source.withdraw).toHaveBeenCalledWith(5)
})

test("There's two desposit entries in destination", async () => {
  let handler = new TestWithDrawHandler()
  jest.spyOn(handler._destination, "deposit")
  await handler.handle("111.111.111-11", 500)
  expect(handler._destination.deposit).toHaveBeenCalledWith(500)
  expect(handler._destination.deposit).toHaveBeenCalledWith(5)
})

test("Transaction commits", async () => {
  let handler = new TestWithDrawHandler()
  jest.spyOn(handler._transaction, "commit")
  await handler.handle("111.111.111-11", 500)
  expect(handler._transaction.commit).toHaveBeenCalled()
})

test("Transactino rolls back when something goes wrong", async () => {
  let handler = new TestWithDrawHandler()
  handler._transaction.commit = async () => { throw new Error() }
  jest.spyOn(handler._transaction, "rollback")
  let result = await handler.handle("111.111.111-11", 500)
  expect(result.ok).toBeFalsy()
  expect(result.data).toBeInstanceOf(Error)
})