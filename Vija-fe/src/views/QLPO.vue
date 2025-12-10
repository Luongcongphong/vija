<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý PO</h1>
      <div class="flex gap-2">
        <button
          @click="downloadTemplate"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          📥 Tải file mẫu
        </button>
        <label class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer">
          📤 Import Excel
          <input
            type="file"
            accept=".xlsx,.xls"
            @change="handleFileImport"
            class="hidden"
          />
        </label>
        <button
          @click="exportToExcel"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          :disabled="loading"
        >
          📊 Export Excel {{ filterMaPO ? '(Đã lọc)' : '' }}
        </button>
        <button
          @click="openAddModal()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Thêm mới
        </button>
      </div>
    </div>

    <!-- Filter with Search -->
    <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="grid grid-cols-2 gap-4">
        <!-- Lọc theo Mã PO -->
        <div>
          <label class="block text-sm font-medium mb-2">Lọc theo Mã PO:</label>
          <div class="flex gap-2">
            <input
              v-model="searchMaPO"
              type="text"
              placeholder="Tìm kiếm Mã PO..."
              @keyup.enter="selectFirstMatchPO"
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
          </div>
        </div>
        
        <!-- Lọc theo Mã BV -->
        <div>
          <label class="block text-sm font-medium mb-2">Lọc theo Mã BV:</label>
          <div class="flex gap-2">
            <input
              v-model="searchMaBV"
              type="text"
              placeholder="Tìm kiếm Mã BV..."
              @keyup.enter="selectFirstMatchBV"
              class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <select
              v-model="filterMaBV"
              class="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Tất cả</option>
              <option v-for="item in filteredMaBVList" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="flex gap-2 mt-2">
        <button
          v-if="filterMaPO || filterMaBV"
          @click="clearFilter"
          class="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Xóa tất cả lọc
        </button>
        <p v-if="filterMaPO || filterMaBV" class="text-xs text-green-600 flex items-center">
          Đang hiển thị: {{ filteredData.length }} kết quả
          <span v-if="filterMaPO"> cho PO: {{ filterMaPO }}</span>
          <span v-if="filterMaBV"> cho BV: {{ filterMaBV }}</span>
        </p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left border-collapse">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Mã PO</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Mã BV</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Mã KH</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">SL</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">ĐVT</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Ngày tạo</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Ngày giao</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="groupedData.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
            </tr>
            <template v-else v-for="group in groupedData" :key="group.ma_po">
              <!-- Header row cho mỗi Mã PO -->
              <tr class="bg-green-50 dark:bg-green-900 border-b-2 border-green-200 dark:border-green-700">
                <td class="px-3 py-1.5 font-bold text-green-700 dark:text-green-300 border border-gray-300 dark:border-gray-600" :rowspan="group.items.length + 1">
                  {{ group.ma_po }}
                </td>
                <td class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600" colspan="2">
                  SLBV: {{ group.items.length }}
                </td>
                <td class="px-1 py-1 border border-gray-300 dark:border-gray-600" colspan="3"></td>
                <td class="px-1 py-1 border border-gray-300 dark:border-gray-600 flex gap-2">
                  <button
                    @click="openAddModal(group.ma_po, group.ngay_tao, group.ngay_giao)"
                    class="text-green-600 hover:text-green-800 text-xs"
                    :disabled="loading"
                  >
                    + Thêm Mã BV
                  </button>
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
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.ma_bv }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.ma_kh || '-' }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.so_luong || 0 }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.dvt || 'p' }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatDate(item.ngay_tao) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatDate(item.ngay_giao) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">
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
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ editId !== null ? 'Sửa PO' : (selectedMaPO ? `Thêm Mã BV vào ${selectedMaPO}` : 'Thêm PO mới') }}
        </h2>
        <form @submit.prevent="saveItem">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Mã PO</label>
            <input
              v-model="formData.ma_po"
              type="text"
              required
              :readonly="!!selectedMaPO"
              :class="selectedMaPO ? 'bg-gray-100 dark:bg-gray-600' : ''"
              placeholder="VD: PO001"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <SearchableSelect
              v-model="formData.ma_bv"
              :options="maBVOptions"
              label="Mã BV"
              placeholder="Chọn hoặc tìm Mã BV..."
              :required="true"
              @update:modelValue="handleMaBVChange"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Mã KH</label>
            <input
              v-model="formData.ma_kh"
              type="text"
              readonly
              placeholder="Tự động từ QLDM"
              class="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600"
            />
            <p class="text-xs text-gray-500 mt-1">Mã khách hàng tự động lấy từ QLDM theo Mã BV</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Số lượng</label>
            <input
              v-model.number="formData.so_luong"
              type="number"
              min="0"
              placeholder="VD: 100"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Ngày tạo</label>
            <input
              v-model="formData.ngay_tao"
              type="date"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Ngày giao</label>
            <input
              v-model="formData.ngay_giao"
              type="date"
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
import { qlpoService, type QLPO } from '@/services/qlpoService'
import { qldmService } from '@/services/qldmService'
import * as XLSX from 'xlsx'

