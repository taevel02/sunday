import { AxiosResponse } from 'axios'

export enum ServerResponseCode {
  OK = 200,
  FORBIDDEN = 403,
  NOT_FOUND = 404
}

export interface ServerResponse<T = unknown> extends AxiosResponse {
  data: {
    code: ServerResponseCode
    result?: T
    reason?: string
  }
}
