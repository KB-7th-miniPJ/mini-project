<template>
  <div class="container">
    <h2>
      <button
        @click="router.push({ name: 'Main' })"
        class="btn-back"
      >
        ←
      </button>
      새 여행 만들기
    </h2>

    <!-- 라디오 버튼으로 국내/해외 여행 타입 선택 -->
    <div class="section">
      <div class="radio-group">
        <label><input type="radio" value="국내" v-model="travelType" /> 국내여행</label>
        <label><input type="radio" value="해외" v-model="travelType" /> 해외여행</label>
      </div>

      <div class="form-group">
        <label>여행 이름</label>
        <input
          v-model="title"
          placeholder="여행 이름을 입력하세요"
        />
      </div>

      <!-- 출발/도착 날짜 -->
      <div class="form-row">
        <div class="form-group half">
          <label>출발날짜</label>
          <input
            type="date"
            v-model="startDate"
          />
        </div>
        <div class="form-group half">
          <label>도착날짜</label>
          <input
            type="date"
            v-model="endDate"
          />
        </div>
      </div>


      <button class="btn-submit" @click="addTravel">여행 만들기</button>

      <div v-if="invitedCode" class="invite-box">
        <p class="invite-label">초대코드</p>
        <strong class="invite-code">{{ invitedCode }}</strong>
      </div>
    </div>

    <hr />

    <div class="section">
      <h3>초대코드로 참가</h3>
      <div class="form-group">
        <input v-model="inputCode" placeholder="초대코드 6자리를 입력하세요" style="text-transform:uppercase" />
      </div>
      <button class="btn-submit" @click="joinTravel">참가하기</button>
      <p v-if="joinMessage" class="join-message">{{ joinMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTravelStore } from "@/stores/counter";

const router = useRouter();
const store = useTravelStore();
const travelType = ref("");
const title = ref("");
const startDate = ref("");
const endDate = ref("");
const membersCount = ref(1);
const invitedCode = ref('');
const inputCode = ref('');
const joinMessage = ref('');

const inviteInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const addTravel = async () => {
  if (!title.value || !startDate.value || !endDate.value) {
    alert("모든 항목을 입력해주세요.");
    return;
  }
  const code = inviteInviteCode();
  await store.addTravel({
    title: title.value,
    travelType: travelType.value,
    startDate: startDate.value,
    endDate: endDate.value,
    membersCount: membersCount.value,
    inviteCode: code,
  });
  invitedCode.value = code;
  alert('여행이 만들어졌습니다.');
};

const joinTravel = async () => {
  if (!inputCode.value) return;
  try {
    const result = await store.joinByInviteCode(inputCode.value.toUpperCase());
    if (result.success) {
      joinMessage.value = `"${result.travel.title}" 여행에 참가했습니다!`;
      inputCode.value = '';
      setTimeout(() => router.push({ name: 'Main' }), 1000);
    } else {
      joinMessage.value = result.message;
    }
  } catch (e) {
    joinMessage.value = '참가 중 오류가 발생했습니다.';
  }
};
</script>

<style scoped>
.container {
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  min-height: 100vh;
  box-shadow: 0 0 40px rgba(0,0,0,0.08);
  font-family: 'Pretendard', sans-serif;
  padding: 54px 20px 20px;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

h3 {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
}

.section { margin-bottom: 8px; }

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 5px 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.radio-group label:hover { border-color: #22c55e; color: #16a34a; }
input[type="radio"] { accent-color: #22c55e; }

.form-group { margin-bottom: 12px; }

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  background: none;
  border: none;
  border-radius: 0;
  padding: 0;
  cursor: default;
}
.form-group label:hover { border-color: transparent; color: #374151; }

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.15s;
  outline: none;
}
.form-group input:focus { border-color: #22c55e; }
.form-group input::placeholder { color: #9ca3af; }

.form-row { display: flex; gap: 8px; }
.half { flex: 1; }
.radio-group { display: flex; gap: 15px; margin-bottom: 10px; }
.radio-group label { display: inline; font-size: 13px; font-weight: bold; }
.btn-back { border: 1px solid #ccc; background: #fff; cursor: pointer; padding: 2px 8px; margin-right: 5px; }
.btn-submit { width: 100%; padding: 12px; background: #333; color: #fff; border: none; font-size: 15px; font-weight: bold; cursor: pointer; margin-top: 10px; }
.invite-box { margin-top: 16px; padding: 16px; background: #f0f8ff; border: 1px solid #99ccff; text-align: center; }
.invite-label { font-size: 13px; color: #666; margin-bottom: 6px; }
.invite-code { display: block; font-size: 32px; letter-spacing: 6px; color: #0055cc; margin-bottom: 10px; }
.join-message { margin-top: 8px; font-size: 13px; color: #333; text-align: center; }
</style>
