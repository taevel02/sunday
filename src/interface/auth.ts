export interface AuthVerifyRequest {
  grant_type: string
  appsecret: string
  appkey: string
}

export interface AuthVerifyResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface AuthRevokeRequest {
  appkey: string
  appsecret: string
  token: string
}

export interface AuthRevokeResponse {
  code: number
  message: string
}
