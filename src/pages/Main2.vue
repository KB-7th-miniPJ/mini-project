<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExpense } from '@/hooks/useExpense'

const route    = useRoute()
const router   = useRouter()

const travelId = route.params.id

const {
  travel, recentList, categories, isLoading,
  totalExpense, budgetLeft, perPerson, dDay, daysLeft, byCategory,
  loadDashboard, getCatInfo, editTravel
} = useExpense(travelId)

// 진입 시 데이터 로드
onMounted(() => loadDashboard())

// ── 예산 수정 모달 ──────────────────────────────
const showBudgetModal = ref(false)
const newBudget       = ref(0)

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
const newStart      = ref('')
const newEnd        = ref('')

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

// ── 페이지 이동 ─────────────────────────────────
const goExpensesList = () =>
  router.push(`/travels/${travelId}/expenseslist`)

const goSettlement = () =>
  router.push(`/travels/${travelId}/settlement`)
</script>

<template>
  <div v-if="isLoading" class="loading">로딩 중...</div>

  <div v-else class="main2-wrap">

    <!-- ① 헤더: travels.title, membersId.length, 총 지출 -->
    <div class="header-green">
      <p class="sub-title">
        {{ travel?.title }} ·
        {{ travel?.membersId?.length ?? 0 }}명
      </p>
      <h1 class="total-amount">
        총 {{ totalExpense.toLocaleString() }}원 지출
      </h1>
    </div>

    <!-- ② 카드 3개 -->
    <div class="card-row">

      <!-- 예산잔여: travels.amount - 총지출 -->
      <div class="stat-card">
        <span class="card-label">예산잔여</span>
        <span class="card-value">
          {{ Math.round(budgetLeft / 10000) }}만
        </span>
      </div>

      <!-- 1인당: 클릭 시 예산 수정 -->
      <div class="stat-card clickable" @click="openBudgetModal">
        <span class="card-label">1인당</span>
        <span class="card-value">
          {{ Math.round(perPerson / 10000) }}만
        </span>
        <span class="edit-hint">탭해서 수정</span>
      </div>

      <!-- D+day: 클릭 시 날짜 수정 -->
      <div class="stat-card clickable" @click="openDateModal">
        <span class="card-label">D+{{ dDay }}</span>
        <span
          class="card-value"
          :style="{ color: daysLeft <= 1 ? '#E24B4A' : '' }"
        >
          {{ daysLeft }}일남음
        </span>
        <span class="edit-hint">탭해서 수정</span>
      </div>

    </div>

    <!-- ③ 카테고리별 지출 바 -->
    <!-- categories: [{ id:"c1", name:"교통", icon:"🚌" }] -->
    <!-- byCategory: { "c3": 35000, ... } -->
    <section class="category-section">
      <h3>카테고리별 지출</h3>
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bar-row"
      >
        <span class="cat-icon-name">{{ cat.icon }} {{ cat.name }}</span>
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{
              width: totalExpense > 0
                ? ((byCategory[cat.id] ?? 0) / totalExpense * 100) + '%'
                : '0%'
            }"
          />
        </div>
        <span class="bar-amount">
          {{ (byCategory[cat.id] ?? 0).toLocaleString() }}
        </span>
      </div>
    </section>

    <!-- ④ 최근 지출 3건 -->
    <!-- expenses: { id:1, place:"수산시장 횟집", category:"c3",
                     amount:"35000"(문자열), payerId:"3" } -->
    <section class="recent-section">
      <h3>최근 지출</h3>
      <ul class="recent-list">
        <li
          v-for="e in recentList"
          :key="e.id"
          class="recent-item"
        >
          <div class="recent-info">
            <span class="recent-place">{{ e.place }}</span>
            <span class="recent-meta">
              {{ getCatInfo(e.category).icon }}
              {{ getCatInfo(e.category).name }}
              · {{ e.payerId }}번 결제
            </span>
          </div>
          <!-- Number()로 문자열 amount 변환 -->
          <span class="recent-amount">
            {{ Number(e.amount).toLocaleString() }}원
          </span>
        </li>
      </ul>
    </section>

    <!-- ⑤ 하단 버튼 -->
    <div class="btn-area">
      <button class="btn-outline" @click="goExpensesList">
        지출 내역 전체보기
      </button>
      <button class="btn-primary" @click="goSettlement">
        정산하기
      </button>
    </div>

    <!-- 예산 수정 모달 -->
    <div
      v-if="showBudgetModal"
      class="modal-backdrop"
      @click.self="showBudgetModal = false"
    >
      <div class="modal-box">
        <h3>총 예산 수정</h3>
        <p class="modal-current">
          현재: {{ (travel?.amount ?? 0).toLocaleString() }}원
        </p>
        <input
          v-model.number="newBudget"
          type="number"
          placeholder="새 예산 입력"
          min="0"
        />
        <p class="modal-preview" v-if="newBudget > 0">
          {{ travel?.membersId?.length ?? 1 }}명 기준 →
          1인당
          {{
            Math.round(
              newBudget / (travel?.membersId?.length ?? 1)
            ).toLocaleString()
          }}원
        </p>
        <div class="modal-btns">
          <button @click="showBudgetModal = false">취소</button>
          <button class="btn-primary" @click="saveBudget">저장</button>
        </div>
      </div>
    </div>

    <!-- 날짜 수정 모달 -->
    <div
      v-if="showDateModal"
      class="modal-backdrop"
      @click.self="showDateModal = false"
    >
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
.main2-wrap { padding-bottom: 80px; }
.loading { text-align: center; padding: 40px; color: #888; }

/* 헤더 */
.header-green {
  background: #1D9E75;
  padding: 20px 16px 24px;
  color: white;
}
.sub-title { font-size: 13px; opacity: .8; margin-bottom: 4px; }
.total-amount { font-size: 24px; font-weight: 600; }

/* 카드 3개 */
.card-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px 16px;
}
.stat-card {
  background: #f8f8f6;
  border-radius: 10px;
  padding: 10px 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.stat-card.clickable { cursor: pointer; border: 1.5px solid #1D9E75; }
.card-label { font-size: 11px; color: #888; }
.card-value { font-size: 16px; font-weight: 600; color: #1a1a1a; }
.edit-hint { font-size: 10px; color: #1D9E75; }

/* 카테고리 바 */
.category-section { padding: 0 16px 16px; }
.category-section h3 { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.cat-icon-name { font-size: 12px; width: 60px; flex-shrink: 0; }
.bar-track {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill { height: 100%; background: #1D9E75; border-radius: 4px; transition: width .3s; }
.bar-amount { font-size: 12px; color: #555; width: 60px; text-align: right; }

/* 최근 지출 */
.recent-section { padding: 0 16px 16px; }
.recent-section h3 { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
.recent-list { list-style: none; display: flex; flex-direction: column; gap: 0; }
.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
.recent-info { display: flex; flex-direction: column; gap: 2px; }
.recent-place { font-size: 13px; font-weight: 500; }
.recent-meta { font-size: 11px; color: #888; }
.recent-amount { font-size: 14px; font-weight: 600; }

/* 버튼 */
.btn-area {
  position: fixed;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 100%; max-width: 430px;
  padding: 12px 16px;
  background: white;
  display: flex; gap: 8px;
  border-top: 1px solid #eee;
}
.btn-primary {
  flex: 1; background: #1D9E75; color: white;
  border: none; border-radius: 10px;
  padding: 13px; font-size: 14px; font-weight: 600;
  cursor: pointer;
}
.btn-outline {
  flex: 1; background: white; color: #1D9E75;
  border: 1.5px solid #1D9E75; border-radius: 10px;
  padding: 13px; font-size: 14px; font-weight: 600;
  cursor: pointer;
}

/* 모달 */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: flex-end;
  z-index: 100;
}
.modal-box {
  background: white;
  border-radius: 16px 16px 0 0;
  padding: 24px 20px;
  width: 100%; max-width: 430px;
  margin: 0 auto;
  display: flex; flex-direction: column; gap: 10px;
}
.modal-box h3 { font-size: 16px; font-weight: 600; }
.modal-current { font-size: 12px; color: #888; }
.modal-preview { font-size: 12px; color: #1D9E75; }
.modal-box input {
  border: 1.5px solid #1D9E75; border-radius: 8px;
  padding: 10px 12px; font-size: 14px; width: 100%;
}
.modal-box label { font-size: 12px; color: #888; }
.modal-btns { display: flex; gap: 8px; margin-top: 4px; }
.modal-btns button {
  flex: 1; padding: 12px; border-radius: 8px;
  font-size: 14px; font-weight: 500; cursor: pointer;
  border: 1px solid #ddd; background: #f5f5f5;
}
</style>