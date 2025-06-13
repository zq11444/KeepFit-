<template>
    <div class="manager-container">
        <sidebar class="sidebar" />
        <div class="main-content">
            <userM />
        </div>
    </div>
</template>
<script setup lang="ts">
import sidebar from '@/components/sidebar.vue'
import userM from '@/components/userM.vue'
</script>
<style scoped>
.manager-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
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
    width: 800px;
    max-width: 1200px;
    margin: 0 auto;
    margin-left: 84px;
}
</style>