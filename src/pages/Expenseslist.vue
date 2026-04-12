<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useExpense } from '@/hooks/useMain2';

const route = useRoute();
const router = useRouter();
const travelNumId = route.params.travelId;

const {
  isLoading,
  isConfirmed,
  categories,
  selectedCat,
  filtered,
  grouped,
  filteredTotal,
  loadExpenses,
  getCatInfo,
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
} = useExpense(travelNumId);

onMounted(() => loadExpenses());

const onDelete = async (id) => {
  if (isConfirmed.value) return alert('정산이 확정된 여행은 삭제할 수 없습니다.');
  if (!confirm('삭제할까요?')) return;
  await removeExpense(id);
};

const onEdit = (expenseId) => {
  router.push({
    name: 'ExpenseEdit',
    params: { 
      travelId: props.travelId, // props에서 가져온 여행 ID
      id: expenseId            // 클릭한 지출 항목의 ID
    }
  });
};

const props = defineProps(['expenses, travelId']);
const users = ref([]);

</script>

<template>
  <div v-if="isLoading">로딩 중...</div>
  <div v-else class="list-wrap">
    <!-- 헤더 -->
    <div class="list-hdr">
      <RouterLink :to="`/travels/${travelNumId}`" class="back">‹</RouterLink>
      <h2>지출 내역</h2>
    </div>

    <!-- 카테고리 탭 -->
    <div class="tab-row">
      <button
        :class="['tab', { active: selectedCat === '전체' }]"
        @click="selectedCat = '전체'"
      >
        전체
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="['tab', { active: selectedCat === cat.name }]"
        @click="selectedCat = cat.name"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>

    <!-- 총 지출 -->
    <div class="total-bar">
      <span>총 지출</span>
      <strong>{{ filteredTotal.toLocaleString() }}원</strong>
    </div>

    <!-- 날짜별 그룹 -->
    <div
      v-for="(list, dateLabel) in grouped"
      :key="dateLabel"
      class="date-group"
    >
      <p class="date-lbl">{{ dateLabel }}</p>
      <div v-for="e in list" :key="e.id" class="exp-row">
        <div class="exp-left">
          <strong>{{ e.place }}</strong>
          <div class="exp-meta">
            <span class="cat-chip">
              {{ getCatInfo(e.category).icon }}
              {{ getCatInfo(e.category).name }}
            </span>
            <span class="chip">{{ (e.payer).name }}결제/{{ e.participants.length }}명</span>

            <!-- 메모 아이콘 -->
            <span
              v-if="e.memo"
              class="memo-icon"
              :class="{ active: isModalOpen && selectedMemo === e.memo }"
              @click="toggleMemoModal(e.memo)"
            >
              📝
            </span>

            <!-- 사진 아이콘 -->
            <span
              v-if="e.photos"
              class="photo-icon"
              :class="{
                active: isPhotoModalOpen && selectedPhoto === e.photos,
              }"
              @click="togglePhotoModal(e.photos)"
            >
              📷
            </span>
          </div>
        </div>

        <div class="exp-right">
          <span class="exp-amt">{{ Number(e.amount).toLocaleString() }}원</span>
          <div class="exp-actions">
            <button class="btn-edit" @click="onEdit(e.id)">수정</button>
            <button class="btn-del" @click="onDelete(e.id)">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-if="filtered.length === 0" class="empty">
      {{
        selectedCat === '전체'
          ? '지출 내역이 없어요'
          : '해당 카테고리 지출이 없어요'
      }}
    </div>

    <!-- 메모 모달 (list-wrap 밖으로 빼야 fixed가 제대로 동작) -->
  </div>

  <!-- ✅ 모달을 최상위로 이동 — v-if 안에서 fixed가 잘리는 문제 해결 -->
  <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3>📝 메모 내용</h3>
      <p class="memo-text">{{ selectedMemo }}</p>
      <button class="modal-close-btn" @click="closeModal">닫기</button>
    </div>
  </div>

  <div
    v-if="isPhotoModalOpen"
    class="modal-overlay"
    @click.self="closePhotoModal"
  >
    <div class="modal-content photo-box">
      <h3>📸 첨부 사진</h3>
      <img :src="selectedPhoto" class="preview-img" alt="영수증/사진" />
      <button class="modal-close-btn" @click="closePhotoModal">닫기</button>
    </div>
  </div>
</template>

<style scoped>
.list-wrap {
  padding-bottom: 40px;
}
.list-hdr {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
.back-icon {
  position: absolute;
  left: 20px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #374151;
}
.list-hdr h2 {
  font-size: 16px;
  font-weight: 600;
}
.tab-row {
  display: flex;
  gap: 6px;
  padding: 10px 16px;
  overflow-x: auto;
}
.tab-row::-webkit-scrollbar {
  display: none;
}
.tab {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  font-size: 12px;
  cursor: pointer;
}
.tab.active {
  background: #22c55e;
  color: white;
  border-color: #22c55e;
}
.total-bar {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background: #f8f8f6;
  font-size: 13px;
}
.total-bar strong {
  font-size: 14px;
  font-weight: 600;
}
.date-group {
  padding: 0 16px;
}
.date-lbl {
  font-size: 12px;
  color: #888;
  font-weight: 600;
  padding: 10px 0 4px;
}
.exp-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.exp-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.exp-left strong {
  font-size: 14px;
  font-weight: 500;
}
.exp-meta {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  align-items: center;
}
.cat-chip {
  font-size: 11px;
  padding: 2px 7px;
  background: #e1f5ee;
  color: #0f6e56;
  border-radius: 10px;
}
.chip {
  font-size: 11px;
  padding: 2px 7px;
  background: #f0f0f0;
  color: #555;
  border-radius: 10px;
}
.exp-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}
.exp-amt {
  font-size: 15px;
  font-weight: 600;
}
.exp-actions {
  display: flex;
  gap: 5px;
}
.btn-edit {
  font-size: 11px;
  padding: 3px 10px;
  border: 1px solid #22c55e;
  color: #22c55e;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}
.btn-del {
  font-size: 11px;
  padding: 3px 10px;
  border: 1px solid #e24b4a;
  color: #e24b4a;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}
.empty {
  text-align: center;
  padding: 40px;
  color: #aaa;
  font-size: 14px;
}
/* 메모/사진 아이콘 */
.memo-icon,
.photo-icon {
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s;
  display: inline-block;
}
.memo-icon.active,
.photo-icon.active {
  transform: scale(1.3);
}
/* 모달 — scoped 밖에서 동작하려면 :deep 없이 최상위로 올림 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 280px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.memo-text {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
}
.photo-box {
  width: 320px;
}
.preview-img {
  width: 100%;
  border-radius: 8px;
  object-fit: contain;
  max-height: 300px;
}
.modal-close-btn {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  font-size: 13px;
  cursor: pointer;
}
</style>
