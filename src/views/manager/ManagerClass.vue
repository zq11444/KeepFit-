<template>
    <div class="manager-container">
        <sidebar class="sidebar" />
        <div class="main-content">
            <classM />
        </div>
    </div>
</template>

<script setup lang="ts">
import sidebar from '@/components/sidebar.vue'
import classM from '@/components/videoM.vue'
</script>

<style scoped>
.manager-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
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
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: calc(100% - 84px);
    max-width: 1200px;
    margin: 0 auto;
    margin-left: 84px;
    overflow: hidden;  // 添加这行
}
</style>