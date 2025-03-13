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
        <th>계정ID</th>
        <th>그룹</th>
        <th>역할</th>
        <th>이름</th>
        <th>작업</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td>{{ row.account_id }}</td>
        <td>{{ row.group }}</td>
        <td>{{ row.role }}</td>
        <td>{{ row.name }}</td>
        <td>
          <button @click="deleteAccount(row)">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/index.js'
import { useProjectStore } from '../stores/projectStore.js'

const projectStore = useProjectStore()

// 프로젝트 선택 여부에 따라 projectId를 계산
const projectId = ref(projectStore.selectedProject.value?.project_id)

// 테이블 데이터
const rows = ref([])

// 생성 폼 입력값
const role = ref('')
const name = ref('')

// 현재 선택된 프로젝트에 속한 계정 목록 조회
const fetchData = async () => {
  try {
    // 여기부터 수정하기
    // 예시: /projects/:projectId/accounts 엔드포인트로 조회 (백엔드에서 ID 생성 및 기본값 채움)
    const response = await api.get(`/projects/${projectStore.selectedProject.value.project_id}/accounts`)
    // 백엔드가 생성한 계정 객체 배열을 반환한다고 가정합니다.
    rows.value = response.data.map(item => ({
      ...item,
      account_id: item.account_id || item.id  // 계정 ID가 없으면 id를 사용
    }))
  } catch (error) {
    console.error('데이터 불러오기 에러:', error)
  }
}

onMounted(() => {
  fetchData()
})

// 계정 생성 함수: 이름과 역할만 보내고, ID 생성은 백엔드에서 처리
const createAccount = async () => {
  if (!role.value || !name.value) {
    alert('모든 필드를 입력해주세요.')
    return
  }
  // 그룹은 입력폼에 없으므로 빈 문자열이나 백엔드 기본값 사용
  const newAccount = {
    name: name.value,
    role: role.value
  }

  try {
    // 1. /accounts 엔드포인트로 계정 생성 (백엔드에서 id, account_id 생성)
    const accountResponse = await api.post('/accounts', newAccount)
    const createdAccount = accountResponse.data;

    // 3. 최신 데이터로 갱신
    await fetchData();

    // 입력 폼 초기화
    role.value = '';
    name.value = '';
  } catch (error) {
    console.error('계정 생성 에러:', error)
  }
}

// 계정 삭제 함수
const deleteAccount = async (row) => {
  try {
    await api.delete(`/accounts/${row.id}`)
    rows.value = rows.value.filter(item => item.id !== row.id)
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
  width: 20%;
}
.create-account input,
.create-account select {
  padding: 5px;
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
</style>