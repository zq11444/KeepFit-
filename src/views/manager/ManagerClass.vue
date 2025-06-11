<template>
    <div class="manager-container">
        <sidebar class="sidebar" />
        <div class="main-content">
            <h2>课程管理</h2>
            <classM />
        </div>
    </div>
</template>

<script setup lang="ts">
import sidebar from '@/components/sidebar.vue'
import classM from '@/components/classM.vue'
</script>

<style scoped>
.manager-container {
    display: flex;
    width: 100%;
    min-height: 100vh;
}

.sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
}
</style>