<template>
  <div class="page-container">
    <div class="mobile-frame">
      <div class="header">
        <button class="back-icon" @click="router.push(`/travels/${travelNumId}`)"> ‹ </button>
        <span class="header-text">지출 수정</span>
      </div>

      <div class="main-content">
        <div class="input-section">
          <div class="section-label">날짜 기간</div>
          <button class="custom-date-picker" @click="showCalendar = true">
            <span class="date-text">{{ formatDate(date) }}</span>
            <span class="calendar-icon">📅</span>
          </button>
        </div>

        <div class="input-section">
          <div class="section-label">카테고리</div>
          <CategorySelector
            :categories="categories"
            :selected="category"
            @update:selected="category = $event"
          />
        </div>

        <div class="input-section">
          <div class="section-label">장소</div>
          <input type="text" v-model="place" placeholder="예) 수산시장 횟집" class="place-input" />
        </div>

        <div class="input-section">
          <button class="member-select-btn" @click="handleMemberSelect">
            인원 수정
          </button>
          <div v-if="members && members.length > 0" class="member-chip-container">
            <MemberChip v-for="m in members" :key="m.id" :member="m" />
          </div>
        </div>

        <div class="input-section">
          <div class="section-label">총액</div>
          <div class="amount-input-wrapper">
            <input
              type="text"
              inputmode="numeric"
              :value="formattedAmount"
              class="amount-field"
              @input="(e) => setAmount(e.target.value)"
            />
            <span class="currency-label">원</span>
          </div>
        </div>

        <div class="input-section">
          <div class="section-label">영수증 업로드</div>
          <ReceiptUploader
            :photos="photos"
            @add="(files) => photos.push(...files)"
            @remove="(i) => photos.splice(i, 1)"
          />
        </div>

        <div v-if="perPerson.remainder > 0" class="remainder-notice">
          여행 가계에서 {{ perPerson.remainder }}원을 지원합니다!
        </div>

        <button class="submit-action-btn" @click="handleUpdate">
          수정 완료 (1인당 {{ perPerson.adjusted }}원)
        </button>
      </div>
    </div>

    <DatePicker
      v-if="showCalendar"
      :modelValue="date"
      @update:modelValue="date = $event"
      @close="showCalendar = false"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import axios from 'axios';
import { useExpense } from "@/hooks/useExpense";
import CategorySelector from "@/components/expense/CategorySelector.vue";
import DatePicker from "@/components/expense/DatePicker.vue";
import MemberChip from "@/components/expense/MemberChip.vue";
import ReceiptUploader from "@/components/expense/ReceiptUploader.vue";
import { useExpensedetailsStore } from "@/stores/expensedetail";
import { useMembersStore } from "@/stores/members";

const router = useRouter();
const route = useRoute();
const travelNumId = route.params.travelId;
const expenseId = route.params.id; // 수정할 지출 ID
const showCalendar = ref(false);

const membersStore = useMembersStore();
const detailStore = useExpensedetailsStore();

// useExpense 훅 사용 (saveExpense는 사용하지 않음)
const {
  categories, date, category, amount, place, members, photos,
  formattedAmount, perPerson, setAmount
} = useExpense();

// 페이지 떠날 때 리셋 (인원 선택하러 갈 때는 제외하고 싶다면 조건 추가 필요)
onBeforeRouteLeave((to) => {
  if (!to.path.includes('/members')) {
    membersStore.reset();
  }
});

const formatDate = (d) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

