import { createGetServerSideAuth } from 'aws-cognito-next'
import { createGetClientSideAuth } from './utils/authUtils'
import pems from './pems.json'
// export const useAuth = createUseAuth({ pems })

export * from 'aws-cognito-next'
export const getServerSideAuth = createGetServerSideAuth({ pems })
export const getClientSideAuth = createGetClientSideAuth({ pems })
