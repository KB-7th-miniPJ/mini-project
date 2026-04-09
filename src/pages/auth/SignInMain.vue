<template>
    <div>
        <input type="email" v-model="email" placeholder="아이디 입력 창" />
        <input type="password" v-model="password" placeholder="비밀번호 입력 창" />
        <p v-if="errorMsg">{{ errorMsg }}</p>
        <button @click="login">로그인</button>
        <br>
        <span>또는</span>
        <br>
        <button @click="router.push({ name: 'signup' })">회원가입</button><br>
        <button>비밀번호 찾기</button>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginProcess } from '@/utils/AuthUtil.js'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const errorMsg = ref('')

// 참고: Login.vue의 login() — successCallback/failCallback 구조 동일
const login = () => {
    loginProcess(
        email.value,
        password.value,
        (user) => {
            authStore.login(user)
            router.push({ name: 'Main' })
        },
        () => {
            errorMsg.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
        }
    )
}

</script>

<style>

</style>