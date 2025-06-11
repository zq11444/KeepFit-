<template>
    <div class="table-container">
        <div class="filter-container">
            <el-input v-model="filterData.keyword" placeholder="输入课程名称搜索" class="filter-item" />
            <el-select v-model="filterData.type" placeholder="选择课程类型" clearable class="filter-item">
                <el-option label="有氧运动" value="aerobic" />
                <el-option label="力量训练" value="strength" />
                <el-option label="柔韧性训练" value="flexibility" />
            </el-select>
            <el-select v-model="filterData.difficulty" placeholder="选择难度等级" clearable class="filter-item">
                <el-option v-for="i in 5" :key="i" :label="`${i}星`" :value="i" />
            </el-select>
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
        </div>
        <el-table :data="filteredTableData" style="width: 100%">
            <el-table-column prop="id" label="课程ID" align="center" width="120" />
            <el-table-column prop="name" label="课程标题" align="center" width="120" />
            <el-table-column prop="type" label="类型" align="center" width="200" />
            <el-table-column prop="diffculty" label="难度" align="center" width="120" />
            <el-table-column label="操作" align="center" width="200">
                <template #default="scope">
                    <el-button type="primary" @click="handleEdit(scope.row)" size="small">
                        编辑
                    </el-button>
                    <el-button type="danger" @click="handleDelete(scope.row)" size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Class {
    id: number
    name: string
    type: string
    diffculty: number
}

const tableData = ref<Class[]>([
    { id: 1, name: '1', type: '有氧运动', diffculty: 3 },
    { id: 2, name: '2', type: '力量训练', diffculty: 5 },
    { id: 3, name: '3', type: '柔韧性训练', diffculty: 2 },
])

const filterData = ref({
    keyword: '',
    type: '',
    difficulty: ''
})

const filteredTableData = computed(() => {
    const { keyword, type, difficulty } = filterData.value
    return tableData.value.filter(item => {
        const matchKeyword = !keyword ||
            item.name.toLowerCase().includes(keyword.toLowerCase())
        const matchType = !type || item.type === type
        const matchDifficulty = !difficulty || item.diffculty === difficulty
        return matchKeyword && matchType && matchDifficulty
    })
})

const handleEdit = (row: User) => {
    console.log('编辑用户:', row)
}

const handleDelete = (row: User) => {
    console.log('删除用户:', row)
}

const handleFilter = () => {
    // 不需要额外处理，computed会自动更新
}

const resetFilter = () => {
    filterData.value.keyword = ''
    filterData.value.type = ''
    filterData.value.difficulty = ''
}
</script>

<style scoped>
.table-container {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-right: 20px;
}

:deep(.el-table) {
    width: 100% !important;
}

:deep(.el-button--primary) {
    background-color: #6252dd;
    border-color: #6252dd;
}

:deep(.el-button--primary:hover) {
    background-color: #7262ee;
    border-color: #7262ee;
}

:deep(.el-button) {
    margin: 0 5px;
}

:deep(.el-button--danger) {
    background-color: #ff4747;
    border-color: #ff4747;
}

:deep(.el-button--danger:hover) {
    background-color: #ff6b6b;
    border-color: #ff6b6b;
}

.filter-container {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
}

.filter-item {
    width: 200px;
}
</style>