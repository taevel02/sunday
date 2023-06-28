import dayjs from 'dayjs'

const StockReport = (stotprice: number) => {
  return `<b><span>◎ 요약</span></b><br /><span>▶ 시총 ${Math.floor(
    stotprice
  )}억 (${dayjs(new Date()).format(
    'YYYY.MM.DD'
  )})</span><br /><span>▶ 최대주주 및 특수관계인 지분 0%</span><br /><span>▶ 별도기준 영업이익 (연속 흑자)</span><br /><span>▶ 부채비율 0%, 유보율 0% (yyyy.mm.)</span><br /><span>▶ 미상환 전환사채 및 신주인수권부사채 등 발행현황</span><br /><br /><b><span>◎ 재료</span></b><br /><span>▶ 어떤 사업?</span><br /><span>▶ 테마</span><br /><span>▶ 테마</span><br /><span>▶ 기타</span><br /><br /><hr /><b><span>◎ 관련 기사</span></b><br /><span>(날짜)제목</span><br /><span>중요 내용 스크랩</span><br /><br /><hr /><b><span>◎ 재무</span></b><br /><span>▶ 재무추이</span><br /><span>▶ 연결기준 재무추이</span><br /><span>▶ 재무비율</span><br /><span>▶ 기타 재무사항</span><br /><br /><hr /><b><span>◎ 전자공시</span></b><br /><span>▶ 최대주주 및 특수관계인 현황</span><br /><span>▶ 주요 제품 및 서비스</span><br /><span>▶ 매출 및 수주상황</span><br /><br /><hr /><b><span>◎ 홈페이지</span></b><br /><span>회사연혁 | 회사명(도메인)</span><br /><span>사업영역 | 회사명(도메인)</span><br /><br /><hr /><b><span>◎ 차트</span></b><br />`
}

export default StockReport

// ◎ 요약
// ▶ 시총 0억 (yyyy.mm.dd.)
// ▶ 최대주주 및 특수관계인 지분 0%
// ▶ 별도기준 영업이익 (연속 흑자)
// ▶ 부채비율 0%, 유보율 0% (yyyy.mm.)
// ▶ 미상환 전환사채 및 신주인수권부사채 등 발행현황

// ◎ 재료
// ▶ 어떤 사업?
// ▶ 주요 제품
// ▶ 테마
// ▶ 기타

// ---
// ◎ 관련 기사
// (날짜)제목
// 중요 내용 스크랩

// ---
// ◎ 재무
// ▶ 재무추이
// ▶ 연결기준 재무추이
// ▶ 재무비율

// ---
// ◎ 전자공시
// ▶ 최대주주 및 특수관계인 현황
// ▶ 주요 제품  및 서비스
// ▶ 매출 및 수주 현황

// ---
// ◎ 홈페이지
// 회사연혁 | 회사명(도메인)
// 사업영역 | 회사명(도메인)

// ---
// ◎ 차트
