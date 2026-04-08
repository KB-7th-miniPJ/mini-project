<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExpense } from '@/hooks/useExpense'

const route    = useRoute()
const router   = useRouter()
const travelId = route.params.id  // "11"

const {
  isLoading,
  categories,
  selectedCat,
  filtered,
  grouped,
  filteredTotal,
  loadExpenses,
  getCatInfo,
  editExpense,
  removeExpense
} = useExpense(travelId)

onMounted(() => loadExpenses())

// 삭제
const onDelete = async (id) => {
  if (!confirm('삭제할까요?')) return
  await removeExpense(id) 
}

// 수정 모달 상태 (간단 버전 — 실제로는 별도 모달 컴포넌트 권장)
const onEdit = async (expense) => {
  const input = prompt(
    `금액 수정 (현재: ${Number(expense.amount).toLocaleString()}원)`,
    expense.amount
  )
  if (input === null || input === '') return
  await editExpense(expense.id, { amount: Number(input) })
}
</script>

<template>
  <div v-if="isLoading" class="loading">로딩 중...</div>

  <div v-else class="list-wrap">

    <!-- 헤더 -->
    <div class="list-header">
      <button class="back-btn" @click="router.back()">←</button>
      <h2>지출 내역</h2>
    </div>

    <!-- 카테고리 탭 -->
    <!-- categories: [{ id:"c1", name:"교통", icon:"🚌" }] -->
    <div class="tab-row">
      <button
        :class="['cat-tab', { active: selectedCat === '전체' }]"
        @click="selectedCat = '전체'"
      >전체</button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="['cat-tab', { active: selectedCat === cat.id }]"
        @click="selectedCat = cat.id"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>

    <!-- 필터된 총 지출 -->
    <div class="total-bar">
      <span>총 지출</span>
      <strong>{{ filteredTotal.toLocaleString() }}원</strong>
    </div>

    <!-- 날짜별 그룹 리스트 -->
    <!-- grouped: { "8월 1일": [{ id:1, place:"수산시장 횟집", ... }] } -->
    <div
      v-for="(list, dateLabel) in grouped"
      :key="dateLabel"
      class="date-group"
    >
      <p class="date-label">{{ dateLabel }}</p>

      <div
        v-for="e in list"
        :key="e.id"
        class="expense-row"
      >
        <!-- 왼쪽: 장소·카테고리·메모 -->
        <div class="exp-left">
          <!-- expenses.place = "수산시장 횟집" -->
          <strong class="exp-place">{{ e.place }}</strong>
          <div class="exp-meta">
            <!-- expenses.category = "c3" → getCatInfo → "식비 🍽" -->
            <span class="cat-chip">
              {{ getCatInfo(e.category).icon }}
              {{ getCatInfo(e.category).name }}
            </span>
            <!-- expenses.payerId = "3" -->
            <span class="payer-chip">{{ e.payerId }}번 결제</span>
            <!-- expenses.membersId = ["1","2","3","4"] -->
            <span class="member-chip">
              {{ e.membersId?.length ?? 0 }}명
            </span>
          </div>
          <!-- expenses.memo = "고등어회" -->
          <p v-if="e.memo" class="exp-memo">{{ e.memo }}</p>
        </div>

        <!-- 오른쪽: 금액·버튼 -->
        <div class="exp-right">
          <!-- expenses.amount = "35000" 문자열 → Number() 변환 -->
          <span class="exp-amount">
            {{ Number(e.amount).toLocaleString() }}원
          </span>
          <div class="exp-actions">
            <button class="btn-edit" @click="onEdit(e)">수정</button>
            <button class="btn-del"  @click="onDelete(e.id)">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-if="filtered.length === 0" class="empty-state">
      {{ selectedCat === '전체' ? '지출 내역이 없어요' : '해당 카테고리 지출이 없어요' }}
    </div>

  </div>
</template>

<style scoped>
.list-wrap { padding-bottom: 40px; }
.loading { text-align: center; padding: 40px; color: #888; }

/* 헤더 */
.list-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
  position: sticky; top: 0; background: white; z-index: 10;
}
.back-btn {
  background: none; border: none; font-size: 20px; cursor: pointer;
}
.list-header h2 { font-size: 16px; font-weight: 600; }

/* 탭 */
.tab-row {
  display: flex; gap: 6px; padding: 10px 16px;
  overflow-x: auto;
}
.tab-row::-webkit-scrollbar { display: none; }
.cat-tab {
  flex-shrink: 0;
  padding: 6px 14px; border-radius: 20px;
  border: 1px solid #ddd; background: #f5f5f5;
  font-size: 12px; cursor: pointer;
}
.cat-tab.active {
  background: #1D9E75; color: white; border-color: #1D9E75;
}

/* 합계 */
.total-bar {
  display: flex; justify-content: space-between;
  padding: 8px 16px; background: #f8f8f6;
  font-size: 13px;
}
.total-bar strong { font-size: 14px; font-weight: 600; }

/* 날짜 그룹 */
.date-group { padding: 0 16px; }
.date-label {
  font-size: 12px; color: #888; font-weight: 600;
  padding: 10px 0 4px;
}

/* 지출 항목 */
.expense-row {
  display: flex; justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.exp-left { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.exp-place { font-size: 14px; font-weight: 500; }
.exp-meta { display: flex; gap: 5px; flex-wrap: wrap; }
.cat-chip {
  font-size: 11px; padding: 2px 7px;
  background: #E1F5EE; color: #0F6E56;
  border-radius: 10px;
}
.payer-chip {
  font-size: 11px; padding: 2px 7px;
  background: #f0f0f0; color: #555; border-radius: 10px;
}
.member-chip {
  font-size: 11px; padding: 2px 7px;
  background: #f0f0f0; color: #555; border-radius: 10px;
}
.exp-memo { font-size: 12px; color: #999; }
.exp-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.exp-amount { font-size: 15px; font-weight: 600; }
.exp-actions { display: flex; gap: 5px; }
.btn-edit {
  font-size: 11px; padding: 3px 10px;
  border: 1px solid #1D9E75; color: #1D9E75;
  border-radius: 6px; background: white; cursor: pointer;
}
.btn-del {
  font-size: 11px; padding: 3px 10px;
  border: 1px solid #E24B4A; color: #E24B4A;
  border-radius: 6px; background: white; cursor: pointer;
}

/* 빈 상태 */
.empty-state {
  text-align: center; padding: 40px; color: #aaa; font-size: 14px;
}
</style>