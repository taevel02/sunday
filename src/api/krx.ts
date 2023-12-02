import client from '../utils/axios'

export interface StockInfo {
  ACC_TRDVAL: string // 거래대금
  ACC_TRDVOL: string // 거래량
  CMPPREVDD_PRC: string // 전일대비가격
  FLUC_RT: string // 등락률
  FLUC_TP_CD: string // 등락구분 (1: 상승, 2: 하락, 3: 보합, 4: 상한가, 5: 하한가)
  ISU_ABBRV: string // 종목명
  ISU_CD: string // 종목코드
  ISU_SRT_CD: string // 종목코드 (6자리)
  LIST_SHRS: string // 상장주식수
  MKTCAP: string // 시가총액
  MKT_ID: string // 시장구분
  MKT_NM: string // 시장명
  SECT_TP_NM?: string // 소속부
  TDD_CLSPRC: string // 종가
  TDD_HGPRC: string // 고가
  TDD_LWPRC: string // 저가
  TDD_OPNPRC: string // 시가
}

export interface IndexInfo {
  ACC_TRDVAL: string // 거래대금
  ACC_TRDVOL: string // 거래량
  CLSPRC_IDX: string // 종가
  CMPPREVDD_IDX: string // 전일대비지수
  FLUC_RT: string // 등락률
  FLUC_TP_CD: string // 등락구분 (1: 상승, 2: 하락)
  HGPRC_IDX: string // 고가
  IDX_NM: string // 지수명
  LWPRC_IDX: string // 저가
  MKTCAP: string // 시가총액
  OPNPRC_IDX: string // 시가
}

/**
 * true: O, false: X
 */
export interface StockIssueInfo {
  ADMISU_YN: string // 관리종목
  ARRANTRD_YN: string // 정리매매종목
  HALT_YN: string // 매매거래정지종목
  INVSTCAUTN_REMND_ISU_YN: string // 투자주의환기종목
  INVSTCAUTN_YN: string // 투자주의종목
  ISU_ABBRV: string // 종목명
  ISU_CD: string // 종목코드
  ISU_SRT_CD: string // 종목코드 (6자리)
  MKT_ID: string // 시장구분
  NFAITHDISCLS_YN: string // 불성실공시종목
  NVST_RISK_YN: string // 투자위험종목
  NVST_WARN_YN: string // 투자경고종목
  SRTTRM_OVERHEAT_ISU_TP_YN: string // 단기과열종목
  UNIT_TRD_YN: string // 상장주식수부족우선주
  VLWLIQU_VALU_YN: string // 단일가매매대상초저유동성종목
}

export type Market = 'ALL' | 'STK' | 'KSQ' | 'KNX'

export async function readMaxWorkDate(): Promise<string> {
  try {
    const trdDd = (
      await client.get<{ result: { output: { max_work_dt: string }[] } }>(
        '/executeForResourceBundle.cmd?baseName=krx.mdc.i18n.component&key=B128.bld'
      )
    ).data.result.output[0].max_work_dt

    return trdDd
  } catch (err) {
    throw err
  }
}

/**
 *
 * @param mktId ALL: 전체, STX: KOSPI, KSQ: KOSDAQ, KNX: KONEX
 */
export async function readAllStocks(mktId: Market): Promise<StockInfo[]> {
  try {
    const trdDd = await readMaxWorkDate()

    const response = await client.post<{ OutBlock_1: StockInfo[] }>(
      '/getJsonData.cmd',
      {
        bld: 'dbms/MDC/STAT/standard/MDCSTAT01501',
        locale: 'ko_KR',
        mktId,
        trdDd,
        share: '1',
        money: '1',
        csvxls_isNo: 'false'
      }
    )

    if (response.status !== 200)
      throw new Error(response.statusText ?? 'KRX API Error')

    return response.data.OutBlock_1
  } catch (err) {
    throw err
  }
}

/**
 *
 * @param idxIndMidclssCd 01: KRX, 02: KOSPI, 03: KOSDAQ, 04: 테마
 */
export async function readIndex(
  idxIndMidclssCd: '01' | '02' | '03' | '04'
): Promise<IndexInfo[]> {
  try {
    const trdDd = await readMaxWorkDate()
    const response = await client.post<{ output: IndexInfo[] }>(
      '/getJsonData.cmd',
      {
        bld: 'dbms/MDC/STAT/standard/MDCSTAT00101',
        locale: 'ko_KR',
        idxIndMidclssCd,
        trdDd,
        share: '2',
        money: '3',
        csvxls_isNo: 'false'
      }
    )

    if (response.status !== 200)
      throw new Error(response.statusText ?? 'KRX API Error')

    return response.data.output
  } catch (err) {
    throw err
  }
}

/**
 *
 * @param mktId ALL: 전체, STK: KOSPI, KSQ: KOSDAQ, KNX: KONEX
 */
export async function readStockIssues(
  mktId: Market
): Promise<StockIssueInfo[]> {
  try {
    const response = await client.post<{ OutBlock_1: StockIssueInfo[] }>(
      'http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd',
      {
        bld: 'dbms/MDC/STAT/standard/MDCSTAT02001',
        locale: 'ko_KR',
        mktId,
        csvxls_isNo: 'false'
      }
    )

    if (response.status !== 200)
      throw new Error(response.statusText ?? 'KRX API Error')

    return response.data.OutBlock_1
  } catch (err) {
    throw err
  }
}
