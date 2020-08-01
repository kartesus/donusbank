import { AccountLedger } from "./account_ledger";

test("Deposit adds a new positive entry to the ledger", () => {
  let ledger = new AccountLedger()
  ledger.deposit(100)
  expect(ledger.entries[0]).toMatchObject({ amount: 100, version: 1 })
})

test("Withdraw adds a new negative entry to the ledger", () => {
  let ledger = new AccountLedger()
  ledger.withdraw(100)
  expect(ledger.entries[0]).toMatchObject({ amount: -100, version: 1 })
})

test("The version for a new entry is the calculated from the initial version", () => {
  let ledger = new AccountLedger()
  ledger.version = 50
  ledger.deposit(100)
  ledger.withdraw(100)
  expect(ledger.entries[1]).toMatchObject({ version: 52 })
})

test("The balance should account for initial balance and entries", () => {
  let ledger = new AccountLedger()
  ledger.initialBalance = 50
  ledger.deposit(75)
  ledger.withdraw(25)
  expect(ledger.balance).toBe(100)
})