import React, { useRef, useEffect } from 'react'

export default function RefDom() {
  const inputRef = useRef()
  const divRef = useRef()
  useEffect(() => {
    console.log('inputRef : ', inputRef)
    inputRef.current.focus()

    setTimeout(() => {
      divRef.current.style.background = 'red'
    }, 1000)
  })
  return (
    <>
      <h1>RefDom</h1>
      <input type="text" ref={inputRef} />
      <div
        ref={divRef}
        style={{ height: 100, width: 100, background: 'brown' }}
      ></div>
    </>
  )
}
