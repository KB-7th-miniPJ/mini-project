<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExpense } from '@/hooks/useExpense'

const route  = useRoute()
const router = useRouter()

// route.params.id = "1" (travels.id 숫자를 문자열로)
const travelNumId = route.params.id

const {
  travel, recentList, categories, isLoading,
  totalExpense, budgetLeft, perPerson, dDay, daysLeft, byCategory,
  loadDashboard, getCatInfo, editTravel
} = useExpense(travelNumId)

onMounted(() => loadDashboard())

// ── 예산 수정 모달 ──────────────────────────────
const showBudgetModal = ref(false)
const newBudget = ref(0)

const openBudgetModal = () => {
  newBudget.value = travel.value?.amount ?? 0
  showBudgetModal.value = true
}
const saveBudget = async () => {
  if (!newBudget.value || newBudget.value <= 0) return
  await editTravel({ amount: Number(newBudget.value) })
  showBudgetModal.value = false
}

// ── 날짜 수정 모달 ──────────────────────────────
const showDateModal = ref(false)
const newStart = ref('')
const newEnd   = ref('')

const openDateModal = () => {
  newStart.value = travel.value?.startDate ?? ''
  newEnd.value   = travel.value?.endDate   ?? ''
  showDateModal.value = true
}
const saveDate = async () => {
  if (!newStart.value || !newEnd.value) return
  if (newEnd.value < newStart.value) {
    alert('종료일은 시작일 이후여야 합니다.')
    return
  }
  await editTravel({ startDate: newStart.value, endDate: newEnd.value })
  showDateModal.value = false
}

// ── 이동 ────────────────────────────────────────
const goExpensesList = () =>
  router.push(`/travels/${travelNumId}/expenseslist`)

const goSettlement = () =>
  router.push(`/travels/${travelNumId}/settlement`)
</script>

