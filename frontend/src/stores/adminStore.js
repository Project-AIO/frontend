// 관리자 계정 데이터스토어
import { defineStore } from "pinia";
import { ref } from "vue";
import {login, logout, authRefresh, licenseReq} from '../api/admin.js'
import router from '../router';
import { useProjectStore } from "./projectStore.js";
import { useUserStore } from "./userStore.js";


// 관리자 계정 정보
export const useAdminStore = defineStore('admin',()=>{
    const admin_id = ref(null)
    // pw도 저장할지는 미정
    // const pw = ref(null)
    const accessToken = ref(null)
    const refreshToken = ref(null)

    const projectStore = useProjectStore();
    const userStore = useUserStore();

    function reset() {
        admin_id.value = null;
        accessToken.value = null;
        refreshToken.value = null;
    }

    // 로그인 절차(토큰 수령)
    async function userLogin(credentials) {
        try{
            admin_id.value = credentials.admin_id
            const response = await login(credentials)
            // pw.value = credentials.pw
            accessToken.value = response.data.accessToken
            refreshToken.value = response.data.refreshToken
        } catch (error){
            throw error
        }
    }
    
    // 인증 토큰 재발급
    async function tokenRefresh() {
        try {
            const request = {
                admin_id: admin_id.value,
                // pw: pw.value,
                refreshToken: refreshToken.value
            }
            const response = await authRefresh(request)
            accessToken.value = response.data.accessToken
            // 백엔드에서 refreshToken도 전달해줄 예정
            // refreshToken.value = response.data.refreshToken
            return true
        } catch (error){
            throw error
        }
    }

    async function licenseRequest(licenseKey) {
        try {
            const licenseInfo = {
                admin_id: admin_id.value,
                license_key: licenseKey
            }
            return await licenseReq(licenseInfo);
        } catch (error) {
            throw error
        }
    }

    async function changePw() {}

    async function userLogout() {
        try {
            let request = {
                admin_id: admin_id.value,
                accessToken: accessToken.value,
                refreshToken: refreshToken.value
            }
            await logout(request);
            reset()
            projectStore.reset()
            userStore.reset()
            sessionStorage.clear()
            await router.push(`/login`)
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return { admin_id, accessToken, refreshToken, userLogin, tokenRefresh, changePw, licenseRequest, userLogout }
},{
    persist: {
        key: 'admin',
        storage: sessionStorage
    }
})
