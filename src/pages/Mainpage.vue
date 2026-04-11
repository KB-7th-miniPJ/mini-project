<template>
  <div class="container a">
    <div v-if="!route.params.id">
      <div class="d-flex justify-between align-center">
        <h2>내 여행방</h2>
        <button class="btn-logout" @click="logout">로그아웃</button>
      </div>

      <div class="ma">
        <label v-for="f in filters" :key="f.value">
          <input type="checkbox" :value="f.value" v-model="store.state.activeFilters" /> {{ f.label }}
        </label>
        <label><input type="checkbox" v-model="store.state.showDomestic" /> 국내여행</label>
        <label><input type="checkbox" v-model="store.state.showOverseas" /> 해외여행</label>
      </div>

      <p v-if="store.filteredTravels.length === 0">해당하는 여행이 없습니다.</p>

      <div v-for="travel in store.filteredTravels" :key="travel.id" class="card mb-2 p-3" @click="gomain2(travel.id)">
        <div class="d-flex justify-between align-center">
          <div>
            <strong>{{ travel.title }}</strong>
            <span class="badge" :class="badgeClass(travel.status)">{{ travel.status }}</span>
          </div>
          <button class="btn-delete" @click.stop="removeTravel(travel.id)">삭제</button>
        </div>
        <p class="text-sm">{{ travel.startDate }} ~ {{ travel.endDate }} | {{ travel.membersCount }}명 | {{ formatAmount(travel.amount, travel.currency) }} | 초대코드 : {{travel.inviteCode}}</p>
      </div>

      <button class="btn-add" @click="router.push({ name: 'TravelsNew' })">+ 새 여행</button>
    </div>

    <div v-else>
      <h2>
        <button @click="router.push({ name: 'Main' })" class="btn-back">←</button>
        여행 상세
      </h2>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTravelStore } from '@/stores/counter';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const store = useTravelStore();
const authStore = useAuthStore();

const logout = () => {
  authStore.logout()
  router.push({ name: 'signin' })}

const filters = [
  { label: '예정', value: '예정' },
  { label: '진행 중', value: '진행 중' },
  { label: '완료', value: '완료' },
];

onMounted(() => { store.fetchTravels(); });

const gomain2 = (travelNumId) => {
  router.push(`/travels/${travelNumId}`);
};


const badgeClass = (status) => {
  if (status === '예정') return 'badge-blue';
  if (status === '진행 중') return 'badge-green';
  return 'badge-gray';
};

const removeTravel = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  await store.removeTravel(id);
};

const formatAmount = (amount, currency) => {
  return (amount ?? 0).toLocaleString() + ' ' + (currency || '');
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
}

.a { padding: 54px 20px 20px; }

h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }

.ma {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #374151;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 5px 12px;
  cursor: pointer;
  transition: all 0.15s;
  margin-right: 0;
}
label:hover { border-color: #22c55e; color: #16a34a; }

input[type="checkbox"] { accent-color: #22c55e; }

.card {
  border: 0.5px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  padding: 14px 16px !important;
  margin-bottom: 10px !important;
  transition: border-color 0.15s;
}
.card:hover { border-color: #22c55e; }

.card strong {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.text-sm { font-size: 13px; color: #6b7280; margin: 4px 0 0; }
.text-gray { color: #9ca3af; }

.badge {
  font-size: 11px;
  padding: 3px 8px;
  margin-left: 6px;
  border-radius: 20px;
  font-weight: 500;
}
.badge-blue { background: #e6f1fb; color: #185fa5; }
.badge-green { background: #f0fdf4; color: #16a34a; }
.badge-gray { background: #f1efea; color: #5f5e5a; }

.btn-delete {
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid #fca5a5;
  color: #ef4444;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-delete:hover { background: #fef2f2; }

.btn-add {
  width: 100%;
  padding: 14px;
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 12px;
  font-size: 15px;
  font-weight: 600;
  transition: background-color 0.2s;
}
.btn-add:hover { background: #16a34a; }

.btn-logout {
  padding: 6px 14px;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-logout:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-back {
  border: 1.5px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 16px;
  color: #374151;
  transition: all 0.15s;
}
.btn-back:hover { border-color: #22c55e; color: #16a34a; }

p { font-size: 14px; color: #9ca3af; text-align: center; margin-top: 40px; }
</style>
