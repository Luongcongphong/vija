<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý User</h1>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Thêm mới
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3">Tên đăng nhập</th>
              <th class="px-4 py-3">Vai trò</th>
              <th class="px-4 py-3">Ngày tạo</th>
              <th class="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="data.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
            </tr>
            <tr
              v-else
              v-for="item in data"
              :key="item.id"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3">{{ item.username }}</td>
              <td class="px-4 py-3">
                <span :class="getRoleColor(item.role || 'sales')" class="px-2 py-1 rounded text-xs font-medium">
                  {{ getRoleName(item.role || 'sales') }}
                </span>
              </td>
              <td class="px-4 py-3">{{ formatDate(item.created_at) }}</td>
              <td class="px-4 py-3">
                <button
                  @click="editItem(item)"
                  class="text-blue-600 hover:text-blue-800 mr-3"
                  :disabled="loading"
                >
                  Sửa
                </button>
                <button
                  @click="deleteItem(item.id!)"
                  class="text-red-600 hover:text-red-800"
                  :disabled="loading || item.username === 'admin'"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal thêm/sửa -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-99999"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ editId !== null ? 'Sửa User' : 'Thêm User mới' }}
        </h2>
        <form @submit.prevent="saveItem">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Tên đăng nhập</label>
            <input
              v-model="formData.username"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">
              Password
              <span v-if="editId !== null" class="text-xs text-gray-500">(Để trống nếu không đổi)</span>
            </label>
            <input
              v-model="formData.password"
              type="password"
              :required="editId === null"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Vai trò</label>
            <select
              v-model="formData.role"
              required
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="admin">Quản trị viên (Admin)</option>
              <option value="sales">Kinh doanh (Sales)</option>
              <option value="kythuat">Kỹ thuật</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              <span v-if="formData.role === 'admin'">Toàn quyền</span>
              <span v-else-if="formData.role === 'sales'">Quyền: QLDM, QLKH</span>
              <span v-else-if="formData.role === 'kythuat'">Quyền: QLNB, QLPO</span>
            </p>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { userService, type User } from '@/services/userService'
import { getRoleName, getRoleColor } from '@/utils/permissions'

const data = ref<User[]>([])
const showAddModal = ref(false)
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  username: '',
  password: '',
  role: 'sales' as 'admin' | 'sales' | 'kythuat',
})

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const loadData = async () => {
  // Kiểm tra authentication trước khi gọi API
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const hasToken = !!localStorage.getItem('token')
  
  if (!isAuthenticated || !hasToken) {
    console.log('Not authenticated, skip loading data')
    return
  }
  
  try {
    loading.value = true
    const result = await userService.getAll()
    data.value = result
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error)
    alert('Không thể tải dữ liệu!')
  } finally {
    loading.value = false
  }
}

const saveItem = async () => {
  try {
    loading.value = true
    
    const payload: any = {
      username: formData.value.username,
      role: formData.value.role,
    }
    
    // Chỉ gửi password nếu có giá trị
    if (formData.value.password) {
      payload.password = formData.value.password
    }
    
    if (editId.value !== null) {
      await userService.update(editId.value, payload)
    } else {
      await userService.create(payload)
    }
    
    await loadData()
    closeModal()
  } catch (error: any) {
    console.error('Lỗi khi lưu:', error)
    alert(error.response?.data?.message || 'Không thể lưu dữ liệu!')
  } finally {
    loading.value = false
  }
}

const editItem = (item: User) => {
  editId.value = item.id || null
  formData.value = {
    username: item.username,
    password: '',
    role: item.role || 'sales',
  }
  showAddModal.value = true
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa user này?')) {
    try {
      loading.value = true
      await userService.delete(id)
      await loadData()
    } catch (error) {
      console.error('Lỗi khi xóa:', error)
      alert('Không thể xóa user!')
    } finally {
      loading.value = false
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  editId.value = null
  formData.value = {
    username: '',
    password: '',
    role: 'sales',
  }
}

onMounted(() => {
  loadData()
})
</script>
