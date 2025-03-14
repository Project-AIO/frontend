<template>
  <div class="login-container">
    <h1>AIOrchestrator</h1>
    <form @submit.prevent="login" class="login-form">
      <!-- ID 입력영역 -->
      <div class="input-row">
        <label for="admin_id" class="login-label">ID:</label>
        <input
            id="admin_id"
            type="text"
            v-model="admin_id"
            class="login-input"
            placeholder="아이디"
            required
        />
      </div>

      <!-- PW 입력영역 -->
      <div class="input-row">
        <label for="pw" class="login-label">PW:</label>
        <input
            id="pw"
            type="password"
            v-model="pw"
            class="login-input"
            placeholder="비밀번호"
            required
        />
      </div>

      <button type="submit" class="login-button">로그인</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <LicenseModal
        v-if="showLicenseModal"
        :accountInfo="accountInfo"
        @licenseResult="handleLicenseResult"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAdminStore} from "../stores/adminStore.js";
import LicenseModal from './LoginViewModal.vue' // Modal 컴포넌트 경로

// 로그인 api 스토어
const adminStore = useAdminStore()

const admin_id = ref('')
const pw = ref('')
const errorMessage = ref('')
const router = useRouter()

// 라이센스 모달 관련 상태
const showLicenseModal = ref(false)
const accountInfo = ref(null)

async function login() {
  errorMessage.value = ''
  try {
    await adminStore.userLogin({
      admin_id: admin_id.value,
      pw: pw.value,
    })

    // 로그인 성공 (계정 정보 유효하고 라이센스 키가 있는 경우)
    router.push('/dashboard')
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        // 계정 정보가 틀린 경우
        errorMessage.value = '아이디 또는 비밀번호가 잘못되었습니다.'
      } else if (
          error.response.status === 403
      ) {
        // 계정 정보는 유효하지만 라이센스 키가 없을 때
        accountInfo.value = { admin_id: admin_id.value }
        showLicenseModal.value = true
      } else {
        errorMessage.value =
            error.response.data.message || '로그인 중 오류가 발생했습니다.'
      }
    } else {
      errorMessage.value = '네트워크 오류가 발생했습니다.'
    }
  }
}

// 모달에서 licenseResult 이벤트 처리
const handleLicenseResult = async (result) => {
  showLicenseModal.value = false
  console.log('result:', result)
  if (result === true) {
    // 라이센스 등록 성공 후, 자동 재로그인 시도
    try {
      await adminStore.userLogin({
        admin_id: admin_id.value,
        pw: pw.value,
      })
      router.push('/dashboard')
    } catch (err) {
      errorMessage.value = '로그인 재시도 중 오류가 발생했습니다.'
    }
  } else if (result === false) {
    errorMessage.value = '라이센스 키 오류, 담당 부서에 문의해주세요.'
  } else if (result === null) {
    errorMessage.value = '라이센스 키를 입력해주세요.'
  }
}
</script>

<style scoped>
.login-container {
  width: 250px;
  margin: 50px auto;
  text-align: center;
  align-items: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-row {
  width: 100%;
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.login-label {
  width: 50px;
  text-align: left;
  font-size: 18px;
}

.login-input {
  flex: 1;
  padding: 10px;
  box-sizing: border-box;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

.login-button:hover {
  opacity: 0.9;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
