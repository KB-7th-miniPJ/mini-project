<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExpense } from '@/hooks/useExpense'

const route        = useRoute()
const router       = useRouter()
const travelNumId  = route.params.id  

const {
  isLoading, categories, selectedCat,
  filtered, grouped, filteredTotal,
  loadExpenses, getCatInfo, editExpense, removeExpense
} = useExpense(travelNumId)

onMounted(() => loadExpenses())

const onDelete = async (id) => {
  if (!confirm('삭제할까요?')) return
  await removeExpense(id)
}

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
  <div v-if="isLoading">로딩 중...</div>
  <div v-else class="list-wrap">

    <!-- 헤더 -->
    <div class="list-hdr">
      <button class="back" @click="router.back()">←</button>
      <h2>지출 내역</h2>
    </div>

    <!-- 카테고리 탭 -->
    <div class="tab-row">
      <button
        :class="['tab', { active: selectedCat === '전체' }]"
        @click="selectedCat = '전체'"
      >전체</button>
      <button
        v-for="cat in categories" :key="cat.id"
        :class="['tab', { active: selectedCat === cat.id }]"
        @click="selectedCat = cat.id"
      >{{ cat.icon }} {{ cat.name }}</button>
    </div>

    <!-- 총 지출 -->
    <div class="total-bar">
      <span>총 지출</span>
      <strong>{{ filteredTotal.toLocaleString() }}원</strong>
    </div>

    <!-- 날짜별 그룹 -->
    <div v-for="(list, dateLabel) in grouped" :key="dateLabel" class="date-group">
      <p class="date-lbl">{{ dateLabel }}</p>
      <div v-for="e in list" :key="e.id" class="exp-row">
        <div class="exp-left">
          <strong>{{ e.place }}</strong>
          <div class="exp-meta">
            <span class="cat-chip">
              {{ getCatInfo(e.category).icon }} {{ getCatInfo(e.category).name }}
            </span>
            <span class="chip">{{ e.payerId }}번 결제</span>
            <span v-if="e.memo" class="chip">{{ e.memo }}</span>
          </div>
        </div>
        <div class="exp-right">
          <span class="exp-amt">{{ Number(e.amount).toLocaleString() }}원</span>
          <div class="exp-actions">
            <button class="btn-edit" @click="onEdit(e)">수정</button>
            <button class="btn-del"  @click="onDelete(e.id)">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-if="filtered.length === 0" class="empty">
      {{ selectedCat === '전체' ? '지출 내역이 없어요' : '해당 카테고리 지출이 없어요' }}
    </div>

  </div>
</template>

<style scoped>
.list-wrap { padding-bottom:40px; }
.list-hdr { display:flex; align-items:center; gap:12px; padding:14px 16px; border-bottom:1px solid #eee; position:sticky; top:0; background:white; z-index:10; }
.back { background:none; border:none; font-size:20px; cursor:pointer; }
.list-hdr h2 { font-size:16px; font-weight:600; }
.tab-row { display:flex; gap:6px; padding:10px 16px; overflow-x:auto; }
.tab-row::-webkit-scrollbar { display:none; }
.tab { flex-shrink:0; padding:6px 14px; border-radius:20px; border:1px solid #ddd; background:#f5f5f5; font-size:12px; cursor:pointer; }
.tab.active { background:#1D9E75; color:white; border-color:#1D9E75; }
.total-bar { display:flex; justify-content:space-between; padding:8px 16px; background:#f8f8f6; font-size:13px; }
.total-bar strong { font-size:14px; font-weight:600; }
.date-group { padding:0 16px; }
.date-lbl { font-size:12px; color:#888; font-weight:600; padding:10px 0 4px; }
.exp-row { display:flex; justify-content:space-between; align-items:flex-start; padding:12px 0; border-bottom:1px solid #f0f0f0; }
.exp-left { flex:1; display:flex; flex-direction:column; gap:4px; }
.exp-left strong { font-size:14px; font-weight:500; }
.exp-meta { display:flex; gap:5px; flex-wrap:wrap; }
.cat-chip { font-size:11px; padding:2px 7px; background:#E1F5EE; color:#0F6E56; border-radius:10px; }
.chip { font-size:11px; padding:2px 7px; background:#f0f0f0; color:#555; border-radius:10px; }
.exp-right { display:flex; flex-direction:column; align-items:flex-end; gap:6px; }
.exp-amt { font-size:15px; font-weight:600; }
.exp-actions { display:flex; gap:5px; }
.btn-edit { font-size:11px; padding:3px 10px; border:1px solid #1D9E75; color:#1D9E75; border-radius:6px; background:white; cursor:pointer; }
.btn-del { font-size:11px; padding:3px 10px; border:1px solid #E24B4A; color:#E24B4A; border-radius:6px; background:white; cursor:pointer; }
.empty { text-align:center; padding:40px; color:#aaa; font-size:14px; }
</style>