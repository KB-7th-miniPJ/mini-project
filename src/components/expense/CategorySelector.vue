  
  <template>
  <div class="category-wrap">
    <button
      v-for="cat in categories"
      :key="cat.id"
      class="cat-btn"
      @click="$emit('update:selected', cat.name)"
    >
      <div :class="['cat-circle', { active: cat.name === selected }]">
        {{ cat.icon }}
      </div>
      <span :class="['cat-label', { active: cat.name === selected }]">
        {{ cat.name }}
      </span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  categories: Array,
  selected: String,
});
defineEmits(["update:selected"]);
</script>

<style scoped>
.category-wrap {
  display: flex; gap: 10px;
}
.cat-btn {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; background: none; border: none; cursor: pointer; flex: 1; padding: 0;
}
.cat-circle {
  width: 48px; height: 48px; border-radius: 50%;
  border: 2px solid #e5e7eb; background: #f9fafb;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; transition: all 0.15s;
}
.cat-circle.active {
  border: 2.5px solid #22c55e; background: #f0fdf4;
}
.cat-label {
  font-size: 12px; color: #6b7280;
}
.cat-label.active {
  color: #16a34a; font-weight: 600;
}
</style>