import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import {
  getTravelList,
  createTravel,
  deleteTravel,
  getTravelByInviteCode,
  updateTravelMembers,
} from '@/api/main';
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
      .map((t) => ({ ...t, status: getStatus(t.startDate, t.endDate) }))
      .filter((t) => {
        const matchStatus = state.activeFilters.includes(t.status);
        const type = t.travelType;
        const matchRegion =
          !type ||
          (state.showDomestic && type === '국내') ||
          (state.showOverseas && type === '해외');
        return matchStatus && matchRegion;
      });
  });

  const fetchTravels = async () => {
    const res = await getTravelList();
    state.travels = res.data;
  };

  // ✅ 수정: 생성된 객체 반환 + travelId 자동 생성해서 저장
  const addTravel = async (travel) => {
    // 1단계: POST /travels → json-server가 id 자동 부여 (예: id=5)
    const res = await createTravel(travel);
    const created = res.data; // { id: 5, title: "...", ... }

    // 2단계: id 기반으로 travelId 생성 → PATCH /travels/5
    // "travel" + 5 = "travel5"
    if (created?.id) {
      await patchTravel(created.id, { travelId: `travel${created.id}` });
    }

    // 3단계: 목록 갱신
    await fetchTravels();

    return created; // ✅ 생성된 객체 반환 (id 포함)
  };

  const removeTravel = async (id) => {
    await deleteTravel(id);
    await fetchTravels();
  };

  const joinByInviteCode = async (code) => {
    const res = await getTravelByInviteCode(code);
    const list = res.data;
    if (!list || list.length === 0)
      return { success: false, message: '유효하지 않은 초대코드입니다.' };
    const travel = list[0];

    const authStore = useAuthStore();
    const currentUser = authStore.user;
    if (!currentUser)
      return { success: false, message: '로그인이 필요합니다.' };

    const currentIds = Array.isArray(currentUser.joinTravelIds)
      ? currentUser.joinTravelIds
      : [];
    const travelId = String(travel.id);
    if (currentIds.includes(travelId))
      return { success: false, message: '이미 참가한 여행입니다.' };

    const updatedIds = [...currentIds, travelId];
    await patchUser(currentUser.id, { joinTravelIds: updatedIds });
    authStore.setUser({ ...currentUser, joinTravelIds: updatedIds });

    await updateTravelMembers(travel.id, travel.membersCount + 1);
    await fetchTravels();
    return { success: true, travel };
  };

  return {
    state,
    filteredTravels,
    fetchTravels,
    addTravel,
    removeTravel,
    joinByInviteCode,
  };
});
