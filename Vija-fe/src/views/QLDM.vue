<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Định mức (Bản Vẽ)</h1>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Thêm mới
      </button>
    </div>

    <!-- Filter/Search -->
    <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <label class="block text-sm font-medium mb-2">Tìm kiếm theo Mã BV:</label>
      <input
        v-model="searchMaBV"
        type="text"
        placeholder="Nhập Mã BV để tìm kiếm..."
        class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
      />
      <p v-if="searchMaBV" class="text-xs text-blue-600 mt-2">
        Đang hiển thị: {{ filteredData.length }} kết quả
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3">Mã BV</th>
              <th class="px-4 py-3">Số BG</th>
              <th class="px-4 py-3">Mã KH</th>
              <th class="px-4 py-3">Số lượng</th>
              <th class="px-4 py-3">Đơn giá</th>
              <th class="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="filteredData.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">{{ searchMaBV ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu' }}</td>
            </tr>
            <tr
              v-else
              v-for="item in filteredData"
              :key="item.id"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3 font-medium">{{ item.ma_bv }}</td>
              <td class="px-4 py-3">{{ item.so_bg || '-' }}</td>
              <td class="px-4 py-3">{{ item.ma_kh || '-' }}</td>
              <td class="px-4 py-3">{{ item.so_luong }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.don_gia) }}</td>
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
          {{ editId !== null ? 'Sửa định mức' : 'Thêm định mức mới' }}
        </h2>
        <form @submit.prevent="saveItem">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Mã BV</label>
            <input
              v-model="formData.ma_bv"
              type="text"
              required
              placeholder="VD: BV001"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Số BG</label>
            <input
              v-model="formData.so_bg"
              type="text"
              placeholder="VD: BG001 (Tùy chọn)"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Mã KH</label>
            <input
              v-model="formData.ma_kh"
              type="text"
              placeholder="VD: KH001 (Tùy chọn)"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Số lượng</label>
            <input
              v-model.number="formData.so_luong"
              type="number"
              required
              min="1"
              placeholder="VD: 100"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <p class="text-xs text-gray-500 mt-1">Số lượng định mức (áp dụng cho SL ≤ giá trị này)</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Đơn giá</label>
            <input
              v-model.number="formData.don_gia"
              type="number"
              required
              min="0"
              placeholder="VD: 50000"
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
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { qldmService, type QLDM } from '@/services/qldmService'

const data = ref<QLDM[]>([])
const searchMaBV = ref('')
const showAddModal = ref(false)
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  ma_bv: '',
  so_bg: '',
  ma_kh: '',
  so_luong: 0,
  don_gia: 0,
})

// Filter data by search
const filteredData = computed(() => {
  if (!searchMaBV.value) return data.value
  return data.value.filter(item => 
    item.ma_bv.toLowerCase().includes(searchMaBV.value.toLowerCase())
  )
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
    const response = await qldmService.getAll()
    data.value = response.data
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
    
    if (editId.value !== null) {
      await qldmService.update(editId.value, formData.value)
    } else {
      await qldmService.create(formData.value)
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

const editItem = (item: QLDM) => {
  editId.value = item.id || null
  formData.value = {
    ma_bv: item.ma_bv,
    so_bg: item.so_bg || '',
    ma_kh: item.ma_kh || '',
    so_luong: item.so_luong,
    don_gia: item.don_gia,
  }
  showAddModal.value = true
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa định mức này?')) {
    try {
      loading.value = true
      await qldmService.delete(id)
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
    ma_bv: '',
    so_bg: '',
    ma_kh: '',
    so_luong: 0,
    don_gia: 0,
  }
}

onMounted(() => {
  loadData()
})
</script>
