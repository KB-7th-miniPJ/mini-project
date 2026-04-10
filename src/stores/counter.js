import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { getTravelList, createTravel, deleteTravel, getTravelByInviteCode, TravelMembers } from '@/api/main';

export const useTravelStore = defineStore('travel', () => {
  const state = reactive({
    travels: [],
    activeFilters: ['예정', '진행 중', '완료'],
    showDomestic: true,
    showOverseas: true,
  });

  const getStatus = (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [ey, em, ed] = endDate.split('-').map(Number);
    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);
    if (today < start) return '예정';
    if (today > end) return '완료';
    if (start <= today && today <= end) return '진행 중';
  };

  const filteredTravels = computed(() => {
    return state.travels
      .map(t => ({ ...t, status: getStatus(t.startDate, t.endDate) }))
      .filter(t => {
        const matchStatus = state.activeFilters.includes(t.status);
        const type = t.travelType;
        const matchRegion = !type ||
          (state.showDomestic && type === '국내') ||
          (state.showOverseas && type === '해외');
        return matchStatus && matchRegion;
      });
  });

  const fetchTravels = async () => {
    const res = await getTravelList();
    state.travels = res.data;
  };

  const addTravel = async (travel) => {
    await createTravel(travel);
    await fetchTravels();
  };

  const removeTravel = async (id) => {
    await deleteTravel(id);
    await fetchTravels();
  };

  // 초대코드로 여행 참가 - membersCount +1
  const joinByInviteCode = async (code) => {
    const res = await getTravelByInviteCode(code);
    const list = res.data;
    if (!list || list.length === 0) return { success: false, message: '유효하지 않은 초대코드입니다.' };
    const travel = list[0];
    await TravelMembers(travel.id, travel.membersCount + 1);
    await fetchTravels();
    return { success: true, travel };
  };

  return { state, filteredTravels, fetchTravels, addTravel, removeTravel, joinByInviteCode };
});