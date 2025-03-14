<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>폴더 생성</h2>
      <input
          type="text"
          v-model="folderName"
          placeholder="폴더 이름을 입력하세요"
      />
      <!-- 폴더 이름 미입력 시 경고 메시지 출력 -->
      <p v-if="warningMessage" class="warning">{{ warningMessage }}</p>
      <div class="modal-actions">
        <button class="create-btn" @click="createFolder">생성</button>
        <button class="cancel-btn" @click="cancel">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const folderName = ref('')
const warningMessage = ref('')

const emit = defineEmits(['created', 'cancel'])

function createFolder() {
  if (!folderName.value.trim()) {
    warningMessage.value = '폴더 이름을 입력해주세요.'
    return
  }
  emit('created', folderName.value.trim())
  folderName.value = ''
  warningMessage.value = ''
}

function cancel() {
  emit('cancel')
  folderName.value = ''
  warningMessage.value = ''
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.modal h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.modal input {
  width: 94%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.warning {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.create-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.create-btn {
  background-color: #247191;
  color: white;
}

.create-btn:hover {
  background-color: #1a5d73;
}

.cancel-btn {
  background-color: #ccc;
  color: #333;
}

.cancel-btn:hover {
  background-color: #bbb;
}
</style>
