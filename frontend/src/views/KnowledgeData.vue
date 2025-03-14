<template>
  <div v-if="selectedProjectId" class="knowledge-docs">
    <div class="top-bar">
      <button class="folder-btn" @click="openNewFolderModal">폴더 생성</button>
      <button class="filter-btn" @click="onFilterClick">검색 필터</button>
    </div>

    <!-- 폴더 드롭다운 영역 -->
    <div class="folder-dropdown" @click="toggleFolderDropdown">
      <span class="dropdown-icon">▼</span>
      <span class="selected-folder">
        {{ selectedFolder ? selectedFolder.name : '선택된 폴더 없음' }}
      </span>
    </div>
    <!-- 드롭다운 리스트 -->
    <ul v-if="showFolderDropdown" class="folder-dropdown-list">
      <li v-for="folder in folders" :key="folder.project_folder_id">
        <span @click.stop="selectFolder(folder)">{{ folder.name }}</span>
        <button class="delete-folder-btn" @click.stop="deleteFolder(folder)">삭제</button>
      </li>
    </ul>

    <!-- 컨트롤 영역: 좌측에 '권한'과 '문서 추가' 버튼, 우측에 '검색 필터' 버튼 -->
    <div class="control-row">
      <div class="left-buttons">
        <button class="permission-btn">권한</button>
        <button class="add-doc-btn">문서 추가</button>
      </div>
      <div class="right-buttons">
        <button class="filter-btn">검색 필터</button>
      </div>
    </div>

    <!-- 문서 테이블 -->
    <table class="docs-table">
      <thead>
      <tr>
        <th>Source Name</th>
        <th>문서명</th>
        <th>Pages</th>
        <th>상태</th>
        <th>Preset</th>
        <th>접근 권한</th>
        <th>Upload Date</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Example Source</td>
        <td>Example Document</td>
        <td>10</td>
        <td>Active</td>
        <td>Default</td>
        <td>Admin</td>
        <td>2025-02-27</td>
        <td><button class="remove-btn">Remove</button></td>
      </tr>
      </tbody>
    </table>

    <!-- 폴더 생성 모달 -->
    <NewFolderModal
        v-if="showNewFolderModal"
        @created="handleFolderCreated"
        @cancel="handleModalCancel"
    />
  </div>
  <div v-else class="loading">
    프로젝트 정보를 불러오는 중...
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from 'vue'
import api from '../api/index.js'
import NewFolderModal from './NewFolderModal.vue'

const props = defineProps({
  selectedProjectId: {
    type: Number,
    required: true
  }
})

// 폴더 생성 모달 제어
const showNewFolderModal = ref(false)

// 폴더 드롭다운 관련 상태
const folders = ref([])
const selectedFolder = ref(null)
const showFolderDropdown = ref(false)

// 폴더 목록 API 호출
function fetchFolders() {
  if (props.selectedProjectId) {
    api
        .get(`/projects/${props.selectedProjectId}/project_folder`, { withCredentials: true })
        .then(response => {
          folders.value = response.data
          if (!selectedFolder.value && folders.value.length > 0) {
            selectedFolder.value = folders.value[0]
          }
        })
        .catch(error => {
          console.error('폴더 목록 불러오기 에러:', error)
        })
  }
}

onMounted(() => {
  fetchFolders()
})

watch(() => props.selectedProjectId, (newVal) => {
  if (newVal) {
    fetchFolders()
  }
})

function openNewFolderModal() {
  showNewFolderModal.value = true
}

function handleFolderCreated(folderName) {
  const payload = {
    project_id: props.selectedProjectId,
    name: folderName,
    create_dt: new Date().toISOString()
  }
  api
      .post(`/projects/${payload.project_id}/project_folder`, payload, { withCredentials: true })
      .then(response => {
        console.log('폴더 생성됨:', response.data)
        fetchFolders()
      })
      .catch(error => {
        console.error('폴더 생성 에러:', error)
      })
  showNewFolderModal.value = false
}

function handleModalCancel() {
  showNewFolderModal.value = false
}

function onFilterClick() {
  console.log('검색 필터 버튼 클릭')
}

function toggleFolderDropdown() {
  showFolderDropdown.value = !showFolderDropdown.value
}

function selectFolder(folder) {
  selectedFolder.value = folder
  showFolderDropdown.value = false
}

// 프로젝트 폴더 삭제 API 호출 및 UI 업데이트
async function deleteFolder(folder) {
  try {
    await api.delete(`/project_folder/${folder.id}`, { withCredentials: true })
    // 삭제 후 폴더 목록 새로 불러오기
    fetchFolders()
    // 만약 삭제된 폴더가 선택된 폴더라면 초기화
    if (selectedFolder.value && selectedFolder.value.id === folder.id) {
      selectedFolder.value = null
    }
  } catch (error) {
    console.error('폴더 삭제 에러:', error)
  }
}
</script>

<style scoped>
.knowledge-docs {
  padding: 0 1rem 1rem 1rem;
}

/* 상단 버튼 영역 */
.top-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.folder-btn,
.filter-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
}

.folder-btn:hover,
.filter-btn:hover {
  background-color: #e0e0e0;
}

/* 폴더 드롭다운 영역 */
.folder-dropdown {
  display: flex;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem;
  width: fit-content;
}

.dropdown-icon {
  margin-right: 0.5rem;
}

/* 드롭다운 리스트 스타일 */
.folder-dropdown-list {
  list-style: none;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  position: absolute;
  z-index: 100;
}

.folder-dropdown-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
}

.folder-dropdown-list li:hover {
  background-color: #f0f0f0;
}

/* 컨트롤 영역 (세 개의 버튼) */
.control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.left-buttons button,
.right-buttons button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  margin-right: 0.5rem;
}

.left-buttons button:hover,
.right-buttons button:hover {
  background-color: #e0e0e0;
}

/* 테이블 스타일 */
.docs-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.docs-table th,
.docs-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}

.docs-table th {
  background-color: #f0f0f0;
}

.docs-table th:last-child,
.docs-table td:last-child {
  border: none;
  background: none;
  text-align: center;
  width: 6%;
}

.remove-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  color: #fff;
  background-color: #d9534f;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #c9302c;
}

.delete-folder-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  color: #fff;
  background-color: #d9534f;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-folder-btn:hover {
  background-color: #c9302c;
}

.loading {
  padding: 1rem;
  font-size: 1.2rem;
  text-align: center;
}
</style>
