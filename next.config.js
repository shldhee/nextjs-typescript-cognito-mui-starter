/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    IDP_DOMAIN: process.env.IDP_DOMAIN,
    USER_POOL_ID: process.env.USER_POOL_ID,
    USER_POOL_CLIENT_ID: process.env.USER_POOL_CLIENT_ID,
    REDIRECT_SIGN_IN: process.env.REDIRECT_SIGN_IN,
    REDIRECT_SIGN_OUT: process.env.REDIRECT_SIGN_OUT,
    AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN,
  },
}
