<template>
  <AdminLayout v-if="isAuthenticated">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Hàng Lỗi/Lại (QLHL)</h1>
      <div class="flex gap-2">
        <button
          @click="openAddModal()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Thêm Hàng Lỗi
        </button>
      </div>
    </div>

    <!-- Filter (Optional: can add if needed later, but simple display for now) -->

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left border-collapse">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Mã PO</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Mã BV</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Mã KH</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">ĐVT</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">SL Lỗi</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">SL Giao Bù</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Ngày Trả</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Ngày Giao Bù</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="data.length === 0">
              <td colspan="9" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu hàng lỗi</td>
            </tr>
            <tr v-for="item in data" :key="item.id" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 font-bold text-blue-600">{{ item.ma_po }}</td>
              <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.ma_bv }}</td>
              <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.ma_kh || '-' }}</td>
              <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.dvt || '-' }}</td>
              <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 font-bold text-red-600">{{ item.sl }}</td>
              <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 font-bold text-green-600">{{ item.giao_bu }}</td>
              <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatDate(item.ngay_tra) }}</td>
              <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatDate(item.ngay_giao_bu) }}</td>
              <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">
                <span
                  v-if="(Number(item.giao_bu || 0) - Number(item.sl || 0)) >= 0"
                  class="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded mr-3 whitespace-nowrap inline-flex items-center shadow-sm"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                  Hoàn thành
                </span>
                <button @click="editItem(item)" class="text-blue-600 hover:text-blue-800 mr-3" :disabled="loading">
                  Sửa
                </button>
                <button @click="deleteItem(item.id!)" class="text-red-600 hover:text-red-800" :disabled="loading">
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ isEditMode ? 'Cập nhật Hàng Lỗi' : 'Ghi nhận Hàng Lỗi Mới' }}
        </h2>
        <form @submit.prevent="saveItem">
          
          <!-- Select PO (Only when creating) -->
          <div class="mb-4" v-if="!isEditMode">
            <SearchableSelect
              v-model="selectedPOId"
              :options="poOptions"
              label="Chọn PO"
              placeholder="Gõ để tìm PO..."
              :required="!isEditMode"
              @update:modelValue="handlePOSelect"
            />
          </div>

          <!-- PO Info Display -->
          <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-4 grid grid-cols-2 gap-2 text-sm" v-if="selectedPOData">
            <div class="text-gray-500">Mã PO: <span class="font-bold text-gray-900 dark:text-white">{{ selectedPOData.ma_po }}</span></div>
            <div class="text-gray-500">Mã BV: <span class="font-bold text-gray-900 dark:text-white">{{ selectedPOData.ma_bv }}</span></div>
            <div class="text-gray-500">Mã KH: <span class="font-bold text-gray-900 dark:text-white">{{ selectedPOData.ma_kh || '-' }}</span></div>
            <div class="text-gray-500">ĐVT: <span class="font-bold text-gray-900 dark:text-white">{{ selectedPOData.dvt || '-' }}</span></div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Số lượng lỗi</label>
              <input
                v-model.number="formData.sl"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Số lượng giao bù</label>
              <input
                v-model.number="formData.giao_bu"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Ngày Trả</label>
              <input
                v-model="formData.ngay_tra"
                type="date"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                style="color-scheme: light dark;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Ngày Giao Bù</label>
              <input
                v-model="formData.ngay_giao_bu"
                type="date"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                style="color-scheme: light dark;"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
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
              :disabled="loading || (!isEditMode && !selectedPOId)"
            >
              {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </AdminLayout>
  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Đang kiểm tra quyền...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SearchableSelect from '@/components/common/SearchableSelect.vue'
import { qlhlService, type QLHL } from '@/services/qlhlService'
import { qlpoService, type QLPO } from '@/services/qlpoService'

const isAuthenticated = computed(() => {
  return localStorage.getItem('isAuthenticated') === 'true' && !!localStorage.getItem('token')
})

const data = ref<QLHL[]>([])
const poList = ref<QLPO[]>([])
const loading = ref(false)

const showModal = ref(false)
const isEditMode = ref(false)
const editId = ref<number | null>(null)

const selectedPOId = ref<string>('')
const selectedPOData = ref<QLPO | null>(null)

const formData = ref({
  sl: 0,
  giao_bu: 0,
  ngay_tra: '',
  ngay_giao_bu: ''
})

const poOptions = computed(() => {
  return poList.value.map(po => ({
    value: po.id!.toString(), // Assuming id is always available when returned from backend
    label: `${po.ma_po} - ${po.ma_bv}`
  }))
})

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const loadData = async () => {
  if (!isAuthenticated.value) return
  try {
    loading.value = true
    const res = await qlhlService.getAll()
    data.value = res.data
  } catch (err) {
    console.error(err)
    alert('Không thể tải dữ liệu Hàng Lỗi')
  } finally {
    loading.value = false
  }
}

const loadPOList = async () => {
  if (!isAuthenticated.value) return
  try {
    const res = await qlpoService.getAll()
    poList.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const handlePOSelect = (val: string) => {
  const po = poList.value.find(p => p.id === Number(val))
  if (po) {
    selectedPOData.value = po
  } else {
    selectedPOData.value = null
  }
}

const openAddModal = () => {
  isEditMode.value = false
  editId.value = null
  selectedPOId.value = ''
  selectedPOData.value = null
  formData.value = {
    sl: 0,
    giao_bu: 0,
    ngay_tra: new Date().toISOString().split('T')[0], // Default to today
    ngay_giao_bu: ''
  }
  showModal.value = true
}

const editItem = (item: QLHL) => {
  isEditMode.value = true
  editId.value = item.id!
  
  // Set display data
  selectedPOData.value = {
    ma_po: item.ma_po,
    ma_bv: item.ma_bv || '',
    ma_kh: item.ma_kh,
    dvt: item.dvt
  } as QLPO

  formData.value = {
    sl: item.sl,
    giao_bu: item.giao_bu,
    ngay_tra: item.ngay_tra ? item.ngay_tra.split('T')[0] : '',
    ngay_giao_bu: item.ngay_giao_bu ? item.ngay_giao_bu.split('T')[0] : ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveItem = async () => {
  try {
    loading.value = true
    if (isEditMode.value && editId.value) {
      await qlhlService.update(editId.value, formData.value)
    } else {
      if (!selectedPOId.value) {
        alert("Vui lòng chọn PO")
        return
      }
      const payload = {
        qlpo_id: Number(selectedPOId.value),
        ...formData.value
      }
      await qlhlService.create(payload)
    }
    
    await loadData()
    closeModal()
  } catch (err) {
    console.error(err)
    alert("Có lỗi xảy ra khi lưu dữ liệu")
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
    try {
      loading.value = true
      await qlhlService.delete(id)
      await loadData()
    } catch (err) {
      console.error(err)
      alert('Không thể xóa dữ liệu')
    } finally {
      loading.value = false
    }
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    loadData()
    loadPOList()
  }
})
</script>
