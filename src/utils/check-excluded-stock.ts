import { postgres } from '../db.config'

const checkExcludedStock = async (): Promise<string[]> => {
  const excludedStock: string[] = []

  const { rows } = await postgres.query('SELECT * FROM excludeStock')
  for (const [, row] of rows.entries()) {
    excludedStock.push(row.id)
  }

  return excludedStock
}

export default checkExcludedStock
