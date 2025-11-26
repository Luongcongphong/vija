<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Nội bộ</h1>
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
              <th class="px-4 py-3">Số BG</th>
              <th class="px-4 py-3">Mã BV</th>
              <th class="px-4 py-3">Phôi Liệu</th>
              <th class="px-4 py-3">Gia Công Ngoài</th>
              <th class="px-4 py-3">Gia Công Nội Bộ</th>
              <th class="px-4 py-3">Xử lý Bề Mặt</th>
              <th class="px-4 py-3">Vận Chuyển</th>
              <th class="px-4 py-3">Phí QLDN</th>
              <th class="px-4 py-3">Tổng Phí</th>
              <th class="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="10" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="!data || data.length === 0">
              <td colspan="10" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
            </tr>
            <tr
              v-else
              v-for="item in data"
              :key="item.id"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3">{{ item.so_bg }}</td>
              <td class="px-4 py-3">{{ item.ma_bv }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.phoi_lieu) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.gia_cong_ngoai) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.gia_cong_noi_bo) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.xu_ly_be_mat) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.van_chuyen) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.phi_qldn) }}</td>
              <td class="px-4 py-3 font-medium">{{ formatCurrency(item.tong_phi || 0) }}</td>
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
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ editId !== null ? 'Sửa chi phí nội bộ' : 'Thêm chi phí nội bộ' }}
        </h2>
        <form @submit.prevent="saveItem">
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <SearchableSelect
                v-model="formData.so_bg"
                :options="soBGOptions"
                label="Số BG"
                placeholder="Chọn hoặc tìm Số BG..."
                :required="true"
                @update:modelValue="handleSoBGChange"
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
              <label class="block text-sm font-medium mb-2">Phôi Liệu</label>
              <input
                v-model.number="formData.phoi_lieu"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Gia Công Ngoài</label>
              <input
                v-model.number="formData.gia_cong_ngoai"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Gia Công Nội Bộ</label>
              <input
                v-model.number="formData.gia_cong_noi_bo"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Xử lý Bề Mặt</label>
              <input
                v-model.number="formData.xu_ly_be_mat"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Vận Chuyển</label>
              <input
                v-model.number="formData.van_chuyen"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Phí QLDN</label>
              <input
                v-model.number="formData.phi_qldn"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p class="text-sm font-medium">
              Tổng phí: <span class="text-blue-600 dark:text-blue-300">{{ formatCurrency(tongPhi) }}</span>
            </p>
          </div>
          <div class="flex justify-end gap-2 mt-4">
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
import { qlnbService, type QLNB } from '@/services/qlnbService'
import { qlbgService } from '@/services/qlbgService'

interface QLNBItem {
  id?: number
  so_bg: string
  ma_bv: string
  phoi_lieu: number
  gia_cong_ngoai: number
  gia_cong_noi_bo: number
  xu_ly_be_mat: number
  van_chuyen: number
  phi_qldn: number
  tong_phi?: number
}

const data = ref<QLNBItem[]>([])
const qlbgData = ref<any[]>([])
const showAddModal = ref(false)
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  so_bg: '',
  ma_bv: '',
  phoi_lieu: 0,
  gia_cong_ngoai: 0,
  gia_cong_noi_bo: 0,
  xu_ly_be_mat: 0,
  van_chuyen: 0,
  phi_qldn: 0,
})

// Tạo options cho Số BG
const soBGOptions = computed(() => {
  const uniqueSoBG = [...new Set(qlbgData.value.map(item => item.so_bg))]
  return uniqueSoBG.map(so_bg => ({
    value: so_bg,
    label: so_bg
  }))
})

// Tạo options cho Mã BV
const maBVOptions = computed(() => {
  if (!formData.value.so_bg) {
    return qlbgData.value.map(item => ({
      value: item.ma_bv,
      label: `${item.ma_bv} (${item.so_bg})`
    }))
  }
  
  return qlbgData.value
    .filter(item => item.so_bg === formData.value.so_bg)
    .map(item => ({
      value: item.ma_bv,
      label: item.ma_bv
    }))
})

// Tính tổng phí
const tongPhi = computed(() => {
  return formData.value.phoi_lieu +
         formData.value.gia_cong_ngoai +
         formData.value.gia_cong_noi_bo +
         formData.value.xu_ly_be_mat +
         formData.value.van_chuyen +
         formData.value.phi_qldn
})

// Load QLBG
const loadQLBG = async () => {
  try {
    const response = await qlbgService.getAll()
    qlbgData.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải QLBG:', error)
  }
}

// Khi chọn Số BG, reset Mã BV
const handleSoBGChange = (so_bg: string) => {
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
    console.log('Loading QLNB data...')
    const response = await qlnbService.getAll()
    console.log('QLNB response:', response)
    
    // Check if response has data property
    if (response && response.data) {
      data.value = response.data
    } else if (Array.isArray(response)) {
      data.value = response
    } else {
      data.value = []
    }
    
    console.log('QLNB data loaded:', data.value)
  } catch (error: unknown) {
    console.error('Lỗi khi tải dữ liệu QLNB:', error)
    console.error('Error response:', error.response?.data)
    data.value = []
    
    // Hiển thị lỗi chi tiết
    const errorMsg = error.response?.data?.message || error.message || 'Không thể tải dữ liệu'
    alert(`Lỗi: ${errorMsg}`)
  } finally {
    loading.value = false
  }
}

const saveItem = async () => {
  try {
    loading.value = true
    
    if (editId.value !== null) {
      await qlnbService.update(editId.value, formData.value)
    } else {
      await qlnbService.create(formData.value)
    }
    
    await loadData()
    closeModal()
  } catch (error: unknown) {
    console.error('Lỗi khi lưu:', error)
    alert(`Không thể lưu dữ liệu! ${error.response?.data?.message || error.message}`)
  } finally {
    loading.value = false
  }
}

const editItem = (item: QLNBItem) => {
  editId.value = item.id || null
  formData.value = {
    so_bg: item.so_bg,
    ma_bv: item.ma_bv,
    phoi_lieu: item.phoi_lieu,
    gia_cong_ngoai: item.gia_cong_ngoai,
    gia_cong_noi_bo: item.gia_cong_noi_bo,
    xu_ly_be_mat: item.xu_ly_be_mat,
    van_chuyen: item.van_chuyen,
    phi_qldn: item.phi_qldn,
  }
  showAddModal.value = true
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa?')) {
    try {
      loading.value = true
      await qlnbService.delete(id)
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
    so_bg: '',
    ma_bv: '',
    phoi_lieu: 0,
    gia_cong_ngoai: 0,
    gia_cong_noi_bo: 0,
    xu_ly_be_mat: 0,
    van_chuyen: 0,
    phi_qldn: 0,
  }
}

onMounted(() => {
  loadQLBG()
  loadData()
})
</script>
