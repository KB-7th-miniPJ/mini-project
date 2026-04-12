<template>
  <div class="wrap" v-if="!isLoading">
    <button
      class="btn-back"
      @click="router.push({ name: 'main2', params: { travelId: travelId } })"
    >
      ←
    </button>
    <!-- 상단 히어로 카드 -->
    <div v-if="totalToReceive > 0" class="hero hero-receive">
      <span class="hero-tag">당신은 부르주아입니다</span>
      <span class="hero-amount">{{ totalToReceive.toLocaleString() }}원</span>
      <span class="hero-label">받을 금액</span>
    </div>
    <div v-else-if="totalToSend > 0" class="hero hero-send">
      <span class="hero-tag">당신은 빚쟁이입니다</span>
      <span class="hero-amount">{{ totalToSend.toLocaleString() }}원</span>
      <span class="hero-label">보낼 금액</span>
    </div>
    <div v-else class="hero hero-neutral">
      <span class="hero-tag">정산할 데이터가 없습니다</span>
      <span class="hero-amount">0원</span>
      <span class="hero-label">정산 없음</span>
    </div>

    <!-- 확정 전 안내 -->
    <p v-if="!isConfirmed" class="notice">
      여행 종료 후 2일 뒤 정산이 확정됩니다.
    </p>

    <!-- 중간: 내 정산 리스트 -->
    <section class="sec">
      <h3 class="sec-title">내 정산</h3>
      <ul v-if="mySett.length > 0" class="sett-list">
        <li v-for="(s, i) in mySett" :key="i" class="sett-item">
          <!-- 왼쪽: 아바타 + 이름 + 상태 -->
          <div class="sett-left">
            <div class="avatar">{{ getInitial(getCounterpart(s)) }}</div>
            <div class="sett-info">
              <span class="sett-name">{{ getName(getCounterpart(s)) }}</span>
              <span class="sett-sub">{{ getStatusText(s) }}</span>
            </div>
          </div>
          <!-- 오른쪽: 금액 + 버튼 -->
          <div class="sett-right">
            <span
              class="sett-amount"
              :class="s.toUserId === myId ? 'amount-receive' : 'amount-send'"
            >
              {{ s.toUserId === myId ? '+' : '-'
              }}{{ s.amount.toLocaleString() }}원
            </span>
            <template v-if="s.fromUserId === myId">
              <button
                v-if="isConfirmed && s.status === 'pending'"
                class="btn-action"
                @click="onSend(s)"
              >
                송금했어요
              </button>
              <span
                v-else-if="isConfirmed && s.status === 'sent'"
                class="badge-waiting"
                >확인 대기중</span
              >
              <span
                v-else-if="isConfirmed && s.status === 'completed'"
                class="badge-done"
                >완료</span
              >
            </template>
            <template v-else-if="s.toUserId === myId">
              <span
                v-if="isConfirmed && s.status === 'pending'"
                class="badge-pending"
                >미송금</span
              >
              <button
                v-else-if="isConfirmed && s.status === 'sent'"
                class="btn-action"
                @click="onReceive(s)"
              >
                수령확인
              </button>
              <span
                v-else-if="isConfirmed && s.status === 'completed'"
                class="badge-done"
                >완료</span
              >
            </template>
          </div>
        </li>
      </ul>
      <p v-else class="empty">나와 관련된 정산이 없습니다.</p>
    </section>

    <div class="divider" />

    <!-- 하단: 팀 전체 정산 현황 -->
    <section class="sec">
      <h3 class="sec-title">팀 정산 현황</h3>
      <ul v-if="otherSetts.length > 0" class="sett-list">
        <li v-for="(s, i) in otherSetts" :key="i" class="sett-item dimmed">
          <div class="sett-left">
            <div class="team-avatars">
              <div class="avatar avatar-from">
                {{ getInitial(s.fromUserId) }}
              </div>
              <div class="avatar avatar-to">{{ getInitial(s.toUserId) }}</div>
            </div>
            <div class="sett-info">
              <span class="sett-name">
                {{ getName(s.fromUserId) }} → {{ getName(s.toUserId) }}
              </span>
            </div>
          </div>
          <div class="sett-right">
            <span class="sett-amount">{{ s.amount.toLocaleString() }}원</span>
            <span v-if="s.status === 'completed'" class="badge-done">완료</span>
            <span v-else-if="isConfirmed" class="badge-pending">미완료</span>
          </div>
        </li>
      </ul>
      <p v-else class="empty">다른 팀원 간 정산이 없습니다.</p>
    </section>
  </div>
  <div v-else>로딩중</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTravelDetail } from '@/api/travelApi';
