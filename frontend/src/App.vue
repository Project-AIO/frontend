<template>
  <div>
    <router-view /> <!-- 현재 경로에 맞는 페이지 표시 -->
  </div>
</template>

<script setup>
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watchEffect(() => {
  document.title = route.meta.title || '기본 제목'
})
</script>


<style>
</style>
