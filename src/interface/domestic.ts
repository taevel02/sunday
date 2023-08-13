/**
 * 300 주식
 * 301 선물옵션
 * 302 채권
 * 512 미국 나스닥 / 513 미국 뉴욕 / 529 미국 아멕스
 * 515 일본
 * 501 홍콩 / 543 홍콩CNY / 558 홍콩USD
 * 507 베트남 하노이 / 508 베트남 호치민
 * 551 중국 상해A / 552 중국 심천A
 */
export type PRDT_TYPE_CD = 300 | 301 | 302 | 512 | 515 | 501 | 507 | 551

export enum TR_ID {
  '국내휴장일조회' = 'CTCA0903R',
  '종목조건검색조회' = 'HHKST03900400',
  '상품기본조회' = 'CTPF1604R',
  '국내주식업종기간별시세' = 'FHKUP03500100'
}

export enum CUSTOMER_TYPE {
  '개인' = 'P',
  '법인' = 'B'
}

interface BaseResponse {
  rt_cd: string // 성공 실패 여부
  msg_cd: string // 응답코드
  msg1: string // 응답메시지
}

export interface StockInfo {
  code: string // 종목코드
  name: string // 종목명
  chgrate: string // 등락률
  acml_vol: string // 거래량
  trade_amt: string // 거래대금
  stotprice: string // 시가총액
}

export interface HolidayRequest {
  BASS_DT: string
  CTX_AREA_NK: string
  CTX_AREA_FK: string
}

export interface HolidayResponse extends BaseResponse {
  output: {
    bass_dt: string
    wday_dvsn_cd: string
    bzdy_yn: string // 영업일여부
    tr_day_yn: string // 거래일여부
    opnd_yn: string // 개장일여부
    sttl_day_yn: string // 결제일여부
  }[]
}

export interface MarketIndex {
  bstp_nmix_prdy_vrss: string // 업종 지수 전일 대비
  prdy_vrss_sign: string // 전일 대비 부호 - 상승: 2, 보합: 3, 하락: 5
  bstp_nmix_prdy_ctrt: string // 업종 지수 전일 대비율
  bstp_nmix_prpr: string // 업종 지수 현재가
}

export interface MarketIndexRequest {
  FID_COND_MRKT_DIV_CODE: string // 조건 시장 분류 코드 - 업종: U
  FID_INPUT_ISCD: string // 업종 상세코드 - 코스피: 0001, 코스닥 1001
  FID_INPUT_DATE_1: string // 조회 시작일
  FID_INPUT_DATE_2: string // 조회 종료일
  FID_PERIOD_DIV_CODE: string // 기간분류코드 - D:일봉 W:주봉, M:월봉, Y:년봉
}

export interface MarketIndexResponse extends BaseResponse {
  output1: MarketIndex
}

export interface PSearchResultRequest {
  user_id: string
  seq: number
}

export interface PSearchResultResponse extends BaseResponse {
  output2: StockInfo[]
}

export interface SearchStockInfoRequest {
  PDNO: string
  PRDT_TYPE_CD: PRDT_TYPE_CD
}

export interface SearchStockInfoResponse extends BaseResponse {
  output: {
    shtn_pdno: string // 상품번호
    prdt_abrv_name: string // 상품명
  }
}
