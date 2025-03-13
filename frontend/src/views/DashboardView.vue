<template>
  <div class="dashboard-container">
    <Header />
    <div class="body">
      <Sidebar />
      <!-- 자식 뷰 렌더링 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from "../stores/adminStore.js"
import { useProjectStore } from "../stores/projectStore.js"
import { useRouter } from 'vue-router'

const adminStore = useAdminStore()
const projectStore = useProjectStore()
const router = useRouter()

// 프로젝트 선택 여부를 쉽게 확인하기 위한 computed
const isProjectSelected = computed(() => !!projectStore.selectedProject.value)

// 드롭다운 상태
const settingsOpen = ref(false)

onMounted(async () => {
  try {
    const projects = await projectStore.fetchProjects()
    if (projects.length === 0) {
      // 프로젝트가 없으면 /dashboard/setting/project로 이동
      router.push('/dashboard/setting/project')
    } else {
      projectStore.selectedProject.value = projects[0]
    }
  } catch (error) {
    console.error('프로젝트 불러오기 에러:', error)
  }
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: max-content;
}

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

.body {
  margin-top: 32px;
  display: flex;
  flex: 1;
  overflow-y: auto;
}

.sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
  width: 120px;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  background-color: #2c3e50;
  padding: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
}

.sidebar a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  display: block;
  padding: 10px;
  border-radius: 5px;
}

.sidebar a:hover {
  background-color: #34495e;
}

.dropdown {
  position: relative;
}

.dropdown-button {
  width: 100%;
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.dropdown-button:hover {
  background-color: #34495e;
}

.dropdown-menu {
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
  background-color: #2c3e50;
  border-radius: 5px;
  overflow: hidden;
}

.dropdown-menu li {
  margin: 0;
  padding-right: 5px;
}
.dropdown-menu a {
  padding-left: 20px; /* indent 적용 */
}

.sidebar a.disabled-link {
  pointer-events: none;
  opacity: 0.5;
  background-color: transparent !important;
}

.active, .exact-active {
  background-color: #1abc9c;
}

.content {
  transition: margin-left 0.3s ease, width 0.3s ease;
  margin-left: 200px;
  width: calc(100% - 120px);
  padding: 20px;
}
</style>
