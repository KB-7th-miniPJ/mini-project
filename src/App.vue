<template>
  <div class="container">
    <div>
      <router-view />
    </div>
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