import { getExpenses } from '@/api/expenseslistApi';
import { getUsers } from '@/api/userApi';
import { useAuthStore } from '@/stores/auth';
import { settApi } from '@/api/settlementsApi';
import { calcMinSettlements } from '@/utils/SettUtil';

// ── 외부 의존성 ────────────────────────────
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// ── 상태 ──────────────────────────────────
const travel = ref(null);
const minSett = ref(null);
const members = ref([]);
const isLoading = ref(true);

// ── 파생 데이터 ────────────────────────────
const travelId = parseInt(route.params.travelId);
const myId = authStore.user?.id;

const isConfirmed = computed(() => {
  if (!travel.value?.endDate) return false;
  const confirmDate = new Date(travel.value.endDate);
  confirmDate.setDate(confirmDate.getDate() + 2);
  return new Date() > confirmDate;
});

const statusOrder = { sent: 0, pending: 1, completed: 2 };

const mySett = computed(() =>
  (minSett.value ?? [])
    .filter((s) => s.fromUserId === myId || s.toUserId === myId)
    .sort(
      (a, b) => (statusOrder[a.status] ?? 1) - (statusOrder[b.status] ?? 1),
    ),
);

const otherSetts = computed(() =>
  (minSett.value ?? []).filter(
    (s) => s.fromUserId !== myId && s.toUserId !== myId,
  ),
);

const totalToReceive = computed(() =>
  mySett.value
    .filter((s) => s.toUserId === myId)
    .reduce((sum, s) => sum + s.amount, 0),
);

const totalToSend = computed(() =>
  mySett.value
    .filter((s) => s.fromUserId === myId)
    .reduce((sum, s) => sum + s.amount, 0),
);

// ── API 호출 ───────────────────────────────
const loadTravel = async () => {
  const res = await getTravelDetail(travelId);
  travel.value = res.data;
};

const loadMembers = async () => {
  const res = await getUsers();
  members.value = res.data.filter((u) =>
    u.joinTravelIds.includes(String(travelId)),
  );
};

const toSettInput = (expenses) =>
  expenses.map((e) => ({
    payerId: e.payer ? Number(e.payer) : null,
    amount: e.amount,
    participants: e.participants.map((p) => p.id),
  }));

const init = async () => {
  try {
    await Promise.all([loadTravel(), loadMembers()]);

    if (!isConfirmed.value) {
      const res = await getExpenses(travelId);
      minSett.value = calcMinSettlements(toSettInput(res.data));
      return;
    }

    const saved = await settApi.getSettByTravel(travelId);
    if (saved.data.length > 0) {
      minSett.value = saved.data;
    } else {
      const res = await getExpenses(travelId);
      const calculated = calcMinSettlements(toSettInput(res.data));
      await Promise.all(
        calculated.map((s) =>
          settApi.postSett({ travelId, ...s, status: 'pending' }),
        ),
      );
      const freshSett = await settApi.getSettByTravel(travelId);
      minSett.value = freshSett.data;
    }
  } catch (e) {
    console.log(e);
  } finally {
    isLoading.value = false;
  }
};

// ── 유틸 ──────────────────────────────────
const getName = (userId) =>
  members.value.find((u) => u.id === userId)?.name ?? userId;

const getInitial = (userId) => getName(userId)?.[0] ?? '?';

const getCounterpart = (s) =>
  s.fromUserId === myId ? s.toUserId : s.fromUserId;

