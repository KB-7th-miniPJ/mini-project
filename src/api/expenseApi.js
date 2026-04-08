const BASE_URL = 'http://localhost:3000'

// 전체 유저 가져온 뒤 travelId로 필터링
export const getMembersByTravelId = async (travelId) => {
  const res = await fetch(`${BASE_URL}/users`)
  if (!res.ok) throw new Error('유저 목록을 불러오지 못했습니다.')
  const users = await res.json()
  return users.filter(user => user.joinTravelIds.includes(travelId))
}


// 로그인 (이메일 + 비밀번호로 유저 찾기)
// export const login = async (email, password) => {
//   const res = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`)
//   if (!res.ok) throw new Error('로그인 요청 실패')
//   const users = await res.json()
//   if (users.length === 0) throw new Error('이메일 또는 비밀번호가 틀렸습니다.')
//   return users[0]
// }