<template>
  <div v-if="isLoading" class="loading">로딩 중...</div>
  <div v-else class="wrap">

    <!-- 헤더 -->
    <div class="header-green">
      <p class="sub">
        {{ travel?.title }} ·
        <!-- membersCount 사용 (membersId 배열 없음) -->
        {{ travel?.membersCount ?? 0 }}명
      </p>
      <h1 class="total">총 {{ totalExpense.toLocaleString() }}원 지출</h1>
    </div>

    <!-- 카드 3개 -->
    <div class="card-row">
      <div class="stat-card">
        <span class="lbl">예산잔여</span>
        <span class="val">{{ Math.round(budgetLeft / 10000) }}만</span>
      </div>
      <div class="stat-card clickable" @click="openBudgetModal">
        <span class="lbl">1인당</span>
        <span class="val">{{ Math.round(perPerson / 10000) }}만</span>
        <span class="hint">수정</span>
      </div>
      <div class="stat-card clickable" @click="openDateModal">
        <span class="lbl">D+{{ dDay }}</span>
        <span class="val" :style="{ color: daysLeft <= 1 ? '#E24B4A' : '' }">
          {{ daysLeft }}일남음
        </span>
        <span class="hint">수정</span>
      </div>
    </div>

    <!-- 카테고리 바 -->
    <section class="sec">
      <h3>카테고리별 지출</h3>
      <div v-for="cat in categories" :key="cat.id" class="bar-row">
        <span class="cat-name">{{ cat.icon }} {{ cat.name }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{
            width: totalExpense > 0
              ? ((byCategory[cat.id] ?? 0) / totalExpense * 100) + '%'
              : '0%'
          }"/>
        </div>
        <span class="bar-amt">
          {{ (byCategory[cat.id] ?? 0).toLocaleString() }}
        </span>
      </div>
    </section>

    <!-- 최근 지출 3건 -->
    <section class="sec">
      <h3>최근 지출</h3>
      <ul class="recent-list">
        <li v-for="e in recentList" :key="e.id" class="recent-item">
          <div>
            <p class="place">{{ e.place }}</p>
            <p class="meta">
              {{ getCatInfo(e.category).icon }}
              {{ getCatInfo(e.category).name }}
              · {{ e.payerId }}번 결제
            </p>
          </div>
          <span class="amt">{{ Number(e.amount).toLocaleString() }}원</span>
        </li>
      </ul>
    </section>

    <!-- 버튼 -->
    <div class="btn-area">
      <button class="btn-outline" @click="goExpensesList">
        지출 내역 전체보기
      </button>
      <button class="btn-primary" @click="goSettlement">
        정산하기
      </button>
    </div>

    <!-- 예산 수정 모달 -->
    <div v-if="showBudgetModal" class="modal-backdrop"
      @click.self="showBudgetModal = false">
      <div class="modal-box">
        <h3>총 예산 수정</h3>
        <p class="modal-cur">현재: {{ (travel?.amount ?? 0).toLocaleString() }}원</p>
        <input v-model.number="newBudget" type="number" placeholder="새 예산 입력" />
        <p class="modal-preview" v-if="newBudget > 0">
          <!-- membersCount 사용 -->
          {{ travel?.membersCount ?? 1 }}명 기준 →
          1인당 {{
            Math.round(newBudget / (travel?.membersCount || 1)).toLocaleString()
          }}원
        </p>
        <div class="modal-btns">
          <button @click="showBudgetModal = false">취소</button>
          <button class="btn-primary" @click="saveBudget">저장</button>
        </div>
      </div>
    </div>

    <!-- 날짜 수정 모달 -->
    <div v-if="showDateModal" class="modal-backdrop"
      @click.self="showDateModal = false">
      <div class="modal-box">
        <h3>여행 날짜 수정</h3>
        <label>출발일</label>
        <input v-model="newStart" type="date" />
        <label>귀국일</label>
        <input v-model="newEnd" type="date" :min="newStart" />
        <div class="modal-btns">
          <button @click="showDateModal = false">취소</button>
          <button class="btn-primary" @click="saveDate">저장</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.wrap { padding-bottom: 80px; }
.loading { text-align:center; padding:40px; color:#888; }
.header-green { background:#1D9E75; padding:20px 16px 24px; color:white; }
.sub { font-size:13px; opacity:.8; margin-bottom:4px; }
.total { font-size:24px; font-weight:600; }
.card-row { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; padding:12px 16px; }
.stat-card { background:#f8f8f6; border-radius:10px; padding:10px 8px; text-align:center; display:flex; flex-direction:column; gap:3px; }
.stat-card.clickable { cursor:pointer; border:1.5px solid #1D9E75; }
.lbl { font-size:11px; color:#888; }
.val { font-size:16px; font-weight:600; }
.hint { font-size:10px; color:#1D9E75; }
.sec { padding:0 16px 16px; }
.sec h3 { font-size:14px; font-weight:600; margin-bottom:10px; }
.bar-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.cat-name { font-size:12px; width:64px; flex-shrink:0; }
.bar-track { flex:1; height:8px; background:#eee; border-radius:4px; overflow:hidden; }
.bar-fill { height:100%; background:#1D9E75; border-radius:4px; transition:width .3s; }
.bar-amt { font-size:12px; color:#555; width:64px; text-align:right; }
.recent-list { list-style:none; }
.recent-item { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #f0f0f0; }
.place { font-size:13px; font-weight:500; }
.meta { font-size:11px; color:#888; margin-top:2px; }
.amt { font-size:14px; font-weight:600; }
.btn-area { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:430px; padding:12px 16px; background:white; display:flex; gap:8px; border-top:1px solid #eee; }
.btn-primary { flex:1; background:#1D9E75; color:white; border:none; border-radius:10px; padding:13px; font-size:14px; font-weight:600; cursor:pointer; }
.btn-outline { flex:1; background:white; color:#1D9E75; border:1.5px solid #1D9E75; border-radius:10px; padding:13px; font-size:14px; font-weight:600; cursor:pointer; }
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:flex-end; z-index:100; }
.modal-box { background:white; border-radius:16px 16px 0 0; padding:24px 20px; width:100%; max-width:430px; margin:0 auto; display:flex; flex-direction:column; gap:10px; }
.modal-box h3 { font-size:16px; font-weight:600; }
.modal-cur { font-size:12px; color:#888; }
.modal-preview { font-size:12px; color:#1D9E75; }
.modal-box input { border:1.5px solid #1D9E75; border-radius:8px; padding:10px 12px; font-size:14px; width:100%; }
.modal-box label { font-size:12px; color:#888; }
.modal-btns { display:flex; gap:8px; }
.modal-btns button { flex:1; padding:12px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; border:1px solid #ddd; background:#f5f5f5; }
</style>