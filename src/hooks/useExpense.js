import { ref, computed } from 'vue'
import {
  getTravel,
  getExpensesByTravelId,
  updateTravel,
  getRecentExpenses,
  getCategories
} from '@/api/main2Api'
import {
  getExpenses,
  updateExpense,
  deleteExpense
} from '@/api/expenseslistApi'

export function useExpense(travelNumId) {
  // travelNumId = route.params.id = "1" (문자열로 옴)

  const travel      = ref(null)
  const expenses    = ref([])
  const recentList  = ref([])
  const categories  = ref([])
  const selectedCat = ref('전체')
  const isLoading   = ref(false)

  // ── 대시보드 로드 ────────────────────────────────
  // 핵심: travels.id(숫자) → travels.travelId 추출 → expenses 조회
  const loadDashboard = async () => {
    isLoading.value = true
    try {
      // 1단계: travels.id = 1 로 여행 조회
      const travelRes = await getTravel(travelNumId)
      travel.value = travelRes.data
      // travel.value = { id:1, travelId:"travel1", title:"여름 바다 여행",
      //                  membersCount:4, amount:500000, ... }

      // 2단계: travelId 추출해서 expenses 조회
      const tid = travel.value.travelId  // "travel1"

      const [expRes, recentRes, catRes] = await Promise.all([
        getExpensesByTravelId(tid),   // GET /expenses?travelId=travel1
        getRecentExpenses(tid, 3),
        getCategories()
      ])
      expenses.value   = expRes.data
      recentList.value = recentRes.data
      categories.value = catRes.data
    } catch (e) {
      console.error('loadDashboard 오류:', e)
    } finally {
      isLoading.value = false
    }
  }

  // ── 지출목록 로드 ────────────────────────────────
  const loadExpenses = async () => {
    isLoading.value = true
    try {
      // 마찬가지로 2단계
      const travelRes = await getTravel(travelNumId)
      travel.value = travelRes.data
      const tid = travel.value.travelId  // "travel1"

      const [expRes, catRes] = await Promise.all([
        getExpenses(tid),
        getCategories()
      ])
      expenses.value   = expRes.data
      categories.value = catRes.data
    } catch (e) {
      console.error('loadExpenses 오류:', e)
    } finally {
      isLoading.value = false
    }
  }

  // ── 카테고리 정보 ─────────────────────────────────
  // getCatInfo("c3") → { id:"c3", name:"식비", icon:"🍽" }
  const getCatInfo = (catId) =>
    categories.value.find(c => c.id === catId) ?? { name: catId, icon: '📦' }

  // ── computed: 총 지출 ────────────────────────────
  // expenses.amount = 35000 숫자 ✅ → Number() 불필요하지만 안전하게 유지
  const totalExpense = computed(() =>
    expenses.value.reduce((sum, e) => sum + Number(e.amount), 0)
  )

  // ── computed: 예산 잔여 ──────────────────────────
  // travels.amount = 500000
  const budgetLeft = computed(() =>
    (travel.value?.amount ?? 0) - totalExpense.value
  )

  // ── computed: 1인당 ──────────────────────────────
  // travels.membersCount = 4 (숫자, membersId 배열 없음!)
  const perPerson = computed(() => {
    const n = travel.value?.membersCount ?? 1
    return n > 0 ? Math.round(totalExpense.value / n) : 0
  })

  // ── computed: D+day ──────────────────────────────
  const dDay = computed(() => {
    if (!travel.value?.startDate) return 0
    const diff = new Date() - new Date(travel.value.startDate)
    return Math.max(0, Math.floor(diff / 86400000))
  })

  // ── computed: 남은 일수 ──────────────────────────
  const daysLeft = computed(() => {
    if (!travel.value?.endDate) return 0
    const diff = new Date(travel.value.endDate) - new Date()
    return Math.max(0, Math.ceil(diff / 86400000))
  })

  // ── computed: 카테고리별 합산 ────────────────────
  const byCategory = computed(() =>
    expenses.value.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount)
      return acc
    }, {})
  )

  // ── computed: 탭 필터 ────────────────────────────
  const filtered = computed(() =>
    selectedCat.value === '전체'
      ? expenses.value
      : expenses.value.filter(e => e.category === selectedCat.value)
  )

  // ── computed: 날짜별 그룹핑 ─────────────────────
  const grouped = computed(() => {
    const map = {}
    ;[...filtered.value]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(e => {
        const label = new Date(e.date)
          .toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
        if (!map[label]) map[label] = []
        map[label].push(e)
      })
    return map
  })

  // ── computed: 필터된 총 지출 ────────────────────
  const filteredTotal = computed(() =>
    filtered.value.reduce((sum, e) => sum + Number(e.amount), 0)
  )

  // ── 여행 정보 수정 ───────────────────────────────
  const editTravel = async (data) => {
    await updateTravel(travelNumId, data)
    travel.value = { ...travel.value, ...data }
  }

  // ── 지출 수정 ────────────────────────────────────
  // expenses.id = 1 숫자 → String() 으로 안전하게 비교
  const editExpense = async (expenseId, data) => {
    await updateExpense(expenseId, data)
    const idx = expenses.value.findIndex(
      e => String(e.id) === String(expenseId)
    )
    if (idx !== -1) {
      expenses.value[idx] = { ...expenses.value[idx], ...data }
    }
  }

  // ── 지출 삭제 ────────────────────────────────────
  const removeExpense = async (expenseId) => {
    await deleteExpense(expenseId)
    expenses.value = expenses.value.filter(
      e => String(e.id) !== String(expenseId)
    )
  }
// --- 메모 모달(토글) ---
const isModalOpen = ref(false)      // 모달 열림/닫힘 상태
  const selectedMemo = ref('')

const openMemoModal = (memo) => {
    selectedMemo.value = memo
    isModalOpen.value = true
  }

const closeModal = () => {
    isModalOpen.value = false
    selectedMemo.value = ''
  }

const toggleMemoModal = (memo) => {
  if (isModalOpen.value && selectedMemo.value === memo) {
    isModalOpen.value = false
    selectedMemo.value = ''
  } else {
    selectedMemo.value = memo
    isModalOpen.value = true
  }
}


  return {
    travel, expenses, recentList, categories, selectedCat, isLoading,
    loadDashboard, loadExpenses,
    getCatInfo,
    totalExpense, budgetLeft, perPerson, dDay, daysLeft,
    byCategory, filtered, grouped, filteredTotal,
    editTravel, editExpense, removeExpense,
    isModalOpen, selectedMemo, toggleMemoModal, closeModal
  }
}