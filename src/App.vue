<template>
  <div>
    <nav style="display: flex; gap: 12px; margin-bottom: 16px">
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
div {
  background-color: #ffffff;
  color: #000000;
  padding: 20px;
  min-height: 100vh;
}
</style>
