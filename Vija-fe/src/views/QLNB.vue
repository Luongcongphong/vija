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

    <!-- Filter with Search -->
    <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <label class="block text-sm font-medium mb-2">Lọc theo Mã PO:</label>
      <div class="flex gap-2">
        <input
          v-model="searchMaPO"
          type="text"
          placeholder="Tìm kiếm Mã PO..."
          class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          v-model="filterMaPO"
          class="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">Tất cả</option>
          <option v-for="item in filteredMaPOList" :key="item.ma_po" :value="item.ma_po">
            {{ item.ma_po }}
          </option>
        </select>
        <button
          v-if="filterMaPO"
          @click="clearFilter"
          class="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Xóa lọc
        </button>
      </div>
      <p v-if="filterMaPO" class="text-xs text-green-600 mt-2">
        Đang hiển thị: {{ filteredData.length }} kết quả cho {{ filterMaPO }}
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3">Mã PO</th>
              <th class="px-4 py-3">Mã BV</th>
              <th class="px-4 py-3">Số lượng</th>
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
              <td colspan="11" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="groupedData.length === 0">
              <td colspan="11" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
            </tr>
            <template v-else v-for="group in groupedData" :key="group.ma_po">
              <!-- Header row cho mỗi Mã PO -->
              <tr class="bg-green-50 dark:bg-green-900 border-b-2 border-green-200 dark:border-green-700">
                <td class="px-4 py-3 font-bold text-green-700 dark:text-green-300" :rowspan="group.items.length + 1">
                  {{ group.ma_po }}
                </td>
                <td class="px-4 py-2 font-medium" colspan="9">
                  Số lượng Mã BV: {{ group.items.length }}
                </td>
                <td class="px-4 py-2">
                  <button
                    @click="deletePO(group.ma_po)"
                    class="text-red-600 hover:text-red-800 text-xs font-medium"
                    :disabled="loading"
                  >
                    🗑️ Xóa PO
                  </button>
                </td>
              </tr>
              <!-- Chi tiết từng Mã BV -->
              <tr
                v-for="item in group.items"
                :key="item.id"
                class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-4 py-3">{{ item.ma_bv }}</td>
                <td class="px-4 py-3">{{ item.so_luong || 0 }}</td>
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
            </template>
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
          <div class="mb-4">
            <SearchableSelect
              v-model="formData.ma_po"
              :options="maPOOptions"
              label="Mã PO"
              placeholder="Chọn hoặc tìm Mã PO..."
              :required="true"
              @update:modelValue="handleMaPOChange"
            />
          </div>
          
          <!-- Nút tạo tự động -->
          <div v-if="formData.ma_po && !editId" class="mb-4">
            <button
              type="button"
              @click="autoCreateFromPO"
              class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              🔄 Tạo tự động {{ maBVOptions.length }} Mã BV từ PO này
            </button>
            <p class="text-xs text-gray-500 mt-2">
              Tự động tạo các dòng chi phí cho tất cả Mã BV trong PO (chi phí mặc định = 0)
            </p>
          </div>

          <!-- Form nhập thủ công (chỉ hiển thị khi sửa) -->
          <div v-if="editId" class="grid grid-cols-2 gap-4">
            <div class="mb-4 col-span-2">
              <label class="block text-sm font-medium mb-2">Mã BV</label>
              <input
                v-model="formData.ma_bv"
                type="text"
                readonly
                class="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Số lượng</label>
              <input
                v-model.number="formData.so_luong"
                type="number"
                min="0"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
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
import { qlpoService } from '@/services/qlpoService'

const data = ref<QLNB[]>([])
const qlpoData = ref<Array<{ ma_po: string; ma_bv: string }>>([])
const maPOList = ref<{ ma_po: string }[]>([])
const filterMaPO = ref('')
const searchMaPO = ref('')
const showAddModal = ref(false)
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  ma_po: '',
  ma_bv: '',
  phoi_lieu: 0,
  gia_cong_ngoai: 0,
  gia_cong_noi_bo: 0,
  xu_ly_be_mat: 0,
  van_chuyen: 0,
  phi_qldn: 0,
})

// Filter Mã PO list by search
const filteredMaPOList = computed(() => {
  if (!searchMaPO.value) return maPOList.value
  return maPOList.value.filter(item => 
    item.ma_po.toLowerCase().includes(searchMaPO.value.toLowerCase())
  )
})

// Filter data by selected Mã PO
const filteredData = computed(() => {
  if (!filterMaPO.value) return data.value
  return data.value.filter(item => item.ma_po === filterMaPO.value)
})

// Gộp dữ liệu theo Mã PO
const groupedData = computed(() => {
  const groups: { [key: string]: QLNB[] } = {}
  
  filteredData.value.forEach(item => {
    if (!groups[item.ma_po]) {
      groups[item.ma_po] = []
    }
    groups[item.ma_po].push(item)
  })
  
  return Object.keys(groups).map(ma_po => ({
    ma_po,
    items: groups[ma_po]
  })).sort((a, b) => b.ma_po.localeCompare(a.ma_po))
})

const clearFilter = () => {
  filterMaPO.value = ''
  searchMaPO.value = ''
}

// Tạo options cho Mã PO
const maPOOptions = computed(() => {
  const uniqueMaPO = [...new Set(qlpoData.value.map(item => item.ma_po))]
  return uniqueMaPO.map(ma_po => ({
    value: ma_po,
    label: ma_po
  }))
})

