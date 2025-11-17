<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Khách hàng</h1>
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
              <th class="px-4 py-3">PO</th>
              <th class="px-4 py-3">Mã BV</th>
              <th class="px-4 py-3">Số Lượng</th>
              <th class="px-4 py-3">Đơn giá</th>
              <th class="px-4 py-3">Thành tiền</th>
              <th class="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="data.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
            </tr>
            <tr
              v-else
              v-for="item in data"
              :key="item.id"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3">{{ item.po }}</td>
              <td class="px-4 py-3">{{ item.ma_bv }}</td>
              <td class="px-4 py-3">{{ item.so_luong }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.don_gia) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.thanh_tien || 0) }}</td>
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
                  :disabled="loading"
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
            <label class="block text-sm font-medium mb-2">PO</label>
            <input
              v-model="formData.po"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Mã BV</label>
            <input
              v-model="formData.ma_bv"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Số Lượng</label>
            <input
              v-model.number="formData.so_luong"
              type="number"
              required
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Đơn giá</label>
            <input
              v-model.number="formData.don_gia"
              type="number"
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
import { qlkhService, type QLKH } from '@/services/qlkhService'

interface QLKHItem {
  id?: number
  po: string
  ma_bv: string
  so_luong: number
  don_gia: number
  thanh_tien?: number
}

const data = ref<QLKHItem[]>([])
const showAddModal = ref(false)
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  po: '',
  ma_bv: '',
  so_luong: 0,
  don_gia: 0,
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const loadData = async () => {
  try {
    loading.value = true
    console.log('🔄 Đang tải dữ liệu QLKH...')
    console.log('Token:', localStorage.getItem('token'))
    console.log('API URL:', import.meta.env.VITE_API_URL)
    
    const result = await qlkhService.getAll()
    console.log('✅ Dữ liệu nhận được:', result)
    data.value = result
  } catch (error: any) {
    console.error('❌ Lỗi khi tải dữ liệu:', error)
    console.error('Response:', error.response?.data)
    console.error('Status:', error.response?.status)
    alert(`Không thể tải dữ liệu! ${error.response?.data?.message || error.message}`)
  } finally {
    loading.value = false
  }
}

const saveItem = async () => {
  try {
    loading.value = true
    
    if (editId.value !== null) {
      await qlkhService.update(editId.value, formData.value)
    } else {
      await qlkhService.create(formData.value)
    }
    
    await loadData()
    closeModal()
  } catch (error) {
    console.error('Lỗi khi lưu:', error)
    alert('Không thể lưu dữ liệu!')
  } finally {
    loading.value = false
  }
}

const editItem = (item: QLKHItem) => {
  editId.value = item.id || null
  formData.value = {
    po: item.po,
    ma_bv: item.ma_bv,
    so_luong: item.so_luong,
    don_gia: item.don_gia,
  }
  showAddModal.value = true
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa?')) {
    try {
      loading.value = true
      await qlkhService.delete(id)
      await loadData()
    } catch (error) {
      console.error('Lỗi khi xóa:', error)
      alert('Không thể xóa dữ liệu!')
    } finally {
      loading.value = false
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  editId.value = null
  formData.value = {
    po: '',
    ma_bv: '',
    so_luong: 0,
    don_gia: 0,
  }
}

onMounted(() => {
  loadData()
})
</script>
