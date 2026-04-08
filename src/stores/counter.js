import { defineStore } from 'pinia';
import { getTravelList, createTravel, deleteTravel } from '@/api/main';

export const useTravelStore = defineStore('travel', {
  state: () => ({
    travels: [],
    activeFilters: ['예정', '진행 중', '완료'],
    showDomestic: true,
    showOverseas: true,
  }),

  getters: {
    filteredTravels(state) {
      const domesticList = ['제주도', '부산', '강원도', '서울', '전라도', '경기도', '인천', '충청도'];
      return state.travels.filter((t) => {
        const matchStatus = state.activeFilters.includes(t.status);
        const domestic = domesticList.some((d) => t.destination.includes(d));
        const matchRegion = (state.showDomestic && domestic) || (state.showOverseas && !domestic);
        return matchStatus && matchRegion;
      });
    },
  },

  actions: {
    async fetchTravels() {
      const res = await getTravelList();
      this.travels = res.data;
    },
    async addTravel(travel) {
      await createTravel(travel);
      await this.fetchTravels();
    },
    async removeTravel(id) {
      await deleteTravel(id);
      await this.fetchTravels();
    },
  },
});
