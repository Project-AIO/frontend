<template>
  <div>
    <h1>계정</h1>
    <!-- 계정 생성 폼 -->
    <div class="create-account">
      <label>
        이름:
        <input
            type="text"
            v-model="name"
            placeholder="이름을 입력하세요"
            maxlength="50"
            required
        />
      </label>
      <label>
        역할:
        <select v-model="role" required>
          <option value="">선택하세요</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
          <option value="GUEST">GUEST</option>
        </select>
      </label>
      <button @click="createAccount">생성</button>
    </div>

    <!-- 계정 목록 테이블 -->
    <table>
      <thead>
      <tr>
        <th>관리자ID</th>
        <th>계정ID</th>
        <th>이름</th>
        <th>역할</th>
        <th>만료일자</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="account in userStore.userList" :key="account.account_id">
        <td>{{ account.admin_id }}</td>
        <td>{{ account.account_id }}</td>
        <td>{{ account.name }}</td>
        <td>{{ account.role }}</td>
        <td>{{ account.expire_dt }}</td>
        <td>
          <button @click="deleteAccount(account)">삭제</button>
        </td>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/index.js'
import { useUserStore } from "../stores/userStore.js";
import { useAdminStore } from "../stores/adminStore.js";

const userStore = useUserStore()
const adminStore = useAdminStore()

// 테이블 데이터
const currentPage = ref(1)
const pageLimit = 20

// 생성 폼 입력값
const role = ref('')
const name = ref('')

// 현재 선택된 프로젝트에 속한 계정 목록 조회
async function fetchData() {
  try {
    await userStore.fetchUsers(currentPage.value)
  } catch (error) {
    console.error('데이터 불러오기 에러:', error)
  }
}

onMounted(() => {
  fetchData()
})

async function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    await userStore.fetchUsers(currentPage.value)
  }
}

async function nextPage() {
  if (userStore.userList.length === pageLimit) {
    currentPage.value++
    await userStore.fetchUsers(currentPage.value)
  }
}

// 계정 생성 함수: 이름과 역할만 보내고, ID 생성은 백엔드에서 처리
async function createAccount() {
  if (!role.value || !name.value) {
    alert('모든 필드를 입력해주세요.')
    return
  }
  // 그룹은 입력폼에 없으므로 빈 문자열이나 백엔드 기본값 사용
  const newAccount = {
    admin_id: adminStore.admin_id,
    name: name.value,
    role: role.value
  }

  try {
    await userStore.addUser(newAccount)
    currentPage.value = 1
    // 3. 최신 데이터로 갱신
    await fetchData(currentPage.value);

    // 마지막 페이지로 이동 로직 (백엔드에서 전체 계정 수 받아오고 싶다)

    // 입력 폼 초기화
    role.value = '';
    name.value = '';
  } catch (error) {
    console.error('계정 생성 에러:', error)
  }
}

// 계정 삭제 함수
const deleteAccount = async (account) => {
  try {
    await userStore.deleteUser(account.account_id)
    await fetchData(currentPage.value)
    // 현재 페이지에 데이터가 없고, 1페이지 이상일 경우 마지막 페이지(바로 이전 페이지)로 이동
    if (userStore.userList.length === 0 && currentPage.value > 1) {
      currentPage.value--
      await fetchData(currentPage.value)
    }
  } catch (error) {
    console.error('삭제 에러:', error)
  }
}
</script>

<style scoped>
.create-account {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.create-account label {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 25%;
}
.create-account input,
.create-account select {
  padding: 9px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80%;
}
.create-account button {
  padding: 6px 12px;
  background-color: #42b983;
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  background-color: #f2f2f2;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
table th:last-child,
table td:last-child {
  border: none;
  background: none;
  width: 10%;
}
button {
  margin-right: 5px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  opacity: 0.8;
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