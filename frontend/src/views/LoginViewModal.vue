<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>License Key</h2>
      <!-- 숫자 제한 없이 텍스트 입력 (보안상 이유로 텍스트 타입 사용) -->
      <input
          type="text"
          v-model="license_key"
          placeholder="라이센스 키를 입력하세요"
          required
      />
      <div class="buttons">
        <button @click="submitLicense">입력</button>
        <button @click="cancelLicense">취소</button>
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { licenseCheck } from "../api/admin.js"

const props = defineProps({
  accountInfo: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['licenseResult'])

const license_key = ref('')
const errorMessage = ref('')

// 입력 버튼: 입력한 라이센스 키와 accountInfo를 백엔드에 전송
async function submitLicense() {
  if (!license_key.value) {
    errorMessage.value = '라이센스 키를 입력하세요.'
    return
  }

  const licenseInfo = {
    admin_id: props.accountInfo.admin_id,
    license_key: license_key.value,
  }
  try {
    const response = await licenseCheck(licenseInfo)
    if (response.data.valid) {
      emit('licenseResult', true)
    } else {
      errorMessage.value = '라이센스 키 오류, 담당 부서에 문의해주세요.'
      emit('licenseResult', false)
    }
  } catch (err) {
    errorMessage.value = '라이센스 키 전송 중 오류가 발생했습니다.'
    emit('licenseResult', false)
  }
}

const cancelLicense = () => {
  emit('licenseResult', null)
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
  justify-content: center;
  align-items: center;
}
.modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}
.modal h2 {
  text-align: left;
  margin-bottom: 20px;
  margin-left: 15px;
}
.modal input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  box-sizing: border-box;
}
.buttons {
  display: flex;
  justify-content: space-between;
}
.buttons button {
  flex: 1;
  padding: 8px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
