import { Connection } from "./connection";

const POSTGRES_URL = "postgres://postgres@localhost/donusbank_test"

test("Should failed with bad connection string", () => {
  let conn = new Connection("")
  let p = conn.query("SELECT * FROM entries", [])
  expect(p).rejects.toBeInstanceOf(Error)
})

test("Should execute statements", async () => {
  let conn = new Connection(POSTGRES_URL)
  let r1 = await conn.execute("DROP TABLE IF EXISTS testing; CREATE TABLE testing(id integer)", [])
  let r2 = await conn.execute("INSERT INTO testing VALUES($1)", [1])
  expect(r1).toBe(0)
  expect(r2).toBe(1)
})

test("Should run queries", async () => {
  let conn = new Connection(POSTGRES_URL)
  let r = await conn.query("SELECT * FROM testing", [])
  expect(r).toMatchObject([{ id: 1 }])
})

test("Should run rollback transactions", async () => {
  let conn = new Connection(POSTGRES_URL)
  await conn.run(async (client) => {
    await client.execute("INSERT INTO testing VALUES($1)", [2])
    await client.rollback()
  })
  let r = await conn.query("SELECT * FROM testing", [])
  expect(r).toMatchObject([{ id: 1 }])
})

test("Should run commit transactions", async () => {
  let conn = new Connection(POSTGRES_URL)
  await conn.run(async (client) => {
    await client.execute("INSERT INTO testing VALUES($1)", [2])
    await client.commit()
  })
  let r = await conn.query("SELECT * FROM testing", [])
  expect(r).toMatchObject([{ id: 1 }, { id: 2 }])
})

test("Transactions don't hide errors", async () => {
  let conn = new Connection(POSTGRES_URL)
  await expect(conn.run(async (client) => {
    await client.execute("INVALID SQL", [])
  })).rejects.toBeInstanceOf(Error)
})

test("Transactions can execute queries", async () => {
  let conn = new Connection(POSTGRES_URL)
  await conn.run(async (client) => {
    let res = await client.query("SELECT * FROM testing", [])
    expect(res.length).toBe(2)
  })
})

test("Transactions execute multiple statements", async () => {
  let conn = new Connection(POSTGRES_URL)
  await conn.run(async (client) => {
    let rows = await client.execute("INSERT INTO testing VALUES(3); INSERT INTO testing VALUES(4)", [])
    expect(rows).toBe(2)
  })
})