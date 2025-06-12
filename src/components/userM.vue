<template>
    <div class="table-container">
        <div class="filter-container">
            <el-input v-model="filterData.keyword" placeholder="输入关键词搜索" class="filter-item" />
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
        </div>
        <el-table :data="filteredTableData" style="width: 100%">
            <el-table-column prop="id" label="用户ID" align="center" width="240" />
            <el-table-column prop="name" label="用户名" align="center" width="240" />
            <el-table-column label="操作" align="center" width="240">
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

interface User {
    id: number
    name: string
}

const tableData = ref<User[]>([
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' },
])

const filterData = ref({
    keyword: ''
})

const filteredTableData = computed(() => {
    const keyword = filterData.value.keyword.toLowerCase()
    if (!keyword) return tableData.value

    return tableData.value.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.id.toString().includes(keyword)
    )
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
}
</script>

<style scoped>
.table-container {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
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