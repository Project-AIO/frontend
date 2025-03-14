<template>
  <header class="header">
    <div class="header_left">AIOrchestrator</div>
    <div class="header_right">
      <span class="account-name">
        {{ projectStore.selectedProject?.value?.project_name || '프로젝트 없음' }}
      </span>
      <button class="profile-button" @click="navigateToAdmin">
        {{ adminInitials }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from "../stores/projectStore.js"
import { useAdminStore } from "../stores/adminStore.js"

const projectStore = useProjectStore()
const adminStore = useAdminStore()
const router = useRouter()

// adminStore.admin_id의 첫 두 글자를 계산합니다.
const adminInitials = computed(() =>
    adminStore.admin_id ? adminStore.admin_id.slice(0, 2) : ''
)

// 버튼 클릭 시 관리자 설정 페이지로 이동
function navigateToAdmin() {
  router.push("/dashboard/setting/account/admin")
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

.profile-button {
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  /* 텍스트 중앙 정렬을 위한 약간의 여백 */
  padding: 0;
}
</style>
