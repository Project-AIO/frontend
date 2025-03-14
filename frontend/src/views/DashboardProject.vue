<template>
  <div class="settings-project">
    <!-- 프로젝트 섹션 -->
    <h2 class="section-title">프로젝트</h2>
    <div class="project-cards">
      <div
          v-for="project in sortedProjects"
          :key="project.project_id"
          :class="['project-card', { selected: project === projectStore.selectedProject.value }]"
          @click="selectProject(project)"
      >
        <div class="card-header">
          <span v-if="project === projectStore.selectedProject.value">(Selected)</span>
          <!-- Remove 버튼: 클릭 시 이벤트 전파 중지 -->
          <span class="remove" @click.stop="handleDeleteProject(project.project_id)">Remove</span>
        </div>
        <div class="project-name">{{ project.project_id }}</div>
        <div class="project-name">{{ project.project_name }}</div>
        <div class="project-info">
          Create - {{ project.create_dt }}
        </div>
      </div>
      <!-- 프로젝트 추가 카드 -->
      <div class="project-card add-project" @click="openNewProjectModal">
        (+) 프로젝트 추가
      </div>
    </div>

    <hr class="divider" />

    <!-- 사용자 설정 영역 -->
    <h2 class="section-title">사용자 설정</h2>
    <div class="user-settings">
      <div class="user-settings-header">
        <button class="save-button" @click="saveProjectAccounts">저장</button>
      </div>
      <!-- 사용자 계정 테이블 -->
      <table class="user-table">
        <thead>
        <tr>
          <th>
            <input type="checkbox" @change="toggleAll" :checked="allChecked" />
          </th>
          <th>계정ID</th>
          <th>그룹명</th>
          <th>이름</th>
          <th>역할</th>
          <th>만료일자</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="account in userStore.userList" :key="account.account_id">
          <td>
            <input
                type="checkbox"
                :value="account.account_id"
                v-model="selectedAccountIds"
            />
          </td>
          <td>{{ account.account_id }}</td>
          <td>{{ account.group}}</td>
          <td>{{ account.name }}</td>
          <td>{{ account.role }}</td>
          <td>{{ account.expired_time }}</td>
        </tr>
        </tbody>
      </table>
      <!-- 페이지네이션 컨트롤 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
        <span>Page {{ currentPage }}</span>
        <button @click="nextPage" :disabled="userStore.userList.length < pageLimit">Next</button>
      </div>
    </div>

    <!-- New Project Modal -->
    <NewProjectModal
        v-if="showNewProjectModal"
        @cancel="closeNewProjectModal"
        @created="handleNewProjectCreated"
    />
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useProjectStore} from "../stores/projectStore.js"
import {useUserStore} from "../stores/userStore.js"
import {useAdminStore} from "../stores/adminStore.js";
import NewProjectModal from './NewProjectModal.vue'

// 스토어 인스턴스
const projectStore = useProjectStore()
const userStore = useUserStore()
const adminStore = useAdminStore()

// 프로젝트 관련 상태
const projects = ref([])
const sortedProjects = computed(() =>
    projects.value.slice().sort((a, b) => a.project_id - b.project_id)
)
const showNewProjectModal = ref(false)

// 사용자 테이블 관련 상태
const userList = ref([])
const selectedAccountIds = ref([])
const initialProjectAccountIds = ref([])
const currentPage = ref(1)
const pageLimit = 20

// 모든 체크박스 체크 여부 (현재 페이지 기준)
const allChecked = computed(() =>
    userStore.userList.length > 0 && userStore.userList.every(acc => selectedAccountIds.value.includes(acc.account_id))
)

/* ------------------- 프로젝트 관련 함수 ------------------- */

