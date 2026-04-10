import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { getTravelList, createTravel, deleteTravel, getTravelByInviteCode, updateTravelMembers, patchTravel } from '@/api/main';
import { patchUser } from '@/api/userApi';
import { useAuthStore } from '@/stores/auth';

export const useTravelStore = defineStore('travel', () => {
  const state = reactive({
    travels: [],
    activeFilters: ['예정', '진행 중', '완료'],
    showDomestic: true,
    showOverseas: true,
  });
 
  const getStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return '예정';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [ey, em, ed] = endDate.split('-').map(Number);
    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);
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
    const authStore = useAuthStore();
    const currentUser = authStore.user;
    const res = await getTravelList();
    const allTravels = res.data;

    if (!currentUser) {
      state.travels = [];
      return;
    }

    const joinedIds = Array.isArray(currentUser.joinTravelIds)
      ? currentUser.joinTravelIds.map(String)
      : [];

    state.travels = allTravels.filter(t => joinedIds.includes(String(t.id)));
  };
 
  const addTravel = async (travel) => {
    const res = await createTravel(travel);
    const created = res.data;

    if (created?.id) {
      await patchTravel(created.id, { travelId: `travel${created.id}` });

      const authStore = useAuthStore();
      const currentUser = authStore.user;
      if (currentUser) {
        const currentIds = Array.isArray(currentUser.joinTravelIds) ? currentUser.joinTravelIds : [];
        const updatedIds = [...currentIds, String(created.id)];
        authStore.setUser({ ...currentUser, joinTravelIds: updatedIds });
        try { await patchUser(currentUser.id, { joinTravelIds: updatedIds }); } catch {}
      }
    }

    await fetchTravels();
    return created;
  };
 
  const removeTravel = async (id) => {
    await deleteTravel(id);
    state.travels = state.travels.filter(t => t.id !== id);
    try { await fetchTravels(); } catch {}
  };

  const joinByInviteCode = async (code) => {
    const res = await getTravelByInviteCode(code);
    const list = res.data;
    if (!list || list.length === 0) return { success: false, message: '유효하지 않은 초대코드입니다.' };
    const travel = list[0];

    const authStore = useAuthStore();
    const currentUser = authStore.user;
    if (!currentUser) return { success: false, message: '로그인이 필요합니다.' };

    const currentIds = Array.isArray(currentUser.joinTravelIds) ? currentUser.joinTravelIds : [];
    const travelId = String(travel.id);
    if (currentIds.includes(travelId)) return { success: false, message: '이미 참가한 여행입니다.' };

    const updatedIds = [...currentIds, travelId];
    authStore.setUser({ ...currentUser, joinTravelIds: updatedIds });
    try { await patchUser(currentUser.id, { joinTravelIds: updatedIds }); } catch {}
    try { await updateTravelMembers(travel.id, (travel.membersCount || 0) + 1); } catch {}
    try { await fetchTravels(); } catch {}
    return { success: true, travel };
  };

  return { state, filteredTravels, fetchTravels, addTravel, removeTravel, joinByInviteCode };
});