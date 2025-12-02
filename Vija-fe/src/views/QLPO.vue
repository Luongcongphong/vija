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
              <th class="px-4 py-3">Ngày tạo</th>
              <th class="px-4 py-3">Ngày giao</th>
              <th class="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="groupedData.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
            </tr>
            <template v-else v-for="group in groupedData" :key="group.ma_po">
              <!-- Header row cho mỗi Mã PO -->
              <tr class="bg-green-50 dark:bg-green-900 border-b-2 border-green-200 dark:border-green-700">
                <td class="px-4 py-3 font-bold text-green-700 dark:text-green-300" :rowspan="group.items.length + 1">
                  {{ group.ma_po }}
                </td>
                <td class="px-4 py-2 font-medium">
                  Số lượng Mã BV: {{ group.items.length }}
                </td>
                <td class="px-4 py-2">
                  {{ formatDate(group.ngay_tao) }}
                </td>
                <td class="px-4 py-2">
                  {{ formatDate(group.ngay_giao) }}
                </td>
                <td class="px-4 py-2 flex gap-2">
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
                <td class="px-4 py-3">{{ item.ma_bv }}</td>
                <td class="px-4 py-3">{{ item.so_luong || 0 }}</td>
                <td class="px-4 py-3">{{ formatDate(item.ngay_tao) }}</td>
                <td class="px-4 py-3">{{ formatDate(item.ngay_giao) }}</td>
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
            />
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
const maBVList = ref<{ ma_bv: string }[]>([])
const filterMaPO = ref('')
const searchMaPO = ref('')
const showAddModal = ref(false)
const selectedMaPO = ref('')
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  ma_po: '',
  ma_bv: '',
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

// Filter data by selected Mã PO
const filteredData = computed(() => {
  if (!filterMaPO.value) return data.value
  return data.value.filter(item => item.ma_po === filterMaPO.value)
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

const clearFilter = () => {
  filterMaPO.value = ''
  searchMaPO.value = ''
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
    const response = await qldmService.getAllMaBV()
    maBVList.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách Mã BV:', error)
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
        'Ngày tạo': formatDate(group.ngay_tao),
        'Ngày giao': formatDate(group.ngay_giao)
      })
      
      group.items.forEach(item => {
        excelData.push({
          'Mã PO': '',
          'Mã BV': item.ma_bv,
          'Ngày tạo': formatDate(item.ngay_tao),
          'Ngày giao': formatDate(item.ngay_giao)
        })
      })
      
      excelData.push({
        'Mã PO': '',
        'Mã BV': '',
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
        'Ngày tạo': '2024-01-15',
        'Ngày giao': '2024-01-20'
      },
      {
        'Mã PO': 'PO001',
        'Mã BV': 'BV002',
        'Ngày tạo': '2024-01-15',
        'Ngày giao': '2024-01-20'
      },
      {
        'Mã PO': 'PO002',
        'Mã BV': 'BV003',
        'Ngày tạo': '2024-01-16',
        'Ngày giao': '2024-01-21'
      }
    ]
    
    // Thêm ghi chú hướng dẫn
    const instructions = [
      ['HƯỚNG DẪN SỬ DỤNG FILE MẪU IMPORT PO'],
      [''],
      ['1. Mã PO: Mã định danh của Purchase Order (VD: PO001, PO002)'],
      ['2. Mã BV: Mã bao vải (phải tồn tại trong hệ thống)'],
      ['3. Ngày tạo: Định dạng YYYY-MM-DD (VD: 2024-01-15)'],
      ['4. Ngày giao: Định dạng YYYY-MM-DD (VD: 2024-01-20)'],
      [''],
      ['LƯU Ý:'],
      ['- Các dòng có cùng Mã PO sẽ được gộp thành 1 nhóm'],
      ['- Mã BV phải tồn tại trong danh mục trước khi import'],
      ['- Ngày giao nên sau ngày tạo'],
      ['- Xóa các dòng hướng dẫn này trước khi import'],
      [''],
      ['DỮ LIỆU MẪU:']
    ]
    
    const wsInstructions = XLSX.utils.aoa_to_sheet(instructions)
    const wsData = XLSX.utils.json_to_sheet(templateData)
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn')
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
