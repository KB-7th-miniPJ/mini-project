import { login } from "@/api/authApi"

// 참고: AuthUtil.js의 loginProcess — staticUsers.find() 대신 API 호출
const loginProcess = async (email, password, successCallback, failCallback) => {
    try {
        const res = await login({ email, password })
        successCallback(res.data.user)
    } catch {
        if (failCallback) failCallback()
    }
}

// 참고: AuthUtil.js의 logoutProcess
const logoutProcess = (callback) => {
    callback()
}

export { loginProcess, logoutProcess }
