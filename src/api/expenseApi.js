import axios from "axios"

const BASE_URL = 'http://localhost:3000'

// 전체 유저 가져온 뒤 travelId로 필터링
export const getMembersByTravelId = async (travelId) => { 
  const res = await axios.get(`${BASE_URL}/users`) 
  return res.data.filter(user => user.joinTravelIds.includes(travelId)) 
  // get방식으로 가져온 데이터를 user라는 변수에 임시로 담아 travelId를 포함하는 joinTravelIds를 찾음
}



