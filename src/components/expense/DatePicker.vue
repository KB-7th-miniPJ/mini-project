  
  <template>
  <div class="overlay" @click="$emit('close')">
    <div class="sheet" @click.stop>
      <div class="handle" />

      <div class="nav">
        <button @click="prevMonth">‹</button>
        <span>{{ viewYear }}년 {{ monthNames[viewMonth] }}</span>
        <button @click="nextMonth">›</button>
      </div>

      <div class="days-header">
        <span v-for="d in ['일','월','화','수','목','금','토']" :key="d">{{ d }}</span>
      </div>

      <div v-for="(week, wi) in weeks" :key="wi" class="week-row">
        <button
          v-for="(day, di) in week"
          :key="di"
          :class="['day-btn', { selected: isSelected(day), empty: !day }]"
          @click="day && selectDate(day)"
        >
          {{ day || "" }}
        </button>
      </div>

      <button class="confirm-btn" @click="$emit('close')">확인</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: Date,
});
const emit = defineEmits(["update:modelValue", "close"]);

const today = new Date();
const viewYear = ref(props.modelValue ? props.modelValue.getFullYear() : today.getFullYear());
const viewMonth = ref(props.modelValue ? props.modelValue.getMonth() : today.getMonth());
const monthNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

const weeks = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay();
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate();
  const result = [];
  let day = 1 - firstDay;
  while (day <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++, day++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
    }
    result.push(week);
  }
  return result;
});

const prevMonth = () => {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value--; }
  else viewMonth.value--;
};

const nextMonth = () => {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++; }
  else viewMonth.value++;
};

const isSelected = (day) => {
  if (!day || !props.modelValue) return false;
  return props.modelValue.getFullYear() === viewYear.value &&
    props.modelValue.getMonth() === viewMonth.value &&
    props.modelValue.getDate() === day;
};

const selectDate = (day) => {
  emit("update:modelValue", new Date(viewYear.value, viewMonth.value, day));
  emit("close");
};
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: flex-end; justify-content: center;
  z-index: 100;
}
.sheet {
  background: #fff; border-radius: 20px 20px 0 0;
  padding: 20px; width: 100%; max-width: 480px; padding-bottom: 40px;
}
.handle {
  width: 36px; height: 4px; background: #e5e7eb;
  border-radius: 2px; margin: 0 auto 16px;
}
.nav {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
}
.nav button {
  background: none; border: none; font-size: 20px; cursor: pointer; color: #6b7280; padding: 4px 10px;
}
.nav span { font-weight: 600; font-size: 16px; color: #111827; }
.days-header {
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: 2px; margin-bottom: 8px;
}
.days-header span {
  text-align: center; font-size: 12px; color: #9ca3af; padding: 4px 0; font-weight: 500;
}
.week-row { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.day-btn {
  padding: 8px 0; border: none; border-radius: 8px;
  cursor: pointer; background: none; color: #111827; font-size: 14px;
  transition: background 0.15s;
}
.day-btn.selected { background: #22c55e; color: #fff; font-weight: 600; }
.day-btn.empty { cursor: default; color: transparent; }
.confirm-btn {
  margin-top: 16px; width: 100%; padding: 14px;
  background: #22c55e; color: #fff; border: none;
  border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer;
}
</style>