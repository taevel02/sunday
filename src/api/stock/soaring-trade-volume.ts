import { InvestZumApiStruct } from '@/interface/stock'
import { stockinfo } from '../axios'

const soaringTradeVolume = async (): Promise<InvestZumApiStruct | undefined> => {
  try {
    const { data }: { data: InvestZumApiStruct } = await stockinfo.get(
      '/ranking?category=SOARING_TRADE_VOLUME'
    )

    return data
  } catch (e) {
    console.log(e)
  }
}

export default soaringTradeVolume
