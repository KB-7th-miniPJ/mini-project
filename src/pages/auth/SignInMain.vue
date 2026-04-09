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

<style scoped>
/* 전체 배경 */
.container {
  background-color: #f9fafb;
  font-family: 'Pretendard', sans-serif;
}

/* 카드 */
.card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08) !important;
}

/* 타이틀 */
h4 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

/* 입력 필드 */
.form-control {
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 15px;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;
}
.form-control:focus {
  border-color: #22c55e;
  box-shadow: none;
}
.form-control::placeholder {
  color: #9ca3af;
}

/* 로그인 버튼 */
.btn-dark {
  background-color: #22c55e !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 14px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  color: #fff !important;
  transition: background-color 0.2s;
}
.btn-dark:hover {
  background-color: #16a34a !important;
}

/* 또는 텍스트 */
.text-muted {
  font-size: 13px;
  color: #9ca3af !important;
}

/* 회원가입, 비밀번호 찾기 버튼 */
.btn-outline-secondary {
  border: 1.5px solid #e5e7eb !important;
  border-radius: 12px !important;
  padding: 10px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #374151 !important;
  background: #fff !important;
  transition: all 0.2s;
}
.btn-outline-secondary:hover {
  background: #f0fdf4 !important;
  border-color: #22c55e !important;
  color: #16a34a !important;
}

/* 에러 메시지 */
.text-danger {
  font-size: 13px;
  color: #ef4444 !important;
}
</style>