const data = ref<QLPO[]>([])
const maPOList = ref<{ ma_po: string }[]>([])
const maBVList = ref<{ ma_bv: string; ma_kh?: string }[]>([])
const filterMaPO = ref('')
const searchMaPO = ref('')
const filterMaBV = ref('')
const searchMaBV = ref('')
const showAddModal = ref(false)
const selectedMaPO = ref('')
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  ma_po: '',
  ma_bv: '',
  ma_kh: '',
  so_luong: 0,
  ngay_tao: '',
  ngay_giao: '',
})

// Filter Mã PO list by search
const filteredMaPOList = computed(() => {
  if (!searchMaPO.value) return maPOList.value
  return maPOList.value.filter(item => 
    item.ma_po.toLowerCase().includes(searchMaPO.value.toLowerCase())
  )
})

// Get unique Mã BV list from data
const maBVListUnique = computed(() => {
  const uniqueBV = [...new Set(data.value.map(item => item.ma_bv))]
  return uniqueBV.sort()
})

// Filter Mã BV list by search
const filteredMaBVList = computed(() => {
  if (!searchMaBV.value) return maBVListUnique.value
  return maBVListUnique.value.filter(item => 
    item.toLowerCase().includes(searchMaBV.value.toLowerCase())
  )
})

// Filter data by selected Mã PO and/or Mã BV
const filteredData = computed(() => {
  let result = data.value
  
  if (filterMaPO.value) {
    result = result.filter(item => item.ma_po === filterMaPO.value)
  }
  
  if (filterMaBV.value) {
    result = result.filter(item => item.ma_bv === filterMaBV.value)
  }
  
  return result
})

// Gộp dữ liệu theo Mã PO (chỉ dữ liệu đã lọc)
const groupedData = computed(() => {
  const groups: { [key: string]: QLPO[] } = {}
  
  filteredData.value.forEach(item => {
    if (!groups[item.ma_po]) {
      groups[item.ma_po] = []
    }
    groups[item.ma_po].push(item)
  })
  
  return Object.keys(groups).map(ma_po => {
    const items = groups[ma_po]
    return {
      ma_po,
      items,
      ngay_tao: items[0]?.ngay_tao,
      ngay_giao: items[0]?.ngay_giao
    }
  }).sort((a, b) => b.ma_po.localeCompare(a.ma_po))
})

const selectFirstMatchPO = () => {
  if (filteredMaPOList.value.length > 0) {
    filterMaPO.value = filteredMaPOList.value[0].ma_po
  }
}

const selectFirstMatchBV = () => {
  if (filteredMaBVList.value.length > 0) {
    filterMaBV.value = filteredMaBVList.value[0]
  }
}

const clearFilter = () => {
  filterMaPO.value = ''
  searchMaPO.value = ''
  filterMaBV.value = ''
  searchMaBV.value = ''
}

const maBVOptions = computed(() => {
  return maBVList.value.map(item => ({
    value: item.ma_bv,
    label: item.ma_bv
  }))
})

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const loadData = async () => {
  try {
    loading.value = true
    const response = await qlpoService.getAll()
    data.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error)
    alert('Không thể tải dữ liệu!')
  } finally {
    loading.value = false
  }
}

const loadMaBVList = async () => {
  try {
    const response = await qldmService.getAll()
    maBVList.value = response.data.map(item => ({
      ma_bv: item.ma_bv,
      ma_kh: item.ma_kh
    }))
  } catch (error) {
    console.error('Lỗi khi tải danh sách Mã BV:', error)
  }
}

const handleMaBVChange = (ma_bv: string) => {
  const selected = maBVList.value.find(item => item.ma_bv === ma_bv)
  if (selected) {
    formData.value.ma_kh = selected.ma_kh || ''
  }
}

const openAddModal = (ma_po?: string, ngay_tao?: string, ngay_giao?: string) => {
  selectedMaPO.value = ma_po || ''
  formData.value.ma_po = ma_po || ''
  formData.value.ngay_tao = ngay_tao || ''
  formData.value.ngay_giao = ngay_giao || ''
  showAddModal.value = true
}

