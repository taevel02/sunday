import { AuthService } from './auth'
import { DomesticStockService } from './domestic'

import { EvernoteService } from './evernote'

/** 주식과 직접적으로 관련있는 서비스 매니지먼트 */
export const AuthManagement = new AuthService()
export const DomesticStockManagement = new DomesticStockService()

/** Sunday-AI 를 서비스하기 위해 부가적으로 사용 중인 서비스 매니지먼트 */
export const EvernoteManagement = new EvernoteService()
