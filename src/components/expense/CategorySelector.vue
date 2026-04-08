  
<template>
  <div class="page">
    <!-- <h2 class="title">인원 선택</h2> -->

    <!-- 결제자 선택 -->
    <div class="section">
      <p class="label">결제자</p>
      <select v-model="selectedPayer" class="select">
        <option value="" disabled>결제자를 선택해주세요</option>
        <option v-for="member in members" :key="member.id" :value="member">
          {{ member.name }}
        </option>
      </select>
    </div>

    <!-- 그룹멤버 -->
    <div class="section">
      <p class="label">그룹멤버 {{ members.length }}명</p>
      <div
        v-for="member in members"
        :key="member.id"
        class="member-row"
        @click="toggleParticipant(member)"
      >
        <!-- 아바타 -->
        <div class="avatar" :style="{ background: avatarColor(member.id) }">
          {{ member.name }}
        </div>

        <!-- 체크박스 -->
        <div class="checkbox" :class="{ checked: isParticipant(member) }">
          <svg
            v-if="isParticipant(member)"
            width="14"
            height="14"
            viewBox="0 0 14 14"
          >
            <path
              d="M2.5 7l3.5 3.5 5.5-6"
              stroke="#fff"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- 선택 완료 버튼 -->
    <button class="btn-complete" @click="handleComplete">선택 완료</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMembersStore } from '@/stores/members';
import { getMembersByTravelId } from '@/api/expenseApi';

const route = useRoute();
const router = useRouter();
const membersStore = useMembersStore();

const travelId = route.params.travelId;
const members = ref([]);
const selectedPayer = ref('');
const selectedParticipants = ref([]);

// 아바타 색상 (id 기반으로 고정색)
const colors = [
  '#a78bfa',
  '#86efac',
  '#fca5a5',
  '#f9a8d4',
  '#93c5fd',
  '#fcd34d',
];
const avatarColor = (id) => colors[parseInt(id) % colors.length];

// 참여 여부 확인
const isParticipant = (member) =>
  selectedParticipants.value.some((p) => p.id === member.id);

// 참여 멤버 토글
const toggleParticipant = (member) => {
  const idx = selectedParticipants.value.findIndex((p) => p.id === member.id);
  if (idx === -1) {
    selectedParticipants.value.push(member);
  } else {
    selectedParticipants.value.splice(idx, 1);
  }
};

// 완료 → store 저장 후 뒤로가기
const handleComplete = () => {
  if (!selectedPayer.value) {
    alert('결제자를 선택해주세요.');
    return;
  }
  if (selectedParticipants.value.length === 0) {
    alert('참여 멤버를 1명 이상 선택해주세요.');
    return;
  }
  console.log('결제자:', selectedPayer.value); // 결제자 확인
  console.log('참여멤버:', selectedParticipants.value); // 참여멤버 확인

  membersStore.setPayer(selectedPayer.value);
  membersStore.setParticipants(selectedParticipants.value);

  console.log('store 저장 후 payer:', membersStore.payer.name); // store 확인
  console.log('store 저장 후 participants:', membersStore.participants); // store 확인
  router.back();
};

// 멤버 목록 로드
onMounted(async () => {
  // try {
  //   members.value = await getMembersByTravelId(travelId);
  // } catch (e) {
  //   alert(e.message);
  // }
  try {
    console.log('travelId:', travelId); // travelId 확인
    const result = await getMembersByTravelId(travelId);
    console.log('API 결과:', result); // API 응답 확인
    members.value = result;
    console.log('members:', members.value); // 최종 멤버 확인
  } catch (e) {
    console.error('에러:', e.message); // 에러 확인
  }
});
</script>

<style scoped>
.page {
  max-width: 360px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}
.title {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 1.5rem;
}
.section {
  margin-bottom: 1.25rem;
}
.label {
  font-size: 13px;
  color: #888;
  margin-bottom: 6px;
}
.select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  appearance: none;
  background: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2 4l4 4 4-4' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>")
    no-repeat right 12px center;
}
.member-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 8px;
  cursor: pointer;
}
.member-row:hover {
  background: #f5f5f5;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  flex-shrink: 0;
}
.member-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}
.member-name {
  font-size: 15px;
}
.badge-me {
  font-size: 11px;
  background: #e8f5e9;
  color: #388e3c;
  border-radius: 4px;
  padding: 1px 6px;
}
.checkbox {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.checkbox.checked {
  background: #4caf50;
  border-color: #4caf50;
}
.btn-complete {
  width: 100%;
  margin-top: 1.5rem;
  padding: 14px;
  background: #4caf50;
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}
.btn-complete:hover {
  background: #43a047;
}
</style>
