  
  <template>
  <div class="chip" :style="{ background: member.color }">
    <div class="avatar" :style="{ background: member.textColor + '22', color: member.textColor }">
      {{ member.initial }}
    </div>
    <span class="name" :style="{ color: member.textColor }">{{ member.name }}</span>
  </div>
</template>

<script setup>
defineProps({
  member: Object,
});
</script>

<style scoped>
.chip {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 10px 5px 6px; border-radius: 20px;
}
.avatar {
  width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
}
.name {
  font-size: 12px; font-weight: 500;
}
</style>