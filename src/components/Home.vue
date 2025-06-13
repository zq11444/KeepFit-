<template>
    <div class="home-container">
        <div class="welcome-section">
            <h2>欢迎回来，管理员</h2>
            <p>{{ currentTime }}</p>
        </div>

        <div class="stats-grid">
            <el-card class="stats-card" v-for="(stat, index) in statsData" :key="index">
                <div class="stats-content">
                    <div class="stats-icon" :style="{ background: stat.color }">
                        <el-icon :size="24">
                            <component :is="stat.icon" />
                        </el-icon>
                    </div>
                    <div class="stats-info">
                        <div class="stats-value">{{ stat.value }}</div>
                        <div class="stats-label">{{ stat.label }}</div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Trophy, Calendar, Coin } from '@element-plus/icons-vue'
import axios from 'axios'

const currentTime = ref('')
const userCount = ref('0')

const statsData = ref([
    { label: '总用户数', value: '0', icon: 'User', color: 'linear-gradient(135deg, #6252dd, #9747FF)' },
    { label: '教练数量', value: '0', icon: 'Trophy', color: 'linear-gradient(135deg, #FF6B6B, #FFB4B4)' },
    { label: '课程数量', value: '0', icon: 'Calendar', color: 'linear-gradient(135deg, #4ECDC4, #7EE8DF)' },
    { label: '本月收入', value: '￥25,688', icon: 'Coin', color: 'linear-gradient(135deg, #FFB86C, #FFD93D)' }
])

const fetchUserCount = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/status/total_counts')
        if (response.data.code === 200 && response.data.message === "Success") {
            statsData.value[0].value = response.data.data.total_users.toString()
            statsData.value[1].value = response.data.data.total_coaches.toString()
            statsData.value[2].value = response.data.data.total_coach_courses.toString()
        }
    } catch (error) {
        console.error('获取用户数量失败:', error)
        statsData.value[0].value = '0'
        statsData.value[1].value = '0'
        statsData.value[2].value = '0'
    }
}

const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(() => {
    updateTime()
    setInterval(updateTime, 60000)
    fetchUserCount() // 获取用户数量
})
</script>

<style scoped>
.home-container {
    padding: 30px;
    background: white;
    min-height: calc(100vh - 60px);
    border-radius: 20px;
}

.welcome-section {
    margin-bottom: 40px;
    padding: 30px;
    background: linear-gradient(120deg, #6252dd, #9747FF);
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(98, 82, 221, 0.2);
    position: relative;
    overflow: hidden;
}

.welcome-section::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
    transform: rotate(45deg);
}

.welcome-section h2 {
    font-size: 32px;
    color: #ffffff;
    margin-bottom: 12px;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-section p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
}

.stats-card {
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
}

.stats-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 35px rgba(98, 82, 221, 0.15);
}

.stats-content {
    display: flex;
    align-items: center;
    padding: 20px;
}

.stats-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24px;
    color: #fff;
    transition: all 0.4s ease;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stats-card:hover .stats-icon {
    transform: scale(1.1) rotate(5deg);
}

.stats-info {
    flex: 1;
}

.stats-value {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #6252dd, #9747FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
}

.stats-label {
    font-size: 16px;
    color: #666;
    letter-spacing: 0.5px;
    font-weight: 500;
}

:deep(.el-card__body) {
    padding: 0;
}
</style>
