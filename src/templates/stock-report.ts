import dayjs from 'dayjs'
import getPriceFormatter from '../utils/price-formatter'

// stotprice: 시총
const StockReport = (stotprice: number) => {
  return `<b><span>◎ 기업정보</span></b><br /><span>▶ 시총 ${getPriceFormatter(
    stotprice
  )} (${dayjs(new Date()).format(
    'YYYY.MM.DD'
  )})</span><br /><span>▶ 최대주주 및 특수관계인 지분 %</span><br /><span>▶ 재무추이</span><br /><span>- ${
    Number(dayjs(new Date()).format('YYYY')) - 1
  }년 매출액 억. 영업이익 억.</span><br /><span>- ${
    Number(dayjs(new Date()).format('YYYY')) - 2
  }년 매출액 억. 영업이익 억.</span><br /><span>▶ 부채비율 %, 유보율 % (년 월 기준)</span><br /><span>▶ 전자공시: </span><br /><span>▶ 홈페이지: </span><br /><br /><b><span>◎ 재료</span></b><br /><span>▶ 주요 연혁</span><br /><span>▶ 주요 제품</span><br /><span>▶ 연구개발</span><br /><span>▶ #섹터/테마</span><br /><span>▶ 타법인출자 현황</span><br /><span>[관계기업]</span><br /><span>[기타]</span><br /><br /><hr /><b><span>◎ 관련기사</span></b><br /><span>#섹터/테마</span><br /><span>(날짜)제목</span><br /><span>중요 내용 스크랩</span><br /><br /><b><span>◎기타 참고사항</span></b><br />`
}

export default StockReport

// ◎ 기업정보
// ▶ 시총 억 (yyyy.mm.dd)
// ▶ 최대주주 및 특수관계인 지분 %
// ▶ 재무추이
// - (yyyy-1)년 매출액 억. 영업이익 억.
// - (yyyy-2)년 매출액 억. 영업이익 억.
// ▶ 부채비율 %, 유보율 % (년 월 기준)
// ▶ 전자공시:
// ▶ 홈페이지:

// ◎ 재료
// ▶ 주요 연혁
// ▶ 주요 제품
// ▶ 연구개발
// ▶ #섹터/테마
// ▶ 타법인출자 현황
// [관계기업]
// [기타]

// ---
// ◎ 관련기사
// #섹터/테마
// (날짜)제목
// 중요 내용 스크랩
