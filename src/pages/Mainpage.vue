<template>
  <div class="container a">
    <div v-if="!route.params.id">
      <h2>내 여행방</h2>

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
        <p class="text-sm text-gray">{{ travel.destination }}</p>
        <p class="text-sm">{{ travel.startDate }} ~ {{ travel.endDate }} | {{ travel.membersCount }}명 | {{ formatAmount(travel.amount, travel.currency) }}</p>
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

const router = useRouter();
const route = useRoute();
const store = useTravelStore();

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
  return amount.toLocaleString() + ' ' + currency;
};
</script>

<style scoped>
.container { max-width: 500px; margin: 0 auto; }
.ma { margin-bottom: 10px; }
.a { padding: 12px; }
.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.text-sm { font-size: 13px; }
.text-gray { color: #888; }
label { margin-right: 8px; font-size: 13px; }
.card { border: 1px solid #ddd; background: #fff; cursor: pointer; }
.badge { font-size: 11px; padding: 2px 6px; margin-left: 5px; }
.badge-blue { background: #ddeeff; }
.badge-green { background: #d4edda; }
.badge-gray { background: #eee; }
.btn-delete { font-size: 12px; padding: 2px 8px; border: 1px solid #c00; color: #c00; background: #fff; cursor: pointer; }
.btn-add { width: 100%; padding: 10px; background: #333; color: #fff; border: none; cursor: pointer; margin-top: 10px; font-size: 14px; }
.btn-back { border: 1px solid #ccc; background: #fff; cursor: pointer; padding: 2px 8px; margin-right: 5px; }
</style>