// ✅ 1. 데이터 불러오기 (초기 로드)
onMounted(async () => {
  // A. 먼저 스토어에 임시 저장된 데이터가 있는지 확인 (인원 선택 후 돌아온 경우)
  const savedDetail = detailStore.getdetailsData();

  if (savedDetail) {
    // 인원 선택 후 돌아왔을 때: 스토어의 데이터를 화면에 채움
    date.value = new Date(savedDetail.date);
    place.value = savedDetail.place;
    setAmount(String(savedDetail.amount));
    photos.value = savedDetail.photos || [];
    
    // 카테고리는 훅의 기본값 세팅을 기다린 후 덮어쓰기
    setTimeout(() => {
      category.value = savedDetail.category;
    }, 150);

    // 복구가 끝났으니 임시 데이터는 삭제
    detailStore.resetdetailData();
  } else {
    // B. 스토어에 데이터가 없다면 처음 진입한 것이므로 DB에서 데이터를 가져옴
    try {
      const res = await axios.get(`http://localhost:3000/expenses/${expenseId}`);
      const data = res.data;

      date.value = new Date(data.date);
      place.value = data.place;
      setAmount(String(data.amount));
      photos.value = data.photos || [];

      setTimeout(() => {
        category.value = data.category;
      }, 150);

      // DB에서 가져온 참여자 정보를 스토어에 세팅
      membersStore.setParticipants(data.participants || []);
      if (data.payer) {
        membersStore.setPayer(data.payer);
      }
    } catch (err) {
      console.error("데이터 로드 실패:", err);
    }
  }
});



// ✅  인원 선택 화면으로 이동 (수정 모드임을 명시)
const handleMemberSelect = () => {
  //추가부분
detailStore.setdetailsData({
    date: date.value,
    category: category.value,
    place: place.value,
    amount: amount.value,
    photos: photos.value
  });

  router.push({
    path: `/expense/${travelNumId}/members`,
    query: { mode: 'edit', id: expenseId } // 쿼리 추가
  });
};

// ✅ 3. 수정 완료 실행 (PATCH)
const handleUpdate = async () => {
  try {
    // 훅의 saveExpense를 쓰지 않고 여기서 직접 PATCH를 날려야 중복 생성이 안 됩니다.
    const payload = {
      travelId: Number(travelNumId),
      date: date.value.toISOString(),
      category: category.value,
      place: place.value,
      amount: Number(amount.value),
      participants: membersStore.participants,
      payer: membersStore.payer || null,
      photos: photos.value
    };

    await axios.patch(`http://localhost:3000/expenses/${expenseId}`, payload);
    
    alert('수정이 완료되었습니다.');
    membersStore.reset();
    router.push(`/travels/${travelNumId}`);
  } catch (err) {
    console.error('수정 실패:', err);
    alert('수정에 실패했습니다.');
  }
};
</script>

<style scoped>
.page-container { min-height: 100vh; background: #f9fafb; display: flex; justify-content: center; }
.mobile-frame { width: 100%; max-width: 480px; background: #fff; min-height: 100vh; box-shadow: 0 0 40px rgba(0,0,0,0.08); }
.header { display: flex; align-items: center; justify-content: center; padding: 54px 20px 16px; position: relative; }
.back-icon { position: absolute; left: 20px; background: none; border: none; font-size: 22px; cursor: pointer; color: #374151; }
.header-text { font-size: 17px; font-weight: 600; color: #111827; }
.main-content { padding: 0 20px; }
.input-section { margin-bottom: 20px; }
.section-label { font-size: 13px; color: #6b7280; margin-bottom: 8px; font-weight: 500; }
.custom-date-picker { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; border: 1.5px solid #22c55e; border-radius: 12px; background: #fff; cursor: pointer; }
.place-input { width: 100%; padding: 13px 16px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 15px; color: #111827; outline: none; box-sizing: border-box; }
.place-input:focus { border-color: #22c55e; }
.amount-input-wrapper { display: flex; align-items: center; border: 1.5px solid #22c55e; border-radius: 12px; padding: 13px 16px; gap: 8px; }
.amount-field { flex: 1; border: none; outline: none; font-size: 20px; font-weight: 700; color: #111827; }
.member-select-btn { width: 100%; padding: 14px; background: #22c55e; color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
.member-chip-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.submit-action-btn { width: 100%; padding: 16px; background: #22c55e; color: #fff; border: none; border-radius: 14px; font-size: 16px; font-weight: 700; cursor: pointer; margin-bottom: 20px; }
</style>