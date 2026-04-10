<template>
  <div class="chip" :style="{ background: chipColor + '22' }">
    <div class="avatar" :style="{ background: chipColor, color: '#fff' }">
      {{ member.name?.charAt(0) }}
    </div>
    <span class="name" :style="{ color: chipColor }">{{ member.name }}</span>
  </div>
</template>

<script setup>
const props = defineProps({ member: Object })

const colors = [
  '#a78bfa',
  '#86efac',
  '#fca5a5',
  '#f9a8d4',
  '#93c5fd',
  '#fcd34d',
]
const chipColor = colors[parseInt(props.member.id) % colors.length] || colors[0]
</script>

<style scoped>
.chip { display: flex; align-items: center; gap: 6px; padding: 5px 10px 5px 6px; border-radius: 20px; }
.avatar { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
.name { font-size: 12px; font-weight: 500; }
</style>