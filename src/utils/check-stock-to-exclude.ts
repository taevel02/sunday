import { postgres } from '../db.config'

const checkStockToExclude = async (stockName: string): Promise<Boolean> => {
  const excludeStock = []

  const { rows } = await postgres.query('SELECT * FROM excludeStock')
  for (const [, row] of rows.entries()) {
    excludeStock.push(row.name)
  }

  return Object.values(excludeStock).some((word) => stockName.includes(word))
}

export default checkStockToExclude
