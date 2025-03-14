<template>
  <div class="dashboard-admin">
    <!-- ID Row -->
    <div class="form-row">
      <label>ID</label>
      <input type="text" readonly v-model="adminStore.admin_id" />
    </div>

    <!-- Password Row -->
    <div class="form-row">
      <label>Password</label>
      <input
          type="password"
          v-model="newPassword"
          name="newPassword"
          placeholder="Password"
      />
      <button class="change-btn" @click="changePassword">비밀번호 변경</button>
    </div>

    <!-- License Key Row -->
    <div class="form-row">
      <label>License Key</label>
      <input
          type="password"
          v-model="newLicenseKey"
          name="newLicenseKey"
          placeholder="License Key"
      />
      <button class="change-btn" @click="changeLicense">라이센스 키 변경</button>
    </div>

    <!-- Logout Row: 버튼만 가운데 정렬 -->
    <div class="logout-row">
      <button class="logout-btn" @click="adminStore.userLogout()">로그 아웃</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminStore } from "../stores/adminStore.js";

const adminStore = useAdminStore();

const newPassword = ref('')
const newLicenseKey = ref('')

async function changePassword() {
  if (!newPassword.value) {
    alert('신규 비밀번호를 입력해주세요.')
    return
  }
  // 비밀번호 변경 로직 추가
}

async function changeLicense() {
  if (!newLicenseKey.value) {
    alert('신규 라이센스 키를 입력해주세요.')
    return
  }
  // 라이센스 키 변경 로직 추가
}
</script>

<style scoped>
/* 전체 컨테이너 */
.dashboard-admin {
  width: 200px;
  margin: 2rem auto;
  padding: 1rem 2rem;
}

/* 각 행은 block 레벨로 배치 */
.form-row {
  margin-bottom: 1rem;
}

/* 라벨: 왼쪽 정렬, 줄바꿈 */
.form-row label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  margin-bottom: 0.5rem;
}

/* 입력 상자: block 형태, 적당한 너비 */
.form-row input {
  display: block;
  width: auto;
  border: 1px solid #ccc;
  padding: 0.5rem;
  font-size: 0.9rem;
  background-color: #f9f9f9;
  margin-bottom: 0.7rem;
}

/* 버튼: block 형태 */
.form-row button {
  display: block;
  width: auto;
  border: none;
  padding: 0.6rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
  background-color: #d9d9d9;
  margin-left: auto;
  margin-right: 9px;
}

/* 로그아웃 버튼만 별도 row에서 가운데 정렬 */
.logout-row {
  text-align: center;
  margin-top: 1rem;
}

.logout-btn {
  width: 95%;
  font-weight: 500;
  background-color: #d9d9d9;
  padding: 0.4rem 1rem;
  border: none;
}
</style>
