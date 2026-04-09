<template>
    <div>
        <span @click="router.back()">뒤로가기버튼 자리</span><br>

        <label>여행 이름</label><br>
        <input type="text" v-model="groupName" placeholder="여행 이름을 입력" /><br><br>

        <p v-if="groupNameError">이름 제약사항걸기</p>

        <button @click="createGroup">초대코드 생성하기</button> <br><br>

        <label>초대코드</label>
        <input type="text" v-model="inviteCode" placeholder="초대코드 입력" /><br>
        <p>초대코드를 입력하세요.</p>
        <button @click="joinGroup">그룹 참여하기</button>

        <button @click="router.push({ name: 'signin' })">메인으로</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const groupName = ref('')
const inviteCode = ref('')
const groupNameError = ref(false)

const createGroup = () => {
    groupNameError.value = groupName.value.length < 3
    if (groupNameError.value) return
}

const joinGroup = () => {
    if (!inviteCode.value) return

}
</script>

<style scoped></style>