// 프로젝트 목록을 백엔드에서 불러와 상태 업데이트
async function loadProjects() {
  try {
    projects.value = await projectStore.fetchProjects()
    if (projects.value.length === 0) {
      projectStore.selectedProject.value = null
    } else if (!projectStore.selectedProject) {
      projectStore.selectedProject.value = projects[0]
    }
    selectedAccountIds.value = []
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

// 프로젝트 선택 시, 선택된 프로젝트로 상태 업데이트하고 해당 프로젝트의 사용자 불러오기
async function selectProject(project) {
  projectStore.selectedProject.value = project
  currentPage.value = 1
  await loadProjectUsers()
}

// 프로젝트 삭제 후, 목록 갱신 및 선택된 프로젝트 초기화 처리
async function handleDeleteProject(projectId) {
  // 선택된 프로젝트가 삭제되는 경우
  if (projectStore.selectedProject.value && projectId === projectStore.selectedProject.value.project_id) {
    currentPage.value = 1
    projectStore.selectedProject.value = null
  }
  await projectStore.removeProject(projectId)
  await loadProjects()
  await loadUsers()
}

/* ------------------- 신규 프로젝트 모달 관련 함수 ------------------- */
function openNewProjectModal() {
  showNewProjectModal.value = true
}
function closeNewProjectModal() {
  showNewProjectModal.value = false
}
async function handleNewProjectCreated() {
  try {
    currentPage.value = 1
    // 신규 프로젝트 생성 후 전체 목록 재조회
    await loadProjects()
    // 선택된 프로젝트를 마지막 생성된 프로젝트로 설정
    if (projects.value.length > 0) {
      projectStore.selectedProject.value = projects.value[projects.value.length - 1]
    }
    closeNewProjectModal()
    await loadProjectUsers()
  } catch (error) {
    console.error('Error creating project:', error)
  }
}

/* ------------------- 사용자 계정 및 프로젝트 계정 관련 함수 ------------------- */

// 전체 사용자(계정) 조회 (페이지네이션 적용)
async function loadUsers() {
  try {
    await userStore.fetchUsers(currentPage.value);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// 선택된 프로젝트에 귀속된 계정 조회 및 체크박스 초기화
async function loadProjectUsers() {
  if (!projectStore.selectedProject.value || !projectStore.selectedProject.value.project_id) return
  try {
    await userStore.fetchProjectUsers(projectStore.selectedProject.value.project_id, currentPage.value)
    updateCheckboxSelection()
  } catch (error) {
    console.error('Error fetching project users:', error)
  }
}

// 현재 페이지의 사용자 중, 해당 프로젝트에 귀속된 계정을 체크 상태로 업데이트
function updateCheckboxSelection() {
  selectedAccountIds.value = userStore.userList
      .filter(acc => userStore.projectAccountIds.includes(acc.account_id))
      .map(acc => acc.account_id)
}

// 저장 버튼 클릭 시, 체크박스 변경 내역을 기반으로 프로젝트 계정 추가/삭제 처리
// async function saveProjectAccounts() {
//   if (!projectStore.selectedProject.value || !projectStore.selectedProject.value.project_id) return
//   const projectId = projectStore.selectedProject.value.project_id
//   const currentPageAccountIds = userStore.userList.map(acc => acc.account_id)
//   const accountsToAdd = selectedAccountIds.value.filter(
//       id => !initialProjectAccountIds.value.includes(id)
//   )
//   const accountsToDelete = currentPageAccountIds.filter(
//       id => initialProjectAccountIds.value.includes(id) && !selectedAccountIds.value.includes(id)
//   )
//   try {
//     if (accountsToAdd.length > 0) {
//       await userStore.addProjectUser(projectId, accountsToAdd)
//     }
//     if (accountsToDelete.length > 0) {
//       await userStore.deleteProjectUser(projectId, accountsToDelete)
//     }
//     // 변경 후 최신 상태 반영
//     await loadProjectUsers()
//   } catch (error) {
//     console.error('Error saving project accounts:', error)
//   }
// }
async function saveProjectAccounts() {
  if (!projectStore.selectedProject.value || !projectStore.selectedProject.value.project_id) return;
  const projectId = projectStore.selectedProject.value.project_id;

  // 기존에 저장된 프로젝트 귀속 계정 ID 목록은 userStore.projectAccountIds로 관리
  const initialSet = new Set(userStore.projectAccountIds);
  // 현재 체크박스 선택 상태 배열
  const currentSet = new Set(selectedAccountIds.value);

  // 추가할 계정: 현재 선택에는 있으나, 기존에는 없던 계정들
  const accountsToAdd = [...currentSet].filter(id => !initialSet.has(id));
  // 삭제할 계정: 기존에는 있었으나, 현재 선택에는 없는 계정들
  const accountsToDelete = [...initialSet].filter(id => !currentSet.has(id));

  try {
    if (accountsToAdd.length > 0) {
      await userStore.addProjectUser(projectId, accountsToAdd);
    }
    if (accountsToDelete.length > 0) {
      await userStore.deleteProjectUser(projectId, accountsToDelete);
    }
    // 변경 후 최신 상태 재조회 (이 과정에서 userStore.projectAccountIds가 업데이트 되어야 함)
    await loadProjectUsers();
  } catch (error) {
    console.error('Error saving project accounts:', error);
  }
}

/* ------------------- 체크박스 및 페이지네이션 함수 ------------------- */

// 전체 선택/해제 토글
function toggleAll(event) {
  if (event.target.checked) {
    selectedAccountIds.value = userStore.userList.map(acc => acc.account_id)
  } else {
    selectedAccountIds.value = []
  }
}

// 페이지네이션 처리
async function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    if (projectStore.selectedProject.value) {
      await loadProjectUsers()
    } else{
      await loadUsers()
    }
    updateCheckboxSelection()
  }
}
async function nextPage() {
  if (userStore.userList.length === pageLimit) {
    currentPage.value++
    if (projectStore.selectedProject.value) {
      await loadProjectUsers()
    } else{
      await loadUsers()
    }
    updateCheckboxSelection()
  }
}

/* ------------------- 초기 데이터 로드 ------------------- */
onMounted(async () => {
  await loadProjects()
  await loadUsers()
  await loadProjectUsers()
})

// 사용자 목록 변경 시 체크박스 업데이트
watch(userList, () => {
  updateCheckboxSelection()
})
</script>

<style scoped>
.settings-project {
  margin: 0 auto;
  font-family: sans-serif;
  color: #000;
  position: relative;
}

/* 섹션 제목 */
.section-title {
  font-size: 16px;
  margin-bottom: 10px;
}

/* 프로젝트 카드 영역 */
.project-cards {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.project-card {
  width: 200px;
  height: 150px;
  background-color: #efefef;
  padding: 10px;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
}

.project-card.selected {
  border: 2px solid #1abc9c;
}

.add-project {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px dashed #aaa;
}

/* 카드 헤더 (Selected / Remove) */
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.remove {
  cursor: pointer;
  color: #666;
}

/* 프로젝트 이름 및 정보 */
.project-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

.project-info {
  font-size: 12px;
  line-height: 1.4;
}

/* 구분선 */
.divider {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #000;
}

/* 사용자 설정 영역 */
.user-settings {
  background-color: #efefef;
  padding: 10px;
  box-sizing: border-box;
}

/* 저장 버튼 및 헤더 */
.user-settings-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.save-button {
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}

/* 사용자 계정 테이블 */
.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  font-size: 12px;
}

/* 페이지네이션 */
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
