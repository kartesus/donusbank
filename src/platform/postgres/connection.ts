import { Pool, PoolClient } from "pg";

export class Connection {
  private pool: Pool

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString })
  }

  async query(stmt: string, values: Array<any>) {
    let client = await this.pool.connect()
    try {
      let res = await client.query(stmt, values)
      return res.rows
    } finally {
      client.release()
    }
  }

  async execute(stmt: string, values: Array<any>) {
    let client = await this.pool.connect()
    try {
      let res = await client.query(stmt, values)
      if (Array.isArray(res)) return 0
      else return Number(res.rowCount)
    } finally {
      client.release()
    }
  }

  async run(fn: (c: PoolClient) => Promise<void>) {
    let client = await this.pool.connect()
    try {
      await fn(client)
    } finally {
      client.release()
    }
  }
}