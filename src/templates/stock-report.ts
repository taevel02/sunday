import dayjs from 'dayjs'
import getPriceFormatter from '../utils/price-formatter'

/**
 *
 * @todo 총 주식수 대비 유통 주식수를 계산하는 로직이 필요합니다.
 */

// stotprice: 시총
const StockReport = (stotprice: number) => {
  return `<b><span>◎ 기본 정보 (${dayjs(new Date()).format(
    'YYYY.MM.DD'
  )})</span></b><br /><span>▶ 시총 ${getPriceFormatter(
    stotprice
  )}, 유통주식수 주</span><br /><span>▶ 최대주주 및 특수관계인 지분 %</span><br /><span>▶ 별도기준 매출액 연속흑자, 영업이익 연속적자 (적자폭 大/小)</span><br /><span>▶ 부채비율 %, 유보율 %</span><br /><br /><b><span>◎ 재료</span></b><br /><span>▶ #섹터/테마</span><br /><span>- 재료에 대한 설명</span><br /><span>- 관련기사: (날짜)(제목)</span><br /><br /><b><span>◎ 재무</span></b><br /><span>▶ 재무추이(별도)</span><br /><span>▶ 재무비율(연결)</span><br /><br /><hr /><b><span>◎ 종목 히스토리 상세</span></b><br /><span>#섹터/테마</span><br /><span>(날짜)제목</span><br /><span>중요 내용 스크랩</span><br /><br /><b><span>◎ 차트</span></b><br />`
}

export default StockReport

// ◎ 기본 정보 (yyyy.mm.dd)
// ▶ 시총 0억, 유통주식수 0주
// ▶ 최대주주 및 특수관계인 지분 0%
// ▶ 별도기준 매출액 연속흑자, 영업이익 연속적자 (적자폭 大/小)
// ▶ 부채비율 0%, 유보율 0%

// ◎ 재료
// ▶ #섹터/테마 (ex. 5G, 자율주행, 메타버스, 2차전지, ...)
// - 재료에 대한 설명
// - 관련기사: (날짜)제목

// ◎ 재무
// ▶ 재무추이(별도)
// ▶ 재무비율(연결)

// ---
// ◎ 종목 히스토리 상세
// #섹터/테마
// (날짜)제목
// 중요 내용 스크랩
// #섹터/테마 2
// (날짜)제목
// 중요 내용 스크랩

// ◎ 차트
