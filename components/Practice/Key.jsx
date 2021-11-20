import React from 'react'

export default function Key() {
  return (
    <div>
      map 돌릴때 key를 없으면 재활용이 안된다.(재조정 X) focus가 유지되고 안에
      텍스트만 변경된다.(index로 할 경우도 같다.) 공유한 id를 key값으로 해야
      컴포넌트 focus가 유지면되서 따라나닌다.
    </div>
  )
}
