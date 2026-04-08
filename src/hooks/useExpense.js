 
import { ref, computed } from 'vue'
import {
  getTravel,
  getExpensesByTravel,
  updateTravel,
  getRecentExpenses,
  getCategories
} from '@/api/main2Api'
import {
  getExpenses,
  updateExpense,
  deleteExpense
} from '@/api/expenseslistApi'

export function useExpense(travelId) {

  // ── 상태 ────────────────────────────────────────
  const travel      = ref(null)   // travels 단건 { id:"11", title, membersId, amount, ... }
  const expenses    = ref([])     // expenses 목록 [{ id:1, travelId:"11", amount:"35000", ... }]
  const recentList  = ref([])     // 최근 3건
  const categories  = ref([])    
  const selectedCat = ref('전체') // 탭 필터
  const isLoading   = ref(false)

  // ── 대시보드 로드 (Main2용) ──────────────────────
  const loadDashboard = async () => {
    isLoading.value = true
    try {
      const [travelRes, expRes, recentRes, catRes] = await Promise.all([
        getTravel(travelId),           
        getExpensesByTravel(travelId), 
        getRecentExpenses(travelId, 3),
        getCategories()
      ])
      travel.value     = travelRes.data
      expenses.value   = expRes.data
      recentList.value = recentRes.data
      categories.value = catRes.data
    } catch (e) {
      console.error('loadDashboard 오류:', e)
    } finally {
      isLoading.value = false
    }
  }

  // (Expenseslist용) ──────────────
  const loadExpenses = async () => {
    isLoading.value = true
    try {
      const [expRes, catRes] = await Promise.all([
        getExpenses(travelId),
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

  // ── 카테고리 정보 조회 헬퍼 ─────────────────────
  // getCatInfo("c3") → { id:"c3", name:"식비", icon:"🍽" }
  const getCatInfo = (catId) =>
    categories.value.find(c => c.id === catId) ?? { name: catId, icon: '📦' }

  // ── computed: 총 지출 ────────────────────────────
  // ※ expenses.amount = "35000" 문자열이라 Number() 변환 필수
  const totalExpense = computed(() =>
    expenses.value.reduce((sum, e) => sum + Number(e.amount), 0)
  )

  // ── computed: 예산 잔여 ──────────────────────────
  // travels.amount = 500000 숫자
  const budgetLeft = computed(() =>
    (travel.value?.amount ?? 0) - totalExpense.value
  )

  // ── computed: 1인당 금액 ─────────────────────────
  // travels.membersId = ["1","2","3","4"] 배열 길이 사용
  const perPerson = computed(() => {
    const n = travel.value?.membersId?.length ?? 1
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
  // { "c1": 0, "c2": 0, "c3": 35000, ... }
  const byCategory = computed(() =>
    expenses.value.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount)
      return acc
    }, {})
  )

  // ── computed: 탭 필터 (API 재호출 없이 프론트 처리) ──
  const filtered = computed(() =>
    selectedCat.value === '전체'
      ? expenses.value
      : expenses.value.filter(e => e.category === selectedCat.value)
  )

  // ── computed: 날짜별 그룹핑 ─────────────────────
  // { "8월 1일": [{...}], "8월 2일": [{...}] }
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

  // ── 여행 정보 수정 (예산·날짜) ──────────────────
  const editTravel = async (data) => {
    await updateTravel(travelId, data)
    travel.value = { ...travel.value, ...data } // 로컬 즉시 반영
  }

  // ── 지출 수정 ────────────────────────────────────
  // ※ expenses.id = 1 숫자 → String() 비교로 안전하게 처리
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

  return {
    // 상태
    travel, expenses, recentList, categories, selectedCat, isLoading,
    // 로드 함수
    loadDashboard, loadExpenses,
    // 헬퍼
    getCatInfo,
    // computed
    totalExpense, budgetLeft, perPerson, dDay, daysLeft,
    byCategory, filtered, grouped, filteredTotal,
    // 액션
    editTravel, editExpense, removeExpense
  }
}