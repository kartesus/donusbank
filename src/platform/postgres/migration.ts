import { Client } from "pg";

function main() {
  let client = new Client({ connectionString: process.env.POSTGRES_URL })
  let query = `
    DROP TABLE IF EXISTS accounts CASCADE;
    DROP TABLE IF EXISTS entries CASCADE;
    DROP TABLE IF EXISTS transactions CASCADE;
    
    CREATE TABLE accounts(
      id uuid, 
      name varchar(200), 
      fiscalNumber varchar(15),
      primary key(id),
      unique(fiscalNumber));
      
    CREATE TABLE transactions(
      id uuid, 
      source varchar(200), 
      destination varchar(200), 
      amount integer,
      primary key(id));

    CREATE TABLE entries(
      id uuid, 
      transactionID uuid, 
      accountID uuid,
      amount integer, 
      version integer,
      primary key(id),
      unique(id, version),
      constraint fk_transaction
        foreign key(transactionID) 
          references transactions(id));`

  client.connect()
  client.query(query, (err, _res) => {
    if (err) console.error(err)
    client.end()
  })
}

main()