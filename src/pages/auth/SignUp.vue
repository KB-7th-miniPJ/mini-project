<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
            <h4 class="text-center fw-bold mb-4">회원가입</h4>

            <div class="mb-3">
                <label class="form-label">이름</label>
                <input type="text" class="form-control" v-model="name" placeholder="이름을 입력하세요" />
            </div>

            <div class="mb-3">
                <label class="form-label">이메일</label>
                <input type="email" class="form-control" v-model="email" placeholder="이메일을 입력하세요" />
                <p v-if="emailError" class="text-danger small mt-1 mb-0">유효한 이메일 형식이어야 합니다.</p>
                <p v-if="emailDuplicateError" class="text-danger small mt-1 mb-0">이미 사용 중인 이메일입니다.</p>
            </div>

            <div class="mb-3">
                <label class="form-label">비밀번호</label>
                <input type="password" class="form-control" v-model="password" placeholder="비밀번호를 입력하세요" />
                <p class="text-muted small mt-1 mb-0">특수문자 포함, 8~16자</p>
                <p v-if="passwordError" class="text-danger small mt-1 mb-0">특수문자, 8~16자여야 합니다.</p>
            </div>

            <div class="mb-4">
                <label class="form-label">비밀번호 확인</label>
                <input type="password" class="form-control" v-model="passwordConfirm" placeholder="비밀번호를 한 번 더 입력하세요" />
                <p v-if="passwordConfirmError" class="text-danger small mt-1 mb-0">입력한 비밀번호와 일치해야 합니다.</p>
            </div>

            <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary w-50" @click="router.push({ name: 'signin' })">취소</button>
                <button class="btn btn-dark w-50" @click="signupHandler">회원가입</button>
            </div>

            <div v-if="showPopup" class="alert alert-success mt-3 text-center mb-0">
                회원가입이 완료되었습니다!
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { checkDuplicateEmail, signup } from '@/api/userApi.js'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPopup = ref(false)
const emailError = ref(false)
const emailDuplicateError = ref(false)
const passwordError = ref(false)
const passwordConfirmError = ref(false)

const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const validatePassword = (v) =>
  /^(?=.*[!@#$%^&*]).{8,16}$/.test(v)

const signupHandler = async () => {
  emailError.value = !validateEmail(email.value)
  passwordError.value = !validatePassword(password.value)
  passwordConfirmError.value = password.value !== passwordConfirm.value

  if (emailError.value || passwordError.value || passwordConfirmError.value) return

  try {
    const checkRes = await checkDuplicateEmail(email.value)
    if (checkRes.data.length > 0) {
      emailDuplicateError.value = true
      return
    }

    await signup({
      name: name.value,
      email: email.value,
      password: password.value,
      joinTravelIds: {},
    })

    showPopup.value = true
    setTimeout(() => {
      showPopup.value = false
      router.push({ name: 'signin' })
    }, 2000)
  } catch (err) {
    console.error('회원가입 실패:', err)
  }
}
</script>

<style scoped>
.container {
  background-color: #f9fafb;
  font-family: 'Pretendard', sans-serif;
}

.card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08) !important;
}

h4 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.form-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 6px;
}

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

.text-muted {
  font-size: 12px;
  color: #9ca3af !important;
}

.text-danger {
  font-size: 12px;
  color: #ef4444 !important;
}

.btn-dark {
  background-color: #22c55e !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 12px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  color: #fff !important;
  transition: background-color 0.2s;
}
.btn-dark:hover {
  background-color: #16a34a !important;
}

.btn-outline-secondary {
  border: 1.5px solid #e5e7eb !important;
  border-radius: 12px !important;
  padding: 12px !important;
  font-size: 15px !important;
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

.alert-success {
  background-color: #f0fdf4;
  border: 1px solid #22c55e;
  color: #16a34a;
  border-radius: 12px;
  font-size: 14px;
}
</style>
