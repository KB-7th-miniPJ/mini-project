import axios from "axios"

const BASE_URL = 'http://localhost:3000'

// 전체 유저 가져온 뒤 travelId로 필터링
export const getMembersByTravelId = async (travelId) => {
  const res = await axios.get(`${BASE_URL}/users`)
  return res.data.filter(user => user.joinTravelIds.includes(travelId))
}


// const BASE_URL = 'http://localhost:3000'


// // 전체 유저 가져온 뒤 travelId로 필터링
// export const getMembersByTravelId = async (travelId) => {
//   const res = await fetch(`${BASE_URL}/users`)
//   if (!res.ok) throw new Error('유저 목록을 불러오지 못했습니다.')
//   const users = await res.json()
//   return users.filter(user => user.joinTravelIds.includes(travelId))
// }

