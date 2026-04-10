import axios from "axios"

const BASE_URL = 'http://localhost:3000'

// 전체 유저 가져온 뒤 travelId로 필터링
export const getMembersByTravelId = async (travelId) => { 
  const res = await axios.get(`${BASE_URL}/users`) 
  return res.data.filter(user => {
    if (!user.joinTravelIds || !Array.isArray(user.joinTravelIds)) {
      return false
    }
    return user.joinTravelIds.includes(String(travelId))
  })
  
}