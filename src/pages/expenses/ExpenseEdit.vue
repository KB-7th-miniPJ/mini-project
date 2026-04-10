
<template>
  <div class="page-container">
    <div class="mobile-frame">
      <div class="header">
        <button class="back-icon " @click="router.push(`/travels/${travelNumId}`)"> ‹</button>
        // ✅ 뒤로가기 버튼 router.back에서 해당여행방의 main2 페이지로 이동하게 주소로 설정
        
        <span class="header-text">지출 기록</span>
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

        <!-- 장소 입력 추가 -->
        <div class="input-section">
          <div class="section-label">장소</div>
          <input
            type="text"
            v-model="place"
            placeholder="예) 수산시장 횟집"
            class="place-input"
          />
        </div>

        <div class="input-section">
          <div class="section-label">총액</div>
          <div class="amount-input-wrapper">
            <input
              type="text"
              inputmode="numeric"
              :value="formattedAmount"
              class="amount-field"
              @input="e => setAmount(e.target.value)"
            />
            <span class="currency-label">원</span>
          </div>
        </div>

        <div class="input-section">
          <button class="member-select-btn" @click="handleMemberSelect">
            인원 선택
          </button>
          <div v-if="members && members.length > 0" class="member-chip-container">
            <MemberChip v-for="m in members" :key="m.id" :member="m" />
          </div>
        </div>

        <div class="input-section">
          <div class="section-label">영수증 업로드</div>
          <ReceiptUploader
            :photos="photos"
            @add="files => photos.push(...files)"
            @remove="i => photos.splice(i, 1)"
          />
        </div>

        <button class="submit-action-btn" @click="handleComplete">
          완료 1인당 {{ perPerson }}원
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
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router"; // ✅ useRoute 추가
import { useExpense } from "@/hooks/useExpense";
import CategorySelector from "@/components/expense/CategorySelector.vue";
import DatePicker from "@/components/expense/DatePicker.vue";
import MemberChip from "@/components/expense/MemberChip.vue";
import ReceiptUploader from "@/components/expense/ReceiptUploader.vue";

const router = useRouter();
const route = useRoute();                           // ✅ 추가
const travelNumId = route.params.travelId;          // ✅ 추가 
const showCalendar = ref(false);


const {
  categories, date, category, amount, place,
  members, photos, formattedAmount, perPerson,
  setAmount, saveExpense
} = useExpense();

const formatDate = (d) =>
  `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;

const handleMemberSelect = () => router.push("/expensemembers");

const handleComplete = async () => {
  try {
    await saveExpense();
     router.push(`/travels/${travelNumId}`);  // ✅ expenseslist 말고 대시보드로
  } catch (err) {
    console.error('저장 실패 원인:', err);   // ✅ 원인 확인용
    alert("저장에 실패했습니다.");
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