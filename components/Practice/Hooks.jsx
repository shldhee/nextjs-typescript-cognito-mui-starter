import React, { useState, useEffect } from 'react'

const Child = () => {
  console.log('Child render start')
  const [text, setText] = useState(() => {
    console.log('Child useState')
    return ''
  })
  useEffect(() => {
    console.log('Child useEffect(() => {}); no deps')
  })
  useEffect(() => {
    console.log('Child useEffect(() => {}); empty')
  }, [])
  useEffect(() => {
    console.log('Child useEffect(() => {}); show')
  }, [text])

  function handleChange(event) {
    setText(event.target.value)
  }
  const element = (
    <>
      <input onChange={handleChange} />
      <p>{text}</p>
    </>
  )
  console.log('Child render end')
  return element
}

const Hooks = () => {
  console.log('App render')
  const [show, setShow] = useState(() => {
    console.log('APP useState')
    return false
  })

  useEffect(() => {
    console.log('useEffect(() => {}); no deps')
  })
  useEffect(() => {
    console.log('useEffect(() => {}); empty')
  }, [])
  useEffect(() => {
    console.log('useEffect(() => {}); show')
  }, [show])

  function handleClick() {
    setShow((prev) => !prev)
  }
  console.log('App render end')
  return (
    <>
      <h1>Hooks</h1>
      <button onClick={handleClick}>Search</button>
      {show ? <Child /> : null}
    </>
  )
}

export default Hooks
