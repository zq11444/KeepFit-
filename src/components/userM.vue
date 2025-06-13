<template>
    <div class="table-container">
        <div class="filter-container">
            <el-input v-model="filterData.keyword" placeholder="输入id或者用户名搜索" class="filter-item" />
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
        </div>
        <el-table :data="paginatedData" style="width: 100%">
            <el-table-column prop="uid" label="用户ID" align="center" width="200" />
            <el-table-column prop="userName" label="用户名" align="center" width="300" />
            <el-table-column label="操作" align="center" width="300">
                <template #default="scope">
                    <el-button type="primary" @click="handleEdit(scope.row)" size="small">
                        编辑
                    </el-button>
                    <el-button type="danger" @click="confirmDelete(scope.row)" size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加分页器 -->
        <div class="pagination-container">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[15, 30, 50, 100]"
                :total="filteredTableData.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                background
            />
        </div>

        <!-- 删除确认对话框 -->
        <el-dialog
            v-model="deleteDialogVisible"
            title="确认删除"
            width="30%"
        >
            <span>确定要删除该用户吗？此操作不可恢复。</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="deleteDialogVisible = false">取消</el-button>
                    <el-button type="danger" @click="handleDeleteConfirm" :loading="deleting">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 编辑用户信息对话框 -->
        <UserEditDialog 
            v-model="editDialogVisible"
            :user="currentUser"
            @update="handleEditSubmit"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import UserEditDialog from './dialogs/UserEditDialog.vue'

interface User {
    uid: number
    userName: string
}

const tableData = ref<User[]>([])

const filterData = ref({
    keyword: ''
})

const filteredTableData = computed(() => {
    const keyword = filterData.value.keyword.toLowerCase()
    if (!keyword) return tableData.value

    return tableData.value.filter(item =>
        item.userName.toLowerCase().includes(keyword) ||
        item.uid.toString().includes(keyword)
    )
})

const editDialogVisible = ref(false)

const handleEdit = (row: User) => {
    currentUser.value = { ...row }
    editDialogVisible.value = true
}

const deleteDialogVisible = ref(false)
const deleting = ref(false)
const currentUser = ref<User | null>(null)

const confirmDelete = (user: User) => {
    currentUser.value = user
    deleteDialogVisible.value = true
}

const handleDeleteConfirm = async () => {
    if (!currentUser.value) return

    deleting.value = true
    try {
        const response = await axios.delete(`http://localhost:5000/api/manager/user_data/${currentUser.value.uid}`)
        if (response.status === 200) {
            ElMessage.success('删除成功')
            // 从表格数据中移除该用户
            tableData.value = tableData.value.filter(user => user.uid !== currentUser.value?.uid)
            deleteDialogVisible.value = false
        }
    } catch (error) {
        console.error('删除用户失败:', error)
        ElMessage.error('删除失败，请重试')
    } finally {
        deleting.value = false
        currentUser.value = null
    }
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

// 添加获取用户数据的函数
const fetchUserData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/manager/user_data')
        if (response.status === 200) {
            tableData.value = response.data
            console.log('获取到的用户数据:', response.data)
        }
    } catch (error) {
        console.error('获取用户数据失败:', error)
    }
}

// 在组件挂载时获取数据
onMounted(() => {
    fetchUserData()
})

// 添加分页相关的响应式数据
const currentPage = ref(1)
const pageSize = ref(15)

// 计算分页后的数据
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredTableData.value.slice(start, end)
})

// 分页处理方法
const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
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

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: #6252dd;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled):hover) {
    color: #6252dd;
}
</style>