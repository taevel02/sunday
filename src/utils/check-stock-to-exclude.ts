import { postgres } from '../db.config'

const excludeStock = ['스팩', '우']

const checkStockToExclude = async (stockName: string): Promise<Boolean> => {
  const { rows } = await postgres.query('SELECT * FROM excludeStock')
  for (const [, row] of rows.entries()) {
    excludeStock.push(row.name)
  }

  return Object.values(excludeStock).some((word) => stockName.includes(word))
}

export default checkStockToExclude
