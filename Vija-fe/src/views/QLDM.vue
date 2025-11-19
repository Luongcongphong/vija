<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Định mức</h1>
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
              <th class="px-4 py-3">SL</th>
              <th class="px-4 py-3">Đơn giá</th>
              <th class="px-4 py-3">Định Mức</th>
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
              <td class="px-4 py-3">{{ item.dinh_muc }}</td>
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
            <SearchableSelect
              v-model="formData.po"
              :options="poOptions"
              label="PO"
              placeholder="Chọn hoặc tìm PO..."
              :required="true"
              @update:modelValue="handlePOChange"
            />
          </div>
          <div class="mb-4">
            <SearchableSelect
              v-model="formData.ma_bv"
              :options="maBVOptions"
              label="Mã BV"
              placeholder="Chọn hoặc tìm Mã BV..."
              :required="true"
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
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Định Mức</label>
            <input
              v-model.number="formData.dinh_muc"
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
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SearchableSelect from '@/components/common/SearchableSelect.vue'
import { qldmService, type QLDM } from '@/services/qldmService'
import { qlpoService } from '@/services/qlpoService'

interface QLDMItem {
  id?: number
  po: string
  ma_bv: string
  so_luong: number
  don_gia: number
  dinh_muc: number
}

const data = ref<QLDMItem[]>([])
const qlpoData = ref<any[]>([])
const showAddModal = ref(false)
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  po: '',
  ma_bv: '',
  so_luong: 0,
  don_gia: 0,
  dinh_muc: 0,
})

// Tạo options cho PO
const poOptions = computed(() => {
  const uniquePOs = [...new Set(qlpoData.value.map(item => item.po))]
  return uniquePOs.map(po => ({
    value: po,
    label: po
  }))
})

// Tạo options cho Mã BV
const maBVOptions = computed(() => {
  if (!formData.value.po) {
    return qlpoData.value.map(item => ({
      value: item.ma_bv,
      label: `${item.ma_bv} (${item.po})`
    }))
  }
  
  return qlpoData.value
    .filter(item => item.po === formData.value.po)
    .map(item => ({
      value: item.ma_bv,
      label: item.ma_bv
    }))
})

// Load QLPO
const loadQLPO = async () => {
  try {
    const result = await qlpoService.getAll()
    qlpoData.value = result
  } catch (error) {
    console.error('Lỗi khi tải QLPO:', error)
  }
}

// Khi chọn PO, reset Mã BV
const handlePOChange = (po: string) => {
  formData.value.ma_bv = ''
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const loadData = async () => {
  try {
    loading.value = true
    const result = await qldmService.getAll()
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

const editItem = (item: QLDMItem) => {
  editId.value = item.id || null
  formData.value = {
    po: item.po,
    ma_bv: item.ma_bv,
    so_luong: item.so_luong,
    don_gia: item.don_gia,
    dinh_muc: item.dinh_muc,
  }
  showAddModal.value = true
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa?')) {
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
    po: '',
    ma_bv: '',
    so_luong: 0,
    don_gia: 0,
    dinh_muc: 0,
  }
}

onMounted(() => {
  loadQLPO()
  loadData()
})
</script>
