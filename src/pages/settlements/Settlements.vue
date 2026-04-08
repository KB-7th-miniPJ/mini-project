<template>
  <div>정산페이지</div>
  <div>
    <!-- {{ res.data }} -->
    {{ settlements }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { settApi } from '@/api/settlementesApi';

// 초기값 선언
const route = useRoute();
const travelId = route.params.travelId;

/**************************************{API 테스트 영역 시작}*************************************************/
// 1. 여행id 별 정산조회
const settlements = ref(null);
const getSettlement = async (travelId) => {
  settlements.value = await settApi.getSettByTravel(travelId);
};
getSettlement(travelId);

// 2. 초기 정산데이터 입력
const dummySett = {
  travelId: 'travel9999',
  fromUserId: '3',
  toUserId: '1',
  amount: 99999,
  status: 'requested',
};
const postSett = async (sett) => {
  await settApi.postSett(sett);
};
// postSett(dummySett); // <-- 테스트하고싶으면 주석풀기

// 3. 정산 상태 변경
const patchSettStatus = async (settId, status) => {
  await settApi.patchSettStatus(settId, status);
};
patchSettStatus(9, 'pending');
/**************************************{API 테스트 영역 종료}*************************************************/
</script>

<style lang="scss" scoped></style>
