<template>
  <div class="page-container">
    <div class="mobile-frame">
      <div class="header">
        <button class="back-icon" @click="router.back()"> ‹ </button>
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

        <div v-if="perPerson.remainder > 0" class="remainder-notice">
          여행 가계에서 {{ perPerson.remainder }}원을 지원합니다!
        </div>

        <button class="submit-action-btn" @click="handleEditComplete">
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useExpense } from '@/hooks/useExpense';
import { useMembersStore } from '@/stores/members';
import axios from 'axios';

// 컴포넌트들 import (기존과 동일)
import CategorySelector from '@/components/expense/CategorySelector.vue';
import DatePicker from '@/components/expense/DatePicker.vue';
import MemberChip from '@/components/expense/MemberChip.vue';

const router = useRouter();
const route = useRoute();
const travelNumId = route.params.travelId;
const expenseId = route.params.id; // 라우트에서 지출 ID 가져오기
const showCalendar = ref(false);
const membersStore = useMembersStore();

const {
  categories, date, category, amount, place, members,
  formattedAmount, perPerson, setAmount
} = useExpense();

// 1. 기존 데이터 불러오기
onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3000/expenses/${expenseId}`);
    const data = response.data;

    // 불러온 데이터를 useExpense의 상태값에 채워넣음
    date.value = new Date(data.date);
    category.value = data.category;
    place.value = data.place;
    setAmount(String(data.amount));
    
    // participants를 membersStore 혹은 members ref에 동기화
    membersStore.setmembers(data.participants); 
    members.value = data.participants;

  } catch (err) {
  }
});

const formatDate = (d) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

const handleMemberSelect = () => {
  // 인원 선택 페이지로 이동할 때 현재 travelId 전달
  router.push(`/expense/${travelNumId}/members`);
};

// 2. 수정 실행 (PATCH)
const handleEditComplete = async () => {
  try {
    const payload = {
      date: date.value.toISOString(),
      category: category.value,
      place: place.value,
      amount: Number(amount.value),
      participants: members.value,
      payer: membersStore.payer?.id || null
    };

    await axios.patch(`http://localhost:3000/expenses/${expenseId}`, payload);
    
    alert('수정되었습니다.');
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