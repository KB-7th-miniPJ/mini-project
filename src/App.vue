<template>

      <div class="container">
    <div>
      <router-link to="/">Home</router-link>&nbsp;
      <router-link to="/login">Login</router-link>&nbsp;
      <router-link to="/users">Users</router-link>&nbsp;
      <router-link to="/admins">Admins</router-link>&nbsp;
    </div>
    <hr />
    <div>
      <router-view />
    </div>
  </div>

  <div>
    <nav style="display: flex; gap: 12px; margin-bottom: 16px">
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
export default {
  name : "App"
}
</script>

<style scoped>
div {
  background-color: #ffffff;
  color: #000000;
  padding: 20px;
  min-height: 100vh;
}
</style>
