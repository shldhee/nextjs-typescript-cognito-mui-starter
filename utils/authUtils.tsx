import Auth from '@aws-amplify/auth'
import cookie from 'cookie'
import jsonwebtoken, { TokenExpiredError } from 'jsonwebtoken'
import base_64 from 'base-64'

export type IdTokenData = {
  sub: string
  aud: string
  email_verified: boolean
  event_id: string
  token_use: 'id'
  auth_time: number
  iss: string
  'cognito:username': string
  exp: number
  iat: number
  email: string
}

export type AccessTokenData = {
  sub: string
  event_id: string
  token_use: string
  scope: string
  auth_time: number
  iss: string
  exp: number
  iat: number
  jti: string
  client_id: string
  username: string
}

export type AuthTokens = {
  accessTokenData: AccessTokenData
  idTokenData: IdTokenData
  idToken: string
  accessToken: string
} | null

type AWSCognitoPublicPem = string
type AWSCognitoPublicPems = {
  [region: string]: {
    [userPoolId: string]: {
      [kid: string]: AWSCognitoPublicPem
    }
  }
}

const getAuthFromCookies = (
  pems: AWSCognitoPublicPems,
  cookie?: string,
): AuthTokens => {
  if (!cookie) return null
  const userPoolWebClientId = process.env.USER_POOL_CLIENT_ID
  const { idToken, accessToken } = getCognitoCookieInfo(
    cookie,
    userPoolWebClientId,
  )
  if (!idToken || !accessToken) return null
  const idTokenData = verifyToken({
    pems,
    token: idToken,
    validate: (data: IdTokenData): boolean => {
      return data.aud === userPoolWebClientId
    },
  })
  const accessTokenData = verifyToken({
    pems,
    token: accessToken,
    validate: (data: AccessTokenData): boolean => {
      return data.client_id === userPoolWebClientId
    },
  })
  if (!idTokenData || !accessTokenData) return null

  return {
    accessTokenData: accessTokenData as AccessTokenData,
    idTokenData: idTokenData as IdTokenData,
    idToken,
    accessToken,
  }
}

const getMatchingPem = (
  pems: AWSCognitoPublicPems,
  token: string,
): AWSCognitoPublicPem | undefined => {
  if (!token) return undefined
  const config = Auth.configure()
  if (!config.region || !config.userPoolId) return undefined
  if (!pems[config.region]) return undefined

  if (!pems[config.region][config.userPoolId]) return undefined
  const header = JSON.parse(base_64.decode(token.split('.')[0]))
  return pems[config.region][config.userPoolId][header.kid]
}

const verifyToken = <T extends { sub: string }>({
  pems,
  token,
  validate,
}: {
  pems: AWSCognitoPublicPems
  token: string | null
  validate?: (data: T) => boolean
}): null | T => {
  if (!token) return null
  try {
    const pem = getMatchingPem(pems, token)
    if (!pem) return null
    const data = jsonwebtoken.verify(token, pem, {
      algorithms: ['RS256'],
    }) as T
    if (!data) return null
    if (validate ? !validate(data) : false) return null
    return data
  } catch (e) {
    if (!(e instanceof jsonwebtoken.TokenExpiredError)) {
      console.log(e)
    }
    return null
  }
}

const unauthenticatedCookies = {
  lastUser: null,
  idToken: null,
  accessToken: null,
}
// use same algorithm as js-cookie which is used in aws-amplify/auth@4.20
const userIdToTokenKey = (key: string) => {
  return encodeURIComponent(key)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape)
}
// returns all auth cookies
const getCognitoCookieInfo = (
  cookieString: string | undefined,
  userPoolWebClientId?: string,
): {
  lastUser: string | null
  idToken: string | null
  accessToken: string | null
} => {
  if (!userPoolWebClientId)
    // To fix this issue, call
    // Amplify.configure({ Auth: { userPoolWebClientId: <userPoolClientId> } })
    throw new Error(
      "Missing configuration value for userPoolWebClientId in Amplify's Auth",
    )
  if (!cookieString) return unauthenticatedCookies
  const cookieData: { [key: string]: string } = cookie.parse(cookieString)
  const prefix = `CognitoIdentityServiceProvider.${userPoolWebClientId}`
  const lastUserKey = `${prefix}.LastAuthUser`
  const lastUser = cookieData[lastUserKey] ? cookieData[lastUserKey] : null
  const idTokenKey = lastUser
    ? prefix + '.' + userIdToTokenKey(lastUser) + '.idToken'
    : null
  const idToken =
    idTokenKey && cookieData[idTokenKey] ? cookieData[idTokenKey] : null
  const accessTokenKey = lastUser
    ? prefix + '.' + userIdToTokenKey(lastUser) + '.accessToken'
    : null
  const accessToken =
    accessTokenKey && cookieData[accessTokenKey]
      ? cookieData[accessTokenKey]
      : null
  return { lastUser, idToken, accessToken }
}

export const createGetClientSideAuth = ({
  pems,
}: {
  pems: AWSCognitoPublicPems
}) => {
  return (cookie: string) => getAuthFromCookies(pems, cookie)
}
