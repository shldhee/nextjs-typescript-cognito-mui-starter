import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import Amplify from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'

// start the mocking conditionally.
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const { worker } = require('../mocks/browser')
  worker.start()
}

Amplify.configure({
  Auth: {
    // region: 'eu-central-1', //! Konfiguration
    region: 'us-west-1', //! Konfiguration
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_CLIENT_ID,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // example taken from https://aws-amplify.github.io/docs/js/authentication
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      // This should be the subdomain in production as the cookie should only
      // be present for the current site
      domain: process.env.AUTH_COOKIE_DOMAIN,
      // OPTIONAL - Cookie path
      path: '/',
      // OPTIONAL - Cookie expiration in days
      expires: 7,
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      // The cookie can be secure in production
      secure: false,
    },
  },
})

Auth.configure({
  oauth: {
    domain: process.env.IDP_DOMAIN,
    scope: ['email', 'openid'],
    // we need the /autologin step in between to set the cookies properly,
    // we don't need that when signing out though
    redirectSignIn: process.env.REDIRECT_SIGN_IN,
    redirectSignOut: process.env.REDIRECT_SIGN_OUT,
    responseType: 'token',
  },
})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
export default MyApp
