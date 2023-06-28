export enum ServerResponseCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

export interface ServerResponse<T = unknown> {
  result?: T
  code: ServerResponseCode
  isAxiosError?: boolean
  reason?: string
}
