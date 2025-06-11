<template>
    <div class="table-container">
        <div class="filter-container">
            <el-input v-model="filterData.keyword" placeholder="输入教练姓名搜索" class="filter-item" />
            <el-select v-model="filterData.level" placeholder="选择教练级别" clearable class="filter-item">
                <el-option label="初级教练" value="junior" />
                <el-option label="中级教练" value="middle" />
                <el-option label="高级教练" value="senior" />
            </el-select>
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
        </div>
        <el-table :data="filteredTableData" style="width: 100%">
            <el-table-column prop="id" label="教练ID" align="center" width="120" />
            <el-table-column prop="name" label="教练名称" align="center" width="120" />
            <el-table-column prop="brief" label="教练简介" align="center" width="200" />
            <el-table-column prop="focus" label="关注" align="center" width="120" />
            <el-table-column prop="comment" label="评价" align="center" width="120" />
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

interface Coach {
    id: number
    name: string
    brief: string
    focus: number
    comment: number
}

const tableData = ref<Coach[]>([
    { id: 1, name: '张三', brief: '资深教练', focus: 100, comment: 50 },
    { id: 2, name: '李四', brief: '专业教练', focus: 200, comment: 80 },
    { id: 3, name: '王五', brief: '健身达人', focus: 150, comment: 60 },
])

const filterData = ref({
    keyword: '',
    level: ''
})

const filteredTableData = computed(() => {
    const { keyword, level } = filterData.value
    return tableData.value.filter(item => {
        const matchKeyword = !keyword ||
            item.name.toLowerCase().includes(keyword.toLowerCase()) ||
            item.brief.toLowerCase().includes(keyword.toLowerCase())
        const matchLevel = !level || item.brief.includes(level)
        return matchKeyword && matchLevel
    })
})

const handleFilter = () => {
    // 不需要额外处理，computed会自动更新
}

const resetFilter = () => {
    filterData.value.keyword = ''
    filterData.value.level = ''
}

const handleEdit = (row: User) => {
    console.log('编辑用户:', row)
}

const handleDelete = (row: User) => {
    console.log('删除用户:', row)
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