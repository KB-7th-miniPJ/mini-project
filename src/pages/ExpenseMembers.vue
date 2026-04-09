<template>
  <div class="page">
    <div class="header">
      <button class="back-btn" @click="goBack">‹</button>
      <h2 class="title">인원 선택</h2>
    </div>

    <div class="section">
      <p class="label">결제자</p>
      <select
        v-model="selectedPayer"
        class="select"
        @change="handlePayerChange"
      >
        <option value="" disabled>결제자를 선택해주세요</option>
        <option v-for="member in members" :key="member.id" :value="member">
          {{ member.name }}
        </option>
      </select>
    </div>

    <div class="section">
      <p class="label">그룹멤버 {{ members.length }}명</p>
      <div
        v-for="member in members"
        :key="member.id"
        class="member-row"
        @click="toggleParticipant(member)"
      >
        <div class="avatar" :style="{ background: avatarColor(member.id) }">
          {{ member.name[0] }}
        </div>
        <div class="member-info">
          <span class="member-name">{{ member.name }}</span>
        </div>

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

    <button class="btn-complete" @click="handleComplete">선택 완료</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMembersStore } from '@/stores/members';
import { getMembersByTravelId } from '@/api/expensemembersApi';

const route = useRoute();
const router = useRouter();
const membersStore = useMembersStore();

const travelId = route.params.travelId;

const members = ref([]);

const selectedPayer = ref('');

const selectedParticipants = ref([]);

const colors = [
  '#a78bfa',
  '#86efac',
  '#fca5a5',
  '#f9a8d4',
  '#93c5fd',
  '#fcd34d',
];

const avatarColor = (id) => colors[parseInt(id) % colors.length];

const handlePayerChange = () => {
  if (selectedPayer.value && !isParticipant(selectedPayer.value)) {
    selectedParticipants.value.push(selectedPayer.value);
  }
};

const isParticipant = (member) =>
  selectedParticipants.value.some((p) => p.id === member.id);

const toggleParticipant = (member) => {
  const idx = selectedParticipants.value.findIndex((p) => p.id === member.id);
  if (idx === -1) {
    selectedParticipants.value.push(member);
  } else {
    selectedParticipants.value.splice(idx, 1);
  }
};

const handleComplete = () => {
  if (!selectedPayer.value) {
    alert('결제자를 선택해주세요.');
    return;
  }
  if (selectedParticipants.value.length === 0) {
    alert('참여 멤버를 1명 이상 선택해주세요.');
    return;
  }

  membersStore.setPayer({
    id: selectedPayer.value.id,
    name: selectedPayer.value.name,
  });
  membersStore.setParticipants(
    selectedParticipants.value.map((m) => ({
      id: m.id,
      name: m.name,
    })),
    selectedParticipants.value.length,
  );

  router.back();
};

onMounted(async () => {
  try {
    const result = await getMembersByTravelId(travelId);

    members.value = result;
  } catch (e) {
    console.error('에러:', e.message);
  }
});

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.back-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  font-size: 28px;
  color: #333;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color 0.2s;
  margin-top: 8px;
}

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
  font-weight: 700;
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
  background: #22c55e;
  border-color: #22c55e;
}
.btn-complete {
  width: 100%;
  margin-top: 1.5rem;
  padding: 14px;
  background: #22c55e;
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}
</style>
