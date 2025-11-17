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
              <th class="px-4 py-3">Tên</th>
              <th class="px-4 py-3">Password</th>
              <th class="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in data"
              :key="index"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3">{{ item.username }}</td>
              <td class="px-4 py-3">********</td>
              <td class="px-4 py-3">
                <button
                  @click="editItem(index)"
                  class="text-blue-600 hover:text-blue-800 mr-3"
                >
                  Sửa
                </button>
                <button
                  @click="deleteItem(index)"
                  class="text-red-600 hover:text-red-800"
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
          {{ editIndex !== null ? 'Sửa' : 'Thêm mới' }}
        </h2>
        <form @submit.prevent="saveItem">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Tên</label>
            <input
              v-model="formData.username"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Password</label>
            <input
              v-model="formData.password"
              type="password"
              required
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
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

interface UserItem {
  username: string
  password: string
}

const data = ref<UserItem[]>([])
const showAddModal = ref(false)
const editIndex = ref<number | null>(null)
const formData = ref({
  username: '',
  password: '',
})

const loadData = () => {
  const saved = localStorage.getItem('userData')
  if (saved) {
    data.value = JSON.parse(saved)
  }
}

const saveData = () => {
  localStorage.setItem('userData', JSON.stringify(data.value))
}

const saveItem = () => {
  if (editIndex.value !== null) {
    data.value[editIndex.value] = { ...formData.value }
  } else {
    data.value.push({ ...formData.value })
  }

  saveData()
  closeModal()
}

const editItem = (index: number) => {
  editIndex.value = index
  const item = data.value[index]
  formData.value = { ...item }
  showAddModal.value = true
}

const deleteItem = (index: number) => {
  if (confirm('Bạn có chắc muốn xóa?')) {
    data.value.splice(index, 1)
    saveData()
  }
}

const closeModal = () => {
  showAddModal.value = false
  editIndex.value = null
  formData.value = {
    username: '',
    password: '',
  }
}

onMounted(() => {
  loadData()
})
</script>
