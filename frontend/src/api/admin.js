// 관리자 계정 및 인증 api
import apiClient from './index'

// 관리자 로그인
export const login = (credentials) => {
    return apiClient.post('/login', credentials)
}

// 인증 토큰 재발급
export const authRefresh = (credToken) => {
    return apiClient.post('/auth-refresh', credToken, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credToken.refreshToken}`
        }
    })
}

// 관리자 계정 라이센스 키 검증
export const licenseCheck = (licenseInfo) => {
    return apiClient.post('/license', licenseInfo)
}

// 관리자 로그아웃
export const logout = (credentials) => {
    return apiClient.post('/logout', credentials)
}
