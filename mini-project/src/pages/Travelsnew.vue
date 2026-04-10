<template>
  <div class="container p-3">
    <h2>
      <button @click="router.push({ name: 'Main' })" class="btn-back">←</button>
      새 여행 만들기
    </h2>
<!-- 라디오 버튼으로 국내/해외 여행 타입 선택 -->
    <div class="radio-group">
      <label><input type="radio" value="국내" v-model="travelType" /> 국내여행</label>
      <label><input type="radio" value="해외" v-model="travelType" /> 해외여행</label>
    </div>

    <div>
      <div class="form-group">
        <label>여행 이름</label>
        <input v-model="title" placeholder="여행 이름을 입력하세요" />
      </div>

      <div class="form-group">
        <label>목적지</label>
        <input v-model="destination" placeholder="목적지를 입력하세요" />
      </div>
<!--출발/도착 날짜-->
      <div class="form-row">
        <div class="form-group half">
          <label>출발날짜</label>
          <input type="date" v-model="startDate" />
        </div>
        <div class="form-group half">
          <label>도착날짜</label>
          <input type="date" v-model="endDate" />
        </div>
      </div>

      <div class="form-group">
        <label>참여 인원</label>
        <div>
          <button @click="decrement" :disabled="membersCount <= 1">−</button>
          <strong> {{ membersCount }}명 </strong>
          <button @click="increment">＋</button>
        </div>
      </div>

      <div class="form-group">
        <label>총 예산</label>
        <div class="form-row">
          <input type="number" v-model.number="amount" placeholder="0" class="half" />
          <select v-model="currency" class="half">
            <option value="KRW">KRW</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
      </div>

      <button class="btn-submit" @click="addTravel">여행 만들기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTravelStore } from '@/stores/counter';

const router = useRouter();
const store = useTravelStore();
const travelType = ref('');
const title = ref('');
const destination = ref('');
const startDate = ref('');
const endDate = ref('');
const membersCount = ref(1);
const amount = ref(0);
const currency = ref('KRW');
//참여인원 증가/감소 함수
const increment = () => { membersCount.value++; };
const decrement = () => { if (membersCount.value > 1) membersCount.value--; };
// 여행 생성
const addTravel = async () => {
  if (!title.value || !destination.value || !startDate.value || !endDate.value) {
    alert('모든 항목을 입력해주세요.');
    return;
  }
  await store.addTravel({
    title: title.value,
    destination: destination.value,
    startDate: startDate.value,
    endDate: endDate.value,
    membersCount: membersCount.value,
    amount: amount.value,
    currency: currency.value,
    status: '예정',
  });
  alert(`"${title.value}" 여행이 추가되었습니다!`);
  router.push({ name: 'Main' });
};
</script>

<style scoped>
.container { max-width: 500px; margin: 0 auto; }
.p-3 { padding: 12px; }
.form-group { margin-bottom: 10px; }
.form-group label { display: block; font-size: 13px; font-weight: bold; margin-bottom: 4px; }
.form-group input, .form-group select { padding: 8px; border: 1px solid #ccc; font-size: 14px; width: 100%; box-sizing: border-box; }
.form-row { display: flex; gap: 8px; }
.half { flex: 1; }
.btn-back { border: 1px solid #ccc; background: #fff; cursor: pointer; padding: 2px 8px; margin-right: 5px; }
.radio-group { display: flex; gap: 15px; margin-bottom: 10px; }
.radio-group label { display: inline; font-size: 13px; font-weight: bold; }
.btn-submit { width: 100%; padding: 12px; background: #333; color: #fff; border: none; font-size: 15px; font-weight: bold; cursor: pointer; margin-top: 10px; }
</style>
