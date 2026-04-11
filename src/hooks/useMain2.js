import { ref, computed } from "vue";
import {
  getTravel,
  getExpensesByTravelId,
  updateTravel,
  getRecentExpenses,
  getCategories,
} from "@/api/main2Api";
import {
  getExpenses,
  updateExpense,
  deleteExpense,
} from "@/api/expenseslistApi";

export function useExpense(travelNumId) {
  // travelNumId = route.params.id = "1" (문자열로 옴)

  const travel = ref(null);
  const expenses = ref([]);
  const recentList = ref([]);
  const categories = ref([]);
  const selectedCat = ref("전체");
  const isLoading = ref(false);

  // ── 대시보드 로드 ────────────────────────────────
  const loadDashboard = async () => {
    isLoading.value = true;
    try {
      // 1단계: travels.id 로 여행 조회
      const travelRes = await getTravel(travelNumId);
      travel.value = travelRes.data;

      const tid = travel.value.id;

      const [expRes, recentRes, catRes] = await Promise.all([
        getExpensesByTravelId(tid),
        getRecentExpenses(tid, 3),
        getCategories(),
      ]);
      expenses.value = expRes.data;
      recentList.value = recentRes.data;
      categories.value = catRes.data;
    } catch (e) {
      console.error("loadDashboard 오류:", e);
    } finally {
      isLoading.value = false;
    }
  };

  // ── 지출목록 로드 ────────────────────────────────
  const loadExpenses = async () => {
    isLoading.value = true;
    try {
      const travelRes = await getTravel(travelNumId);
      travel.value = travelRes.data;
      const tid = travel.value.id;

      const [expRes, catRes] = await Promise.all([
        getExpenses(tid),
        getCategories(),
      ]);
      expenses.value = expRes.data;
      categories.value = catRes.data;
    } catch (e) {
      console.error("loadExpenses 오류:", e);
    } finally {
      isLoading.value = false;
    }
  };

  // ── 카테고리 정보 ─────────────────────────────────
  const getCatInfo = (catId) =>
    categories.value.find((c) => c.id === catId) ?? { name: catId, icon: "📦" };

  // ── computed: 총 지출 ────────────────────────────
  const totalExpense = computed(() =>
    expenses.value.reduce((sum, e) => sum + Number(e.amount), 0)
  );

  // ── computed: 예산 잔여 ──────────────────────────
  // travels.amount = 예산 총액
  const budgetLeft = computed(
    () => (travel.value?.amount ?? 0) - totalExpense.value
  );

  // ── computed: 1인당 예산 ─────────────────────────
  // 예산 총액 ÷ 인원수 (지출과 무관, 처음부터 정해진 1인당 예산)
  const perPerson = computed(() => {
    const totalBudget = travel.value?.amount ?? 0;
    const n = travel.value?.membersCount ?? 1;
    return n > 0 ? Math.round(totalBudget / n) : 0;
  });

  // ── computed: 1인당 지출 ─────────────────────────
  // 실제 총 지출 ÷ 인원수 (현재까지 쓴 돈 기준)
  const perPersonExpense = computed(() => {
    const n = travel.value?.membersCount ?? 1;
    return n > 0 ? Math.round(totalExpense.value / n) : 0;
  });

  // ── computed: D+day ──────────────────────────────
  const dDay = computed(() => {
    if (!travel.value?.startDate) return 0;
    const diff = new Date() - new Date(travel.value.startDate);
    return Math.max(0, Math.floor(diff / 86400000));
  });

  // ── computed: 남은 일수 ──────────────────────────
  const daysLeft = computed(() => {
    if (!travel.value?.endDate) return 0;
    const diff = new Date(travel.value.endDate) - new Date();
    return Math.max(0, Math.ceil(diff / 86400000));
  });

  // ── computed: 정산 확정 여부 ─────────────────────
  const isConfirmed = computed(() => {
    if (!travel.value?.endDate) return false;
    const confirmDate = new Date(travel.value.endDate);
    confirmDate.setDate(confirmDate.getDate() + 2);
    return new Date() > confirmDate;
  });

  // ── computed: 카테고리별 합산 ────────────────────
  const byCategory = computed(() =>
    expenses.value.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount);
      return acc;
    }, {})
  );

  // ── computed: 탭 필터 ────────────────────────────
  const filtered = computed(() =>
    selectedCat.value === "전체"
      ? expenses.value
      : expenses.value.filter((e) => e.category === selectedCat.value)
  );

  // ── computed: 날짜별 그룹핑 ─────────────────────
  const grouped = computed(() => {
    const map = {};
    [...filtered.value]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((e) => {
        const label = new Date(e.date).toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
        });
        if (!map[label]) map[label] = [];
        map[label].push(e);
      });
    return map;
  });

  // ── computed: 필터된 총 지출 ────────────────────
  const filteredTotal = computed(() =>
    filtered.value.reduce((sum, e) => sum + Number(e.amount), 0)
  );

  // ── 여행 정보 수정 ───────────────────────────────
  const editTravel = async (data) => {
    await updateTravel(travelNumId, data);
    travel.value = { ...travel.value, ...data };
  };

  // ── 지출 수정 ────────────────────────────────────
  const editExpense = async (expenseId, data) => {
    await updateExpense(expenseId, data);
    const idx = expenses.value.findIndex(
      (e) => String(e.id) === String(expenseId)
    );
    if (idx !== -1) {
      expenses.value[idx] = { ...expenses.value[idx], ...data };
    }
  };

  // ── 지출 삭제 ────────────────────────────────────
  const removeExpense = async (expenseId) => {
    await deleteExpense(expenseId);
    expenses.value = expenses.value.filter(
      (e) => String(e.id) !== String(expenseId)
    );
  };

  // ── 메모 모달 ────────────────────────────────────
  const isModalOpen = ref(false);
  const selectedMemo = ref("");

  const closeModal = () => {
    isModalOpen.value = false;
    selectedMemo.value = "";
  };

  const toggleMemoModal = (memo) => {
    if (isModalOpen.value && selectedMemo.value === memo) {
      isModalOpen.value = false;
      selectedMemo.value = "";
    } else {
      selectedMemo.value = memo;
      isModalOpen.value = true;
    }
  };

  // ── 사진 모달 ────────────────────────────────────
  const isPhotoModalOpen = ref(false);
  const selectedPhoto = ref("");

  const togglePhotoModal = (url) => {
    if (isPhotoModalOpen.value && selectedPhoto.value === url) {
      isPhotoModalOpen.value = false;
      selectedPhoto.value = "";
    } else {
      selectedPhoto.value = url;
      isPhotoModalOpen.value = true;
    }
  };

  const closePhotoModal = () => {
    isPhotoModalOpen.value = false;
    selectedPhoto.value = "";
  };

  return {
    travel,
    expenses,
    recentList,
    categories,
    selectedCat,
    isLoading,
    loadDashboard,
    loadExpenses,
    getCatInfo,
    totalExpense,
    budgetLeft,
    perPerson,
    perPersonExpense,
    dDay,
    daysLeft,
    isConfirmed,
    byCategory,
    filtered,
    grouped,
    filteredTotal,
    editTravel,
    editExpense,
    removeExpense,
    isModalOpen,
    selectedMemo,
    toggleMemoModal,
    closeModal,
    isPhotoModalOpen,
    selectedPhoto,
    togglePhotoModal,
    closePhotoModal,
  };
}
