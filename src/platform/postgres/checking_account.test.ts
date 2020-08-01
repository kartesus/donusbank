import CPF from "cpf"
import { v4 as uuid } from "uuid";

import { Connection } from "./connection"
import { CheckingAccount } from "./checking_account";

const POSTGRES_URL = "postgres://postgres@localhost/donusbank_test"
const UUID = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/

test("Creates account", async () => {
  let conn = new Connection(POSTGRES_URL)
  let account = new CheckingAccount(conn)
  account.name = "Alex Gravem"
  account.fiscalNumber = CPF.generate()
  await account.createAccount()

  let res = await conn.query(
    `SELECT * FROM accounts WHERE fiscalNumber = $1`,
    [account.fiscalNumber])

  expect(res[0]).toMatchObject({
    id: expect.stringMatching(UUID),
    name: account.name,
    fiscalnumber: account.fiscalNumber
  })
})

test("Account verification fails when account doesn't exist", async () => {
  let conn = new Connection(POSTGRES_URL)
  let account = new CheckingAccount(conn)
  account.name = "Alex Gravem"
  account.fiscalNumber = CPF.generate()
  try {
    await account.verify()
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
  }
})

test("Account verification succeeds and loads account data", async () => {
  let conn = new Connection(POSTGRES_URL)
  let account = new CheckingAccount(conn)
  account.name = "Alex Gravem"
  account.fiscalNumber = CPF.generate()
  try {
    await account.createAccount()
    await account.verify()
  } finally {
    expect(account).toMatchObject({
      ID: expect.stringMatching(UUID),
      name: "Alex Gravem",
      fiscalNumber: account.fiscalNumber,
      version: 0,
      initialBalance: 0
    })
  }
})

test("Withdraw authorization fails when balance is negative", async () => {
  let conn = new Connection(POSTGRES_URL)
  let account = new CheckingAccount(conn)
  account.name = "Alex Gravem"
  account.fiscalNumber = CPF.generate()
  account.withdraw(100)
  account.withdraw(100)
  await expect(conn.run(async (conn) => {
    await account.commitWithinTransaction(conn, uuid())
  })).rejects.toThrow()
})


afterAll(async () => {
  let conn = new Connection(POSTGRES_URL)
  await conn.execute("TRUNCATE entries,accounts", [])
})