<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
            <h4 class="text-center fw-bold mb-4">로그인하기</h4>

            <div class="mb-3">
                <input type="email" class="form-control" v-model="email" placeholder="이메일" />
            </div>
            <div class="mb-3">
                <input type="password" class="form-control" v-model="password" placeholder="비밀번호" />
            </div>

            <p v-if="errorMsg" class="text-danger small mb-2">{{ errorMsg }}</p>

            <button class="btn btn-dark w-100 mb-3" @click="login">로그인</button>

            <div class="text-center text-muted mb-3">또는</div>

            <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary w-50" @click="router.push({ name: 'signup' })">회원가입</button>
                <button class="btn btn-outline-secondary w-50" @click="findPassword">비밀번호 찾기</button>
            </div>
        </div>
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

const findPassword = () => {
    alert('관리자에게 문의하세요.\ngrboy0722@pusan.ac.kr')
}

// Login.vue의 login() — successCallback/failCallback 구조 동일
const login = () => {
    loginProcess(
        email.value,
        password.value,
        (user) => {
            authStore.login(user)
            alert(`${user.name}님 안녕하세요`)
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