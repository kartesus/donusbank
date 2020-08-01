import { Pool } from "pg";

export interface TransactionalConnection {
  commit(): Promise<void>
  rollback(): Promise<void>
  execute(stmt: string, values: any[]): Promise<number>
  query(stmt: string, values: any[]): Promise<any[]>
}

export class Connection {
  private pool: Pool

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString })
  }

  async query(stmt: string, values: Array<any>) {
    let res = await this.pool.query(stmt, values)
    return res.rows
  }

  async execute(stmt: string, values: Array<any>) {
    let res = await this.pool.query(stmt, values)
    if (Array.isArray(res)) return 0
    else return Number(res.rowCount)
  }

  async run(fn: (c: TransactionalConnection) => Promise<void>) {
    let client = await this.pool.connect()
    let commit = async () => { await client.query("COMMIT") }
    let rollback = async () => { await client.query("ROLLBACK") }
    let query = async (stmt: string, values: any[]) => {
      let res = await client.query(stmt, values)
      return res.rows
    }
    let execute = async (stmt: string, values: any[]) => {
      let res = await client.query(stmt, values)
      if (Array.isArray(res)) return res.length
      else return Number(res.rowCount)
    }
    try {
      await client.query("BEGIN")
      await fn({ commit, rollback, query, execute })
    } catch (err) {
      throw err
    } finally {
      client.release()
    }
  }
}