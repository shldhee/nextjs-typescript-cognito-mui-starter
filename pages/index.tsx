// pages/index.tsx
import React, { useState, useEffect, useCallback } from 'react'
import Auth from '@aws-amplify/auth'
import { GetServerSideProps } from 'next'
import {
  AuthTokens,
  useAuthFunctions,
  getServerSideAuth,
  getClientSideAuth,
} from '../auth'

async function refreshToken() {
  try {
    const cognitoUser = await Auth.currentAuthenticatedUser()
    const currentSessionRefreshToken = (
      await Auth.currentSession()
    ).getRefreshToken()

    cognitoUser.refreshSession(currentSessionRefreshToken, () => {
      onSignInSuccess()
    })
    return getClientSideAuth(document.cookie)
  } catch (error) {
    console.error(error)
    return null
  }
}

function onSilentRefresh() {
  try {
    refreshToken()
  } catch (error) {
    console.error('error onSilentRefresh', error)
  }
}

function onSignInSuccess() {
  console.log('run onSignInSuccess')
  const JWT_EXPIRY_TIME = 1 * 3600 * 1000 // 만료 시간 (1시간 밀리 초로 표현)
  setTimeout(onSilentRefresh, JWT_EXPIRY_TIME - 60000) // 1분 전에 갱신
}

const Home = ({ initialAuth }: { initialAuth: AuthTokens }) => {
  const [auth, setAuth] = useState(initialAuth)
  const [username, setUsername] = useState('')
  const [userAuth, setUserAuth] = useState('')
  const [password, setPassword] = useState('')
  const [initPassword, setInitPassword] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    async function refreshTokenAndSetAuth() {
      const auth = await refreshToken()
      setAuth(auth)
    }
    refreshTokenAndSetAuth()
  }, [])

  const signIn = async () => {
    try {
      const user = await Auth.signIn(username, password)
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        console.log('새로운 비밀번호 변경하기 로직으로')
        setIsNewUser(true)
        setUserAuth(user)
      } else {
        setAuth(getClientSideAuth(document.cookie))
        onSignInSuccess()
      }
    } catch (error) {
      console.log('error signing in', error)
    }
  }

  const changeInitPassword = async () => {
    try {
      const result = await Auth.completeNewPassword(userAuth, initPassword, {
        email: username,
      })
      setAuth(getClientSideAuth(document.cookie))
      onSignInSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  const signOut = async () => {
    try {
      await Auth.signOut()
      window.location.reload()
    } catch (error) {
      console.log('error signing out: ', error)
    }
  }

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const handleChangeInitPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitPassword(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const getUserToken = async () => {
    try {
      const currentSession = await Auth.currentSession()
      console.log('currentSession : ', currentSession)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          username :
          <input type="text" onChange={handleChangeUsername} />
        </label>
        <label>
          password :
          <input type="text" onChange={handleChangePassword} />
        </label>
        {/* <button onClick={signUp}>Sign Up</button> */}
        <button onClick={signIn}>Sign In</button>
        <button onClick={signOut}>Sign Out</button>
        <button onClick={getUserToken}>Get User Token</button>
      </form>
      <div>
        {isNewUser && (
          <div>
            <span>New password</span>
            <input type="text" onChange={handleChangeInitPassword} />
            <button onClick={changeInitPassword}>initPassword</button>
          </div>
        )}
      </div>
      {/* <div>
        oldPassword :{' '}
        <input type="password" onChange={handleChangeOldPassword} />
        newPassword :{' '}
        <input type="password" onChange={handleChangeNewPassword} />
        <button onClick={changePassword}>Change Password</button>
      </div> */}
      {auth ? (
        <p>Welcome {auth.idTokenData['cognito:username']}</p>
      ) : (
        <p>Welcome anonymous</p>
      )}
      {/* {auth ? (
        <button type="button" onClick={() => logout()}>
          sign out
        </button>
      ) : (
        <>
          <button type="button" onClick={() => login()}>
            sign in
          </button>
        </>
      )} */}
      {auth ? (
        <>
          <h4>IdTokenData</h4>
          <div>
            <>
              <p>auth.idTokenData.email : {auth.idTokenData.email}</p>
              <p>
                auth.idTokenData[&quot;cognito:username&quot;] :
                {auth.idTokenData['cognito:username']}
              </p>
            </>
          </div>
          <h4>AccessTokenData</h4>
          <div>{auth.accessTokenData.username}</div>
        </>
      ) : (
        <p>
          <small>
            Your email address will not be shared. You will not get any spam. It
            is only needed for the example.
          </small>
        </p>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  initialAuth: AuthTokens
}> = async (context) => {
  // getServerSideAuth will parse the cookie
  const initialAuth = getServerSideAuth(context.req)
  return { props: { initialAuth } }
}

export default Home
