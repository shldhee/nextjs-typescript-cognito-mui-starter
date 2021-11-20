import React, { useState } from 'react'

const Item = ({ name, age }) => (
  <li>
    <p>{`${name} - ${age}`}</p>
  </li>
)

const url =
  'https://raw.githubusercontent.com/techoi/raw-data-api/main/simple-api.json?id=react'
export default function Mocking() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const handleClick = () => {
    fetch(url)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        setData(json.data)
      })
      .catch((error) => {
        setError(`Something wrong: ${error}`)
      })
  }
  const handleClick2 = () => {
    fetch('/login')
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then((json) => {
        console.log(JSON.stringify(json))
      })
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h1>Mocking</h1>
      <p>모의 데이터를 활용해서 만드는것이 모킹(Mocking)</p>
      <p>
        data fetch를 해야하는 경우 통신을 통해 응답을 내려주는 서버가 있어야
        한다. <br />
        서버 대신 mocking 으로 대신한다.
      </p>

      <button onClick={handleClick}>데이터 가져오기</button>
      <button onClick={handleClick2}>데이터 가져오기2</button>
      {data && (
        <ul>
          {data.people.map(({ name, age }) => (
            <Item key={`${name}=${age}`} name={name} age={age} />
          ))}
        </ul>
      )}
    </div>
  )
}
