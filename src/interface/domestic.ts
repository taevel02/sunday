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
  '상품기본조회' = 'CTPF1604R'
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
  chgrate: string // 등락율
  acml_vol: string // 거래량
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