const getStatusText = (s) => {
  if (!isConfirmed.value) return '정산 확정 전';
  if (s.fromUserId === myId) {
    if (s.status === 'pending') return '송금 전';
    if (s.status === 'sent') return '송금 완료';
    return '정산 완료';
  } else {
    if (s.status === 'pending') return '송금 대기중';
    if (s.status === 'sent') return '수령 확인 필요';
    return '정산 완료';
  }
};

// ── 이벤트 핸들러 ─────────────────────────
const onSend = async (s) => {
  try {
    await settApi.patchSettStatus(s.id, 'sent');
    s.status = 'sent';
  } catch (e) {
    alert('처리 중 오류가 발생했습니다.');
  }
};
const onReceive = async (s) => {
  try {
    await settApi.patchSettStatus(s.id, 'completed');
    s.status = 'completed';
  } catch (e) {
    alert('처리 중 오류가 발생했습니다.');
  }
};

// ── 라이프사이클 ───────────────────────────
onMounted(init);
</script>

<style scoped>
.wrap {
  padding-bottom: 40px;
}
.btn-back {
  position: absolute;
  top: 14px;
  left: 14px;
  background: none;
  border: none;
  font-size: 22px;
  color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  z-index: 10;
  line-height: 1;
}

/* ── 히어로 ── */
.hero {
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  color: white;
}
.hero-receive {
  background: #1d9e75;
}
.hero-send {
  background: #e24b4a;
}
.hero-neutral {
  background: black;
}
.hero-tag {
  font-size: 13px;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.2);
  padding: 3px 10px;
  border-radius: 20px;
}
.hero-amount {
  font-size: 26px;
  font-weight: 700;
}
.hero-label {
  font-size: 12px;
  opacity: 0.75;
}

/* ── 안내 ── */
.notice {
  margin: 12px 16px 0;
  padding: 10px 14px;
  background: #fff8e1;
  border-left: 3px solid #f59e0b;
  border-radius: 6px;
  font-size: 13px;
  color: #92400e;
}

/* ── 섹션 ── */
.sec {
  padding: 16px 0 0;
}
.sec-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

/* ── 리스트 ── */
.sett-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sett-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #f8f8f6;
  border-radius: 12px;
}
.sett-item.dimmed {
  background: #f3f3f3;
  color: #aaa;
}
.sett-item.dimmed .sett-name,
.sett-item.dimmed .sett-amount {
  color: #bbb;
}
.sett-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #c8a96e;
  color: white;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.team-avatars {
  position: relative;
  width: 52px;
  height: 36px;
  flex-shrink: 0;
}
.avatar-from {
  position: absolute;
  left: 0;
  background: #7c6ee0;
  border: 2px solid white;
  z-index: 1;
}
.avatar-to {
  position: absolute;
  left: 16px;
  background: #c8a96e;
  border: 2px solid white;
  z-index: 0;
}
.sett-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.sett-name {
  font-size: 14px;
  font-weight: 600;
  color: #222;
}
.sett-sub {
  font-size: 12px;
  color: #888;
  font-weight: 700;
}
.sett-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}
.sett-amount {
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
}
.amount-receive {
  color: #1d9e75;
}
.amount-send {
  color: #e24b4a;
}

/* ── 버튼 / 뱃지 ── */
.btn-action {
  background: #1d9e75;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 7px 0;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  width: 80px;
  text-align: center;
}
.badge-waiting,
.badge-done,
.badge-pending {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 0;
  border-radius: 20px;
  width: 80px;
  text-align: center;
  display: inline-block;
}
.badge-waiting {
  color: #f59e0b;
  background: #fff8e1;
}
.badge-done {
  color: #1d9e75;
  background: #e6f5f0;
}
.badge-pending {
  color: #888;
  background: #f0f0f0;
}

/* ── 구분선 ── */
.divider {
  height: 8px;
  background: #f0f0f0;
  margin-top: 16px;
}

/* ── 빈 상태 ── */
.empty {
  font-size: 13px;
  color: #aaa;
  text-align: center;
  padding: 20px 0;
}
</style>