const saveItem = async () => {
  try {
    loading.value = true
    
    console.log('Saving QLPO:', formData.value)
    
    if (editId.value !== null) {
      console.log('Updating ID:', editId.value)
      await qlpoService.update(editId.value, formData.value)
    } else {
      console.log('Creating new QLPO')
      await qlpoService.create(formData.value)
    }
    
    console.log('Save successful')
    await loadData()
    closeModal()
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } }; message?: string }
    console.error('Lỗi khi lưu QLPO:', error)
    console.error('Error response:', error.response?.data)
    const errorMsg = error.response?.data?.message || error.message || 'Không thể lưu dữ liệu'
    alert(`Lỗi: ${errorMsg}`)
  } finally {
    loading.value = false
  }
}

const editItem = (item: QLPO) => {
  editId.value = item.id || null
  selectedMaPO.value = ''
  formData.value = {
    ma_po: item.ma_po,
    ma_bv: item.ma_bv,
    ma_kh: item.ma_kh || '',
    so_luong: item.so_luong || 0,
    ngay_tao: item.ngay_tao || '',
    ngay_giao: item.ngay_giao || '',
  }
  showAddModal.value = true
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa dòng này?')) {
    try {
      loading.value = true
      await qlpoService.delete(id)
      await loadData()
      await loadMaPOList()
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
  
  const confirmMsg = `Bạn có chắc muốn xóa toàn bộ PO "${ma_po}"?\n\n` +
    `Sẽ xóa ${group.items.length} Mã BV:\n` +
    group.items.map(item => `- ${item.ma_bv}`).join('\n')
  
  if (confirm(confirmMsg)) {
    try {
      loading.value = true
      
      // Xóa toàn bộ PO bằng 1 API call
      const response = await qlpoService.deleteByMaPO(ma_po)
      
      await loadData()
      await loadMaPOList()
      
      alert(`✅ Đã xóa thành công PO "${ma_po}" (${response.data.deletedCount} Mã BV)`)
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
  selectedMaPO.value = ''
  formData.value = {
    ma_po: '',
    ma_bv: '',
    ma_kh: '',
    so_luong: 0,
    ngay_tao: '',
    ngay_giao: '',
  }
}

const exportToExcel = () => {
  try {
    const excelData: unknown[] = []
    
    groupedData.value.forEach(group => {
      excelData.push({
        'Mã PO': group.ma_po,
        'Mã BV': `Số lượng: ${group.items.length}`,
        'Mã KH': '',
        'Số lượng': '',
        'ĐVT': '',
        'Ngày tạo': formatDate(group.ngay_tao),
        'Ngày giao': formatDate(group.ngay_giao)
      })
      
      group.items.forEach(item => {
        excelData.push({
          'Mã PO': '',
          'Mã BV': item.ma_bv,
          'Mã KH': item.ma_kh || '',
          'Số lượng': item.so_luong || 0,
          'ĐVT': item.dvt || 'p',
          'Ngày tạo': formatDate(item.ngay_tao),
          'Ngày giao': formatDate(item.ngay_giao)
        })
      })
      
      excelData.push({
        'Mã PO': '',
        'Mã BV': '',
        'Mã KH': '',
        'Số lượng': '',
        'ĐVT': '',
        'Ngày tạo': '',
        'Ngày giao': ''
      })
    })
    
    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'PO')
    
    const fileName = `PO_${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(wb, fileName)
    
    alert('Xuất Excel thành công!')
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error)
    alert('Không thể xuất Excel!')
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

const downloadTemplate = () => {
  try {
    const templateData = [
      {
        'Mã PO': 'PO001',
        'Mã BV': 'BV001',
        'Mã KH': 'KH001',
        'Số lượng': 100,
        'ĐVT': 'p',
        'Ngày tạo': '2024-01-15',
        'Ngày giao': '2024-01-20'
      },
      {
        'Mã PO': 'PO001',
        'Mã BV': 'BV002',
        'Mã KH': 'KH002',
        'Số lượng': 150,
        'ĐVT': 'p',
        'Ngày tạo': '2024-01-15',
        'Ngày giao': '2024-01-20'
      },
      {
        'Mã PO': 'PO002',
        'Mã BV': 'BV003',
        'Mã KH': 'KH001',
        'Số lượng': 200,
        'ĐVT': 'p',
        'Ngày tạo': '2024-01-16',
        'Ngày giao': '2024-01-21'
      }
    ]
    
    const wsData = XLSX.utils.json_to_sheet(templateData)
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, wsData, 'Dữ liệu mẫu')
    
    XLSX.writeFile(wb, 'QLPO_Template.xlsx')
    alert('Đã tải file mẫu thành công!')
  } catch (error) {
    console.error('Lỗi khi tải file mẫu:', error)
    alert('Không thể tải file mẫu!')
  }
}

const handleFileImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  try {
    loading.value = true
    
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        
        // Đọc sheet đầu tiên
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        // Chuyển đổi sang JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Array<{
          'Mã PO': string
          'Mã BV': string
          'Mã KH'?: string
          'Số lượng'?: number
          'ĐVT'?: string
          'Ngày tạo': string | number
          'Ngày giao': string | number
        }>
        
        if (jsonData.length === 0) {
          alert('File Excel không có dữ liệu!')
          loading.value = false
          return
        }
        
        // Validate và chuẩn hóa dữ liệu
        const validData: Array<{
          ma_po: string
          ma_bv: string
          ma_kh?: string
          so_luong?: number
          dvt?: string
          ngay_tao: string
          ngay_giao: string
        }> = []
        
        const errors: string[] = []
        
        jsonData.forEach((row, index) => {
          const rowNum = index + 2 // +2 vì Excel bắt đầu từ 1 và có header
          
          // Kiểm tra các trường bắt buộc
          if (!row['Mã PO']) {
            errors.push(`Dòng ${rowNum}: Thiếu Mã PO`)
            return
          }
          if (!row['Mã BV']) {
            errors.push(`Dòng ${rowNum}: Thiếu Mã BV`)
            return
          }
          
          // Chuyển đổi ngày từ Excel
          const convertExcelDate = (value: string | number): string => {
            if (typeof value === 'number') {
              // Excel date serial number
              const date = XLSX.SSF.parse_date_code(value)
              return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
            }
            // Nếu là string, giữ nguyên (giả sử đã đúng định dạng)
            return value
          }
          
          validData.push({
            ma_po: String(row['Mã PO']).trim(),
            ma_bv: String(row['Mã BV']).trim(),
            ma_kh: row['Mã KH'] ? String(row['Mã KH']).trim() : undefined,
            so_luong: row['Số lượng'] ? Number(row['Số lượng']) : undefined,
            dvt: row['ĐVT'] ? String(row['ĐVT']).trim() : undefined,
            ngay_tao: row['Ngày tạo'] ? convertExcelDate(row['Ngày tạo']) : '',
            ngay_giao: row['Ngày giao'] ? convertExcelDate(row['Ngày giao']) : ''
          })
        })
        
        if (errors.length > 0) {
          alert('Có lỗi trong file Excel:\n' + errors.join('\n'))
          loading.value = false
          return
        }
        
        if (validData.length === 0) {
          alert('Không có dữ liệu hợp lệ để import!')
          loading.value = false
          return
        }
        
        // Xác nhận trước khi import
        const confirmMsg = `Bạn có chắc muốn import ${validData.length} dòng dữ liệu?\n\n` +
          `Các Mã PO: ${[...new Set(validData.map(d => d.ma_po))].join(', ')}`
        
        if (!confirm(confirmMsg)) {
          loading.value = false
          return
        }
        
        // Import từng dòng
        let successCount = 0
        let failCount = 0
        const failedRows: string[] = []
        
        for (let i = 0; i < validData.length; i++) {
          try {
            await qlpoService.create(validData[i])
            successCount++
          } catch (err: unknown) {
            failCount++
            const error = err as { response?: { data?: { message?: string } } }
            const errorMsg = error?.response?.data?.message || 'Lỗi không xác định'
            failedRows.push(`Dòng ${i + 2}: ${validData[i].ma_po} - ${validData[i].ma_bv} (${errorMsg})`)
          }
        }
        
        // Reload dữ liệu
        await loadData()
        await loadMaPOList()
        
        // Hiển thị kết quả
        let resultMsg = `Import hoàn tất!\n\n`
        resultMsg += `✅ Thành công: ${successCount} dòng\n`
        if (failCount > 0) {
          resultMsg += `❌ Thất bại: ${failCount} dòng\n\n`
          resultMsg += 'Chi tiết lỗi:\n' + failedRows.join('\n')
        }
        
        alert(resultMsg)
        
      } catch (error) {
        console.error('Lỗi khi xử lý file:', error)
        alert('Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file!')
      } finally {
        loading.value = false
      }
    }
    
    reader.readAsBinaryString(file)
    
  } catch (error) {
    console.error('Lỗi khi import:', error)
    alert('Không thể import file!')
    loading.value = false
  } finally {
    // Reset input để có thể chọn lại cùng file
    target.value = ''
  }
}

onMounted(() => {
  loadData()
  loadMaPOList()
  loadMaBVList()
})
</script>
