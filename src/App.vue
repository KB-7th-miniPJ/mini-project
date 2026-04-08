<template>
  <div>
    <nav style="display: flex; gap: 12px; margin-bottom: 16px">
      <RouterLink to="/signin">signin</RouterLink>
      <RouterLink to="/signup">signup</RouterLink>
      <RouterLink to="/travelbuild">travelbuild</RouterLink>
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

nav {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
}

nav a {
  color: #0066cc;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
}

nav a:hover {
  background-color: #e0e0e0;
}

nav a.router-link-active {
  background-color: #0066cc;
  color: white;
}
</style>
