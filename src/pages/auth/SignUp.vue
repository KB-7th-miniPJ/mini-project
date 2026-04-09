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

            <!-- 완료 팝업 -->
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


// 이메일 형식 검사
const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// 비밀번호 형식 검사 — 특수문자, 8~16자
const validatePassword = (v) =>
  /^(?=.*[!@#$%^&*]).{8,16}$/.test(v)

const signupHandler = async () => {
  // 유효성 검사
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

    // 회원가입 API 호출
    await signup({
      name: name.value,
      email: email.value,
      password: password.value,
      joinTravelIds: {},
    })

    // 완료 팝업 표시 후 로그인 페이지 이동
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

<style>

</style>