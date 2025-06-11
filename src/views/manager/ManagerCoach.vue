<template>
    <div class="manager-container">
        <sidebar class="sidebar" />
        <div class="main-content">
            <h2>教练管理</h2>
            <coachM />
        </div>
    </div>
</template>
<script setup lang="ts">
import sidebar from '@/components/sidebar.vue'
import coachM from '@/components/coachM.vue'
</script>
<style scoped>
.manager-container {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
}

.main-content {
    flex: 1;
    margin-left: 84px;
    padding: 20px 30px;
    overflow-x: hidden;
}
</style>