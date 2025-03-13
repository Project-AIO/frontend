import axios from 'axios';
import {useAdminStore} from "../stores/adminStore.js";

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
})

// 요청 인터셉터
apiClient.interceptors.request.use(function (config) {
    const adminStore = useAdminStore()
    if (adminStore.accessToken) {
        config.headers.Authorization = `Bearer ${adminStore.accessToken}`
    }
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const adminStore = useAdminStore();

        // /login, /license, /auth-refresh 엔드포인트는 토큰 갱신 로직 스킵
        if (
            originalRequest.url.includes('/login') ||
            originalRequest.url.includes('/license') ||
            originalRequest.url.includes('/auth-refresh')
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest.headers['x-retry']) {
            originalRequest.headers['x-retry'] = 'true';
            try {
                await adminStore.tokenRefresh();
                originalRequest.headers.Authorization = `Bearer ${adminStore.accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                await adminStore.userLogout();
                window.alert("세션이 만료되어 로그아웃 되었습니다. 다시 로그인해주세요.");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);



export default apiClient