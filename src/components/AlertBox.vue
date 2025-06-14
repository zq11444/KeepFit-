<template>
    <transition name="alert-fade">
        <div v-if="visible" :class="['alert-box', type]">
            <el-icon class="alert-icon">
                <component :is="icon"></component>
            </el-icon>
            <span class="alert-message">{{ message }}</span>
            <el-icon class="close-icon" @click="close">
                <Close />
            </el-icon>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Close, SuccessFilled, WarningFilled, CircleCloseFilled, InfoFilled } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'info'
    },
    duration: {
        type: Number,
        default: 3000
    }
})

const visible = ref(true)
const icon = computed(() => {
    switch (props.type) {
        case 'success': return SuccessFilled
        case 'warning': return WarningFilled
        case 'error': return CircleCloseFilled
        default: return InfoFilled
    }
})

const close = () => {
    visible.value = false
}

if (props.duration > 0) {
    setTimeout(close, props.duration)
}
</script>

<style scoped>
.alert-box {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 300px;
    max-width: 500px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    backdrop-filter: blur(8px);
    justify-content: center;
    text-align: center;
}

.alert-message {
    flex: 1;
    font-size: 14px;
    color: #fff;
    text-align: center;
}

.alert-icon {
    font-size: 20px;
    color: #fff;
}

.close-icon {
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.close-icon:hover {
    opacity: 1;
}

/* 类型样式 */
.success {
    background: linear-gradient(120deg, #4CAF50, #45a049);
}

.warning {
    background: linear-gradient(120deg, #ff9800, #f57c00);
}

.error {
    background: linear-gradient(120deg, #f44336, #d32f2f);
}

.info {
    background: linear-gradient(120deg, #6252dd, #9747FF);
}

/* 动画效果 */
.alert-fade-enter-active,
.alert-fade-leave-active {
    transition: all 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
    transform: translate(-50%, -20px);
    opacity: 0;
}
</style>
