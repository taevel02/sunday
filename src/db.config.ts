import { Client } from 'pg'

export const postgres = new Client({
  user: 'postgres',
  host: process.env.PGHOST,
  database: 'railway',
  password: process.env.PGPASSWORD,
  port: 7731
})