// Tạo options cho Mã BV
const maBVOptions = computed(() => {
  if (!formData.value.ma_po) {
    return qlpoData.value.map(item => ({
      value: item.ma_bv,
      label: `${item.ma_bv} (${item.ma_po})`
    }))
  }
  
  return qlpoData.value
    .filter(item => item.ma_po === formData.value.ma_po)
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

// Load QLPO
const loadQLPO = async () => {
  try {
    const response = await qlpoService.getAll()
    qlpoData.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải QLPO:', error)
  }
}

const loadMaPOList = async () => {
  try {
    const response = await qlpoService.getAllMaPO()
    maPOList.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách Mã PO:', error)
  }
}

// Khi chọn Mã PO, reset Mã BV
const handleMaPOChange = () => {
  formData.value.ma_bv = ''
}

// Tạo tự động các dòng từ PO
const autoCreateFromPO = async () => {
  if (!formData.value.ma_po) {
    alert('Vui lòng chọn Mã PO trước!')
    return
  }
  
  const confirmMsg = `Tạo tự động ${maBVOptions.value.length} dòng chi phí cho PO "${formData.value.ma_po}"?\n\n` +
    `Các Mã BV: ${maBVOptions.value.map(opt => opt.value).join(', ')}\n\n` +
    `Tất cả chi phí sẽ được đặt = 0, bạn có thể sửa sau.`
  
  if (!confirm(confirmMsg)) return
  
  try {
    loading.value = true
    
    let successCount = 0
    let failCount = 0
    const failedItems: string[] = []
    
    // Lấy thông tin từ QLPO
    const poItems = qlpoData.value.filter(item => item.ma_po === formData.value.ma_po)
    
    for (const poItem of poItems) {
      try {
        await qlnbService.create({
          ma_po: formData.value.ma_po,
          ma_bv: poItem.ma_bv,
          so_luong: poItem.so_luong || 0,
          phoi_lieu: 0,
          gia_cong_ngoai: 0,
          gia_cong_noi_bo: 0,
          xu_ly_be_mat: 0,
          van_chuyen: 0,
          phi_qldn: 0
        })
        successCount++
      } catch (error) {
        failCount++
        failedItems.push(poItem.ma_bv)
      }
    }
    
    await loadData()
    closeModal()
    
    let resultMsg = `Tạo tự động hoàn tất!\n\n`
    resultMsg += `✅ Thành công: ${successCount} dòng\n`
    if (failCount > 0) {
      resultMsg += `❌ Thất bại: ${failCount} dòng\n`
      resultMsg += `Mã BV lỗi: ${failedItems.join(', ')}`
    }
    
    alert(resultMsg)
  } catch (error) {
    console.error('Lỗi khi tạo tự động:', error)
    alert('Không thể tạo tự động!')
  } finally {
    loading.value = false
  }
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
    
    data.value = Array.isArray(response) ? response : []
    
    console.log('QLNB data loaded:', data.value)
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } }; message?: string }
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
    
    const dataToSave: QLNB = {
      ma_po: formData.value.ma_po,
      ma_bv: formData.value.ma_bv,
      phoi_lieu: formData.value.phoi_lieu,
      gia_cong_ngoai: formData.value.gia_cong_ngoai,
      gia_cong_noi_bo: formData.value.gia_cong_noi_bo,
      xu_ly_be_mat: formData.value.xu_ly_be_mat,
      van_chuyen: formData.value.van_chuyen,
      phi_qldn: formData.value.phi_qldn,
    }
    
    if (editId.value !== null) {
      await qlnbService.update(editId.value, dataToSave)
    } else {
      await qlnbService.create(dataToSave)
    }
    
    await loadData()
    closeModal()
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } }; message?: string }
    console.error('Lỗi khi lưu:', error)
    alert(`Không thể lưu dữ liệu! ${error.response?.data?.message || error.message}`)
  } finally {
    loading.value = false
  }
}

const editItem = (item: QLNB) => {
  editId.value = item.id || null
  formData.value = {
    ma_po: item.ma_po,
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

const deletePO = async (ma_po: string) => {
  const group = groupedData.value.find(g => g.ma_po === ma_po)
  if (!group) return
  
  const confirmMsg = `Bạn có chắc muốn xóa toàn bộ chi phí của PO "${ma_po}"?\n\n` +
    `Sẽ xóa ${group.items.length} Mã BV:\n` +
    group.items.map(item => `- ${item.ma_bv}`).join('\n')
  
  if (confirm(confirmMsg)) {
    try {
      loading.value = true
      
      // Xóa từng dòng
      let successCount = 0
      for (const item of group.items) {
        try {
          await qlnbService.delete(item.id!)
          successCount++
        } catch (error) {
          console.error('Lỗi khi xóa item:', item.id, error)
        }
      }
      
      await loadData()
      alert(`✅ Đã xóa thành công ${successCount}/${group.items.length} dòng của PO "${ma_po}"`)
    } catch (error) {
      console.error('Lỗi khi xóa PO:', error)
      alert('Không thể xóa PO!')
    } finally {
      loading.value = false
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  editId.value = null
  formData.value = {
    ma_po: '',
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
  loadQLPO()
  loadMaPOList()
  loadData()
})
</script>
