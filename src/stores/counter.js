import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { getTravelList, createTravel, deleteTravel } from '@/api/main';

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
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (today < start) return '예정';
    if (today > end) return '완료';
    return '진행 중';
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

  return { state, filteredTravels, fetchTravels, addTravel, removeTravel };
});
