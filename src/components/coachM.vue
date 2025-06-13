<template>
    <div class="table-container">
        <div class="filter-container">
            <el-button type="primary" @click="handleCreate">新增教练</el-button>
            <el-input v-model="filterData.keyword" placeholder="输入教练姓名搜索" class="filter-item" />
            <el-select v-model="filterData.level" placeholder="选择教练等级" clearable class="filter-item">
                <el-option label="一星教练" value="一星教练" />
                <el-option label="二星教练" value="二星教练" />
                <el-option label="三星教练" value="三星教练" />
            </el-select>
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
        </div>
        <el-table :data="paginatedData" style="width: 100%">
            <el-table-column prop="cid" label="教练ID" align="center" width="80" />
            <el-table-column prop="coachName" label="教练姓名" align="center" width="100" />
            <el-table-column prop="coachBrief" label="简介" align="center" width="180" show-overflow-tooltip />
            <el-table-column prop="coachTag" label="专长" align="center" width="100" />
            <el-table-column prop="coachStar" label="等级" align="center" width="100" />
            <el-table-column prop="publicity" label="关注度" align="center" width="80" />
            <el-table-column prop="comment" label="评价数" align="center" width="80" />
            <el-table-column label="操作" align="center" width="150" fixed="right">
                <template #default="scope">
                    <el-button type="primary" @click="handleEdit(scope.row)" size="small">编辑</el-button>
                    <el-button type="danger" @click="handleDelete(scope.row)" size="small">删除</el-button>
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

        <!-- 添加编辑对话框组件 -->
        <CoachEditDialog 
            v-model="editDialogVisible"
            :coach="currentCoach"
            @update="handleEditSubmit"
        />

        <!-- 删除确认对话框 -->
        <el-dialog
            v-model="deleteDialogVisible"
            title="确认删除"
            width="30%"
        >
            <span>确定要删除该教练吗？此操作不可恢复。</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="deleteDialogVisible = false">取消</el-button>
                    <el-button type="danger" @click="handleDeleteConfirm" :loading="deleting">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 添加教练创建对话框组件 -->
        <CoachCreateDialog 
            v-model="createDialogVisible"
            @created="handleCreated"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import CoachEditDialog from './dialogs/CoachEditDialog.vue'
import CoachCreateDialog from './dialogs/CoachCreateDialog.vue'
import { alert } from '@/utils/alert'

interface Coach {
    cid: number
    coachName: string
    coachBrief: string
    coachTag: string
    coachStar: string
    publicity: number
    comment: number
}

const tableData = ref<Coach[]>([])

const filterData = ref({
    keyword: '',
    level: ''
})

const filteredTableData = computed(() => {
    const { keyword, level } = filterData.value
    return tableData.value.filter(item => {
        const matchKeyword = !keyword ||
            item.coachName.toLowerCase().includes(keyword.toLowerCase()) ||
            item.coachBrief.toLowerCase().includes(keyword.toLowerCase())
        const matchLevel = !level || item.coachStar === level
        return matchKeyword && matchLevel
    })
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

const fetchCoachData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/coaches/')
        if (response.status === 200) {
            tableData.value = response.data
            console.log('获取到的教练数据:', response.data)
        }
    } catch (error) {
        console.error('获取教练数据失败:', error)
    }
}

const handleFilter = () => {
    // 不需要额外处理，computed会自动更新
}

const resetFilter = () => {
    filterData.value.keyword = ''
    filterData.value.level = ''
}

const editDialogVisible = ref(false)
const currentCoach = ref<Coach | null>(null)

const handleEdit = (row: Coach) => {
    currentCoach.value = { ...row }
    editDialogVisible.value = true
}

const handleEditSubmit = async (updatedCoach: Coach) => {
    try {
        // 更新本地数据
        const index = tableData.value.findIndex(coach => coach.cid === updatedCoach.cid)
        if (index !== -1) {
            tableData.value[index] = updatedCoach
        }
    } catch (error) {
        console.error('更新失败:', error)
        alert.error('更新失败')
    }
}

const deleteDialogVisible = ref(false)
const deleting = ref(false)

const confirmDelete = (coach: Coach) => {
    currentCoach.value = coach
    deleteDialogVisible.value = true
}

const handleDeleteConfirm = async () => {
    if (!currentCoach.value) return

    deleting.value = true
    try {
        const response = await axios.delete(`http://localhost:5000/api/manager/coach/${currentCoach.value.cid}`)
        if (response.status === 200) {
            alert.success('删除成功')
            tableData.value = tableData.value.filter(coach => coach.cid !== currentCoach.value?.cid)
            deleteDialogVisible.value = false
        }
    } catch (error) {
        console.error('删除教练失败:', error)
        alert.error('删除失败，请稍后重试')
    } finally {
        deleting.value = false
        currentCoach.value = null
    }
}

const handleDelete = (row: Coach) => {
    confirmDelete(row)
}

const createDialogVisible = ref(false)

const handleCreate = () => {
    createDialogVisible.value = true
}

const handleCreated = (newCoach: Coach) => {
    // 直接将新教练添加到表格数据中
    tableData.value.push(newCoach)
    createDialogVisible.value = false
}

const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
}

onMounted(() => {
    fetchCoachData()
})
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
    overflow-x: hidden;
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