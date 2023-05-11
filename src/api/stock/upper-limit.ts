import { InvestZumApiStruct } from '@/interface/stock'
import { stockinfo } from '../axios'

const upperLimit = async (): Promise<InvestZumApiStruct | undefined> => {
  try {
    const { data }: { data: InvestZumApiStruct } = await stockinfo.get(
      '/ranking?category=UPPER_LIMIT'
    )

    return data
  } catch (e) {
    console.log(e)
  }
}

export default upperLimit
