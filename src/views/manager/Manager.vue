<template>
    <div class="manager-container">
        <sidebar class="sidebar" />
        <div class="main-content">
            <Home />
        </div>
    </div>
</template>

<script setup lang="ts">
import sidebar from '@/components/sidebar.vue'
import Home from '@/components/Home.vue'
</script>

<style scoped>
.manager-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100vw;
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
    width: 100vw;
    height: 100vh;
    margin-left: 200px;
}
</style>