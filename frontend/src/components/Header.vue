<template>
  <header class="header">
    <div class="header_left">AIOrchestrator</div>
    <div class="header_right">
      <span class="account-name">
        {{ projectStore.selectedProject?.value?.project_name || '프로젝트 없음' }}
      </span>
      <button class="logout" @click="logout">
        <img class="logout-img" :src="logoutImg" alt="Logout Image" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { useProjectStore } from "../stores/projectStore.js"
import { useAdminStore } from "../stores/adminStore.js"

const projectStore = useProjectStore()
const adminStore = useAdminStore()

// logout 함수
const logout = async () => {
  projectStore.selectedProject.value = null
  await adminStore.userLogout()
  sessionStorage.clear()
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 98.5%;
  height: 60px;
  background-color: #d8d8d8;
  color: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 1000;
}

.header_left {
  font-size: 1.2rem;
  font-weight: bold;
}

.header_right {
  display: flex;
  align-items: center;
}

.account-name {
  margin-right: 0.5rem;
}

.logout {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.logout-img {
  width: 33px;
  height: 33px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  margin-right: 10px;
}
</style>
