<template>
    <div class="table-container">
        <div class="filter-container">
            <el-button type="primary" @click="handleCreate">新增视频</el-button>
            <el-input v-model="filterData.keyword" placeholder="输入课程标题搜索" class="filter-item" />
            <el-select v-model="filterData.hard" placeholder="选择难度等级" clearable class="filter-item">
                <el-option label="K1零基础" value="K1零基础" />
                <el-option label="K2初学" value="K2初学" />
                <el-option label="K3进阶" value="K3进阶" />
                <el-option label="K4强化" value="K4强化" />
                <el-option label="K5挑战" value="K5挑战" />
            </el-select>
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
        </div>
        <el-table :data="paginatedData" style="width: 100%">
            <el-table-column prop="videoid" label="视频ID" align="center" width="100" />
            <el-table-column label="教练姓名" align="center" width="120">
                <template #default="{ row }">
                    {{ getCoachName(row.coach_id) }}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="课程标题" align="center" width="180" />
            <el-table-column prop="hard" label="难度" align="center" width="120" />
            <el-table-column prop="type" label="类型" align="center" width="180" />
            <el-table-column label="操作" align="center" width="200">
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

        <!-- 添加创建视频对话框组件 -->
        <VideoCreateDialog 
            v-model="createDialogVisible"
            @created="handleCreated"
        />

        <!-- 添加编辑视频对话框组件 -->
        <VideoEditDialog 
            v-model="editDialogVisible"
            :video="currentVideo"
            :coaches="coachData"
            @update="handleEditSubmit"
        />

        <!-- 添加删除确认对话框 -->
        <el-dialog
            v-model="deleteDialogVisible"
            title="确认删除"
            width="30%"
        >
            <span>确定要删除该视频吗？此操作不可恢复。</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="deleteDialogVisible = false">取消</el-button>
                    <el-button type="danger" @click="handleDeleteConfirm" :loading="deleting">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import VideoCreateDialog from './dialogs/VideoCreateDialog.vue'
import VideoEditDialog from './dialogs/VideoEditDialog.vue'
import { alert } from '@/utils/alert'

interface Video {
    videoid: number
    coach_id: number
    title: string
    hard: string
    type: string
}

interface Coach {
    cid: number
    coachName: string
    // 其他教练属性...
}

const tableData = ref<Video[]>([])
const coachData = ref<Coach[]>([])

const filterData = ref({
    keyword: '',
    hard: ''
})

const filteredTableData = computed(() => {
    const { keyword, hard } = filterData.value
    return tableData.value.filter(item => {
        const matchKeyword = !keyword || 
            item.title.toLowerCase().includes(keyword.toLowerCase())
        const matchHard = !hard || item.hard === hard
        return matchKeyword && matchHard
    })
})

// 获取教练姓名的方法
const getCoachName = (coachId: number) => {
    const coach = coachData.value.find(coach => coach.cid === coachId)
    return coach ? coach.coachName : `未知教练(${coachId})`
}

const fetchData = async () => {
    try {
        // 并行获取视频和教练数据
        const [videoResponse, coachResponse] = await Promise.all([
            axios.get('http://localhost:5000/api/videos/'),
            axios.get('http://localhost:5000/api/coaches/')
        ])

        if (videoResponse.status === 200 && coachResponse.status === 200) {
            tableData.value = videoResponse.data
            coachData.value = coachResponse.data
            console.log('数据获取成功:', { videos: tableData.value, coaches: coachData.value })
        }
    } catch (error) {
        console.error('获取数据失败:', error)
    }
}

const handleEdit = (row: Video) => {
    currentVideo.value = { ...row }
    editDialogVisible.value = true
}

const deleteDialogVisible = ref(false)
const deleting = ref(false)

const confirmDelete = (video: Video) => {
    currentVideo.value = video
    deleteDialogVisible.value = true
}

const handleDeleteConfirm = async () => {
    if (!currentVideo.value) return

    deleting.value = true
    try {
        const response = await axios.delete(`http://localhost:5000/api/manager/coachvideo/${currentVideo.value.videoid}`)
        if (response.status === 200) {
            // 先更新本地数据
            tableData.value = tableData.value.filter(video => video.videoid !== currentVideo.value?.videoid)
            // 关闭对话框
            deleteDialogVisible.value = false
            // 使用延时确保弹窗关闭后再显示成功提示
            setTimeout(() => {
                alert.success('删除视频成功')
            }, 100)
        }
    } catch (error) {
        console.error('删除视频失败:', error)
        alert.error('删除失败，请稍后重试')
    } finally {
        deleting.value = false
        currentVideo.value = null
    }
}

const handleDelete = (row: Video) => {
    confirmDelete(row)
}

const handleFilter = () => {
    // computed会自动更新
}

const resetFilter = () => {
    filterData.value.keyword = ''
    filterData.value.hard = ''
}

// 添加创建对话框相关的状态和方法
const createDialogVisible = ref(false)

const handleCreate = () => {
    createDialogVisible.value = true
}

const handleCreated = async (newVideo: Video) => {
    try {
        // 先获取最新数据
        const response = await axios.get('http://localhost:5000/api/videos/')
        if (response.status === 200) {
            tableData.value = response.data
            // 先关闭弹窗
            createDialogVisible.value = false
            // 最后再显示成功提示
            setTimeout(() => {
                alert.success('添加视频成功')
            }, 100)
        }
    } catch (error) {
        console.error('获取视频数据失败:', error)
        alert.error('获取视频数据失败')
    }
}

// 添加编辑对话框相关的状态和方法
const editDialogVisible = ref(false)
const currentVideo = ref<Video | null>(null)

const handleEditSubmit = async (updatedVideo: Video) => {
    try {
        // 刷新列表数据
        await fetchData()
        editDialogVisible.value = false
        alert.success('更新成功')
    } catch (error) {
        console.error('更新视频失败:', error)
        alert.error('更新失败')
    }
}

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

onMounted(() => {
    fetchData()
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
