import { getUserByCredentials } from '@/api/userApi.js'

// 참고: AuthUtil.js의 loginProcess — staticUsers.find() 대신 API 호출
const loginProcess = async (email, password, successCallback, failCallback) => {
    const res = await getUserByCredentials(email, password)
    if (res.data.length > 0) {
        successCallback(res.data[0])
    } else {
        if (failCallback) failCallback()
    }
}

// 참고: AuthUtil.js의 logoutProcess
const logoutProcess = (callback) => {
    callback()
}

export { loginProcess, logoutProcess }
