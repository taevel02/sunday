import { AxiosError, AxiosResponse } from 'axios'
import { ServerResponse, ServerResponseCode } from '../interface/api'
import {
  AuthRevokeRequest,
  AuthRevokeResponse,
  AuthVerifyRequest,
  AuthVerifyResponse
} from '../interface/auth'
import { KIS_API } from '../utils/axios'

export class AuthService {
  public async verify(
    request: AuthVerifyRequest
  ): Promise<ServerResponse<AuthVerifyResponse>> {
    try {
      const authVerifyResults = (
        await KIS_API.post<AuthVerifyResponse>('/oauth2/tokenP', request)
      ).data

      if (authVerifyResults === undefined) {
        return {
          code: ServerResponseCode.NOT_FOUND
        }
      }

      return {
        code: ServerResponseCode.OK,
        result: authVerifyResults
      }
    } catch (err) {
      const error = err as AxiosError
      return {
        code: error.response?.status ?? -1
      }
    }
  }

  public async revoke(
    request: AuthRevokeRequest
  ): Promise<ServerResponse<AuthRevokeResponse>> {
    try {
      const authRevokeResults = (
        await KIS_API.post<
          AuthRevokeRequest,
          AxiosResponse<ServerResponse<AuthRevokeResponse>>
        >('/oauth2/revokeP', request)
      ).data

      if (
        authRevokeResults.code !== ServerResponseCode.OK ||
        authRevokeResults.result === undefined
      ) {
        return {
          code: authRevokeResults.code
        }
      }

      return {
        code: authRevokeResults.code,
        result: authRevokeResults.result
      }
    } catch (err) {
      const error = err as AxiosError
      return {
        code: error.response?.status
      }
    }
  }
}
