<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>새 프로젝트 생성</h2>
      <label>
        프로젝트 명:
        <input type="text" v-model="projectName" maxlength="50" placeholder="프로젝트 이름 입력" required/>
      </label>
      <div class="buttons">
        <button @click="addProject">생성</button>
        <button @click="cancel">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectStore } from '../stores/projectStore.js'

const emits = defineEmits(['created', 'cancel'])
const projectStore = useProjectStore()
const projectName = ref('')

async function addProject() {
  if (!projectName.value.trim()) {
    alert('프로젝트 이름을 입력해주세요.')
    return
  }
  try {
    const response = await projectStore.createProject({ project_name: projectName.value.trim() })
    emits('created', response.data)
  } catch (error) {
    console.error('프로젝트 생성 에러:', error)
    alert('프로젝트 생성에 실패했습니다.')
  }
}

const cancel = () => {
  emits('cancel')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  z-index: 2000;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

label {
  display: block;
  margin-bottom: 15px;
  font-size: 1rem;
}

input {
  width: 93%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:first-of-type {
  background-color: #42b983;
  color: #fff;
}

button:last-of-type {
  background-color: #ccc;
}
</style>
