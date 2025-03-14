<template>
  <nav ref="sidebarEl" class="sidebar">
    <ul>
      <li>
        <div class="dropdown">
          <button class="dropdown-button" @click="toggleKnowledgeDropdown">
            Knowledge
            <span class="dropdown-symbol">{{ knowledgeOpen ? '-' : '+' }}</span>
          </button>
          <ul v-if="knowledgeOpen" class="dropdown-menu">
            <li>
              <router-link
                  :to="isProjectSelected ? '/dashboard/knowledge/dataset' : '#'"
                  :class="{ 'disabled-link': !isProjectSelected }"
                  @click="checkProjectSelected($event)"
                  active-class="active"
              >
                Dataset
              </router-link>
            </li>
            <li>
              <router-link
                  :to="isProjectSelected ? '/dashboard/knowledge/presets' : '#'"
                  :class="{ 'disabled-link': !isProjectSelected }"
                  @click="checkProjectSelected($event)"
                  active-class="active"
              >
                Presets
              </router-link>
            </li>
            <li>
              <router-link
                  :to="isProjectSelected ? '/dashboard/knowledge/dictionary' : '#'"
                  :class="{ 'disabled-link': !isProjectSelected }"
                  @click="checkProjectSelected($event)"
                  active-class="active"
              >
                Dictionary
              </router-link>
            </li>
            <li>
              <router-link
                  :to="isProjectSelected ? '/dashboard/knowledge/permission' : '#'"
                  :class="{ 'disabled-link': !isProjectSelected }"
                  @click="checkProjectSelected($event)"
                  active-class="active"
              >
                Permission
              </router-link>
            </li>
            <li>
              <router-link
                  :to="isProjectSelected ? '/dashboard/knowledge/feedback' : '#'"
                  :class="{ 'disabled-link': !isProjectSelected }"
                  @click="checkProjectSelected($event)"
                  active-class="active"
              >
                Feedback
              </router-link>
            </li>
            <li>
              <router-link
                  :to="isProjectSelected ? '/dashboard/knowledge/config' : '#'"
                  :class="{ 'disabled-link': !isProjectSelected }"
                  @click="checkProjectSelected($event)"
                  active-class="active"
              >
                Configuration
              </router-link>
            </li>
          </ul>
        </div>
      </li>
      <li>
        <div class="dropdown">
          <button class="dropdown-button" @click="toggleSettingsDropdown">
            Settings
            <span class="dropdown-symbol">{{ settingsOpen ? '-' : '+' }}</span>
          </button>
          <ul v-if="settingsOpen" class="dropdown-menu">
            <li>
              <router-link
                  :to="isProjectSelected ? '/dashboard/setting/account' : '#'"
                  :class="{ 'disabled-link': !isProjectSelected }"
                  @click="checkProjectSelected($event)"
                  active-class="active"
              >
                Account
              </router-link>
            </li>
            <li>
              <router-link
                  :to="isProjectSelected ? '/dashboard/setting/project' : '#'"
                  :class="{ 'disabled-link': !isProjectSelected }"
                  @click="checkProjectSelected($event)"
                  active-class="active"
              >
                Project
              </router-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from "../stores/projectStore.js"

const sidebarEl = ref(null)
const projectStore = useProjectStore()

// 프로젝트 선택 여부를 computed로 확인
const isProjectSelected = computed(() => !!projectStore.selectedProject.value)

// 드롭다운 상태 관리
const knowledgeOpen = ref(false)
function toggleKnowledgeDropdown() {
  knowledgeOpen.value = !knowledgeOpen.value
}

const settingsOpen = ref(false)
function toggleSettingsDropdown() {
  settingsOpen.value = !settingsOpen.value
}



// 프로젝트 선택 확인 후 링크 이동 방지
function checkProjectSelected(event) {
  if (!isProjectSelected.value) {
    event.preventDefault()
  }
}
</script>

<style scoped>
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

.active {
  background-color: #1abc9c;
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

.disabled-link {
  pointer-events: none;
  opacity: 0.5;
  background-color: transparent !important;
}
</style>
