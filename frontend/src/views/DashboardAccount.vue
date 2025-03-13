<template>
  <div>
    <!-- 탭 메뉴: 상대 경로 사용 -->
    <nav class="tabs">
      <router-link to="admin" class="tab" active-class="active-tab">관리자 프로필</router-link>
      <router-link to="users" class="tab" active-class="active-tab">사용자 계정 관리</router-link>
    </nav>

    <!-- 자식 컴포넌트를 렌더링, selectedProjectId prop 전달 -->
    <router-view/>
  </div>
</template>

<script setup>
</script>

<style scoped>
.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
}

.tab {
  text-decoration: none;
  color: inherit;
  margin-top: 1rem;
  padding: 0 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.9rem;
}

.active-tab {
  font-weight: bold;
  border-bottom: 2.5px solid #000;
}
</style>
