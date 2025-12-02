<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Báo giá</h1>
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
          📊 Export Excel {{ filterSoBG ? '(Đã lọc)' : '' }}
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
      <label class="block text-sm font-medium mb-2">Lọc theo Số BG:</label>
      <div class="flex gap-2">
        <input
          v-model="searchSoBG"
          type="text"
          placeholder="Tìm kiếm Số BG..."
          class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          v-model="filterSoBG"
          class="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">Tất cả</option>
          <option v-for="item in filteredSoBGList" :key="item.so_bg" :value="item.so_bg">
            {{ item.so_bg }}
          </option>
        </select>
        <button
          v-if="filterSoBG"
          @click="clearFilter"
          class="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Xóa lọc
        </button>
      </div>
      <p v-if="filterSoBG" class="text-xs text-blue-600 mt-2">
        Đang hiển thị: {{ filteredData.length }} kết quả cho {{ filterSoBG }}
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3">Số BG</th>
              <th class="px-4 py-3">Mã BV</th>
              <th class="px-4 py-3">Số lượng</th>
              <th class="px-4 py-3">Đơn giá</th>
              <th class="px-4 py-3">Thành tiền</th>
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
            <template v-else v-for="group in groupedData" :key="group.so_bg">
              <!-- Header row cho mỗi Số BG -->
              <tr class="bg-blue-50 dark:bg-blue-900 border-b-2 border-blue-200 dark:border-blue-700">
                <td class="px-4 py-3 font-bold text-blue-700 dark:text-blue-300" :rowspan="group.items.length + 1">
                  {{ group.so_bg }}
                </td>
                <td colspan="4" class="px-4 py-2 font-medium">
                  Tổng: {{ formatCurrency(group.total) }}
                </td>
                <td class="px-4 py-2 flex gap-2">
                  <button
                    @click="openAddModal(group.so_bg)"
                    class="text-green-600 hover:text-green-800 text-xs"
                    :disabled="loading"
                  >
                    + Thêm Mã BV
                  </button>
                  <button
                    @click="deleteBG(group.so_bg)"
                    class="text-red-600 hover:text-red-800 text-xs font-medium"
                    :disabled="loading"
                  >
                    🗑️ Xóa BG
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
                <td class="px-4 py-3">{{ item.so_luong }}</td>
                <td class="px-4 py-3">{{ formatCurrency(item.don_gia) }}</td>
                <td class="px-4 py-3 font-medium">{{ formatCurrency(item.thanh_tien) }}</td>
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
          {{ editId !== null ? 'Sửa báo giá' : (selectedSoBG ? `Thêm Mã BV vào ${selectedSoBG}` : 'Thêm báo giá mới') }}
        </h2>
        <form @submit.prevent="saveItem">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">
              Số BG
              <span v-if="!selectedSoBG" class="text-xs text-gray-500 ml-2">(Để trống để tự động tạo)</span>
            </label>
            <input
              v-model="formData.so_bg"
              type="text"
              :readonly="!!selectedSoBG"
              :class="selectedSoBG ? 'bg-gray-100 dark:bg-gray-600' : ''"
              placeholder="VD: BG0001 hoặc để trống"
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
            <label class="block text-sm font-medium mb-2">Số lượng</label>
            <input
              v-model.number="formData.so_luong"
              type="number"
              required
              min="1"
              @input="handleSoLuongChange"
              placeholder="VD: 150"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">
              Đơn giá
              <span v-if="donGiaAuto" class="text-xs text-green-600 ml-2">
                (Tự động từ QLDM - Khoảng: {{ matchedRange }})
              </span>
            </label>
            <input
              v-model.number="formData.don_gia"
              type="number"
              required
              min="0"
              :readonly="donGiaAuto"
              :class="donGiaAuto ? 'bg-gray-100 dark:bg-gray-600' : ''"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <p v-if="donGiaAuto && matchedRange" class="text-xs text-gray-500 mt-1">
              Áp dụng cho số lượng: {{ matchedRange }}
            </p>
          </div>
          <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p class="text-sm font-medium">
              Thành tiền: <span class="text-blue-600 dark:text-blue-300">{{ formatCurrency(thanhTien) }}</span>
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
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SearchableSelect from '@/components/common/SearchableSelect.vue'
import { qlbgService, type QLBG } from '@/services/qlbgService'
import { qldmService } from '@/services/qldmService'
import * as XLSX from 'xlsx'

const data = ref<QLBG[]>([])
const soBGList = ref<{ so_bg: string }[]>([])
const maBVList = ref<{ ma_bv: string }[]>([])
const filterSoBG = ref('')
const searchSoBG = ref('')
const showAddModal = ref(false)
const selectedSoBG = ref('')
const editId = ref<number | null>(null)
const loading = ref(false)
const donGiaAuto = ref(false)
const matchedRange = ref('')
const formData = ref({
  so_bg: '',
  ma_bv: '',
  so_luong: 0,
  don_gia: 0,
})

// Filter Số BG list by search
const filteredSoBGList = computed(() => {
  if (!searchSoBG.value) return soBGList.value
  return soBGList.value.filter(item => 
    item.so_bg.toLowerCase().includes(searchSoBG.value.toLowerCase())
  )
})

// Filter data by selected Số BG
const filteredData = computed(() => {
  if (!filterSoBG.value) return data.value
  return data.value.filter(item => item.so_bg === filterSoBG.value)
})

// Gộp dữ liệu theo Số BG (chỉ dữ liệu đã lọc)
const groupedData = computed(() => {
  const groups: { [key: string]: QLBG[] } = {}
  
  filteredData.value.forEach(item => {
    if (!groups[item.so_bg]) {
      groups[item.so_bg] = []
    }
    groups[item.so_bg].push(item)
  })
  
  return Object.keys(groups).map(so_bg => ({
    so_bg,
    items: groups[so_bg].sort((a, b) => a.stt - b.stt),
    total: groups[so_bg].reduce((sum, item) => sum + Number(item.thanh_tien || 0), 0)
  })).sort((a, b) => b.so_bg.localeCompare(a.so_bg))
})

const clearFilter = () => {
  filterSoBG.value = ''
  searchSoBG.value = ''
}

const maBVOptions = computed(() => {
  return maBVList.value.map(item => ({
    value: item.ma_bv,
    label: item.ma_bv
  }))
})

const thanhTien = computed(() => {
  return formData.value.so_luong * formData.value.don_gia
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
    const response = await qlbgService.getAll()
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

const handleMaBVChange = () => {
  if (formData.value.so_luong > 0) {
    handleSoLuongChange()
  }
}

const handleSoLuongChange = async () => {
  if (formData.value.ma_bv && formData.value.so_luong > 0) {
    try {
      const response = await qlbgService.getDonGia(formData.value.ma_bv, formData.value.so_luong)
      if (response.data.don_gia > 0) {
        formData.value.don_gia = response.data.don_gia
        matchedRange.value = response.data.range || ''
        donGiaAuto.value = true
      } else {
        donGiaAuto.value = false
        matchedRange.value = ''
      }
    } catch (error) {
      console.error('Lỗi khi lấy đơn giá:', error)
      donGiaAuto.value = false
      matchedRange.value = ''
    }
  }
}

const openAddModal = (so_bg?: string) => {
  selectedSoBG.value = so_bg || ''
  formData.value.so_bg = so_bg || ''
  showAddModal.value = true
}

const saveItem = async () => {
  try {
    loading.value = true
    
    if (editId.value !== null) {
      await qlbgService.update(editId.value, formData.value)
    } else {
      await qlbgService.create(formData.value)
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

const editItem = (item: QLBG) => {
  editId.value = item.id || null
  selectedSoBG.value = ''
  formData.value = {
    so_bg: item.so_bg,
    ma_bv: item.ma_bv,
    so_luong: item.so_luong,
    don_gia: item.don_gia,
  }
  donGiaAuto.value = false
  showAddModal.value = true
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa báo giá này?')) {
    try {
      loading.value = true
      await qlbgService.delete(id)
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
  selectedSoBG.value = ''
  donGiaAuto.value = false
  matchedRange.value = ''
  formData.value = {
    so_bg: '',
    ma_bv: '',
    so_luong: 0,
    don_gia: 0,
  }
}

const exportToExcel = () => {
  try {
    // Chuẩn bị dữ liệu cho Excel
    const excelData: unknown[] = []
    
    groupedData.value.forEach(group => {
      // Header cho mỗi Số BG
      excelData.push({
        'Số BG': group.so_bg,
        'Mã BV': '',
        'Số lượng': '',
        'Đơn giá': '',
        'Thành tiền': `Tổng: ${group.total.toLocaleString('vi-VN')} VND`
      })
      
      // Chi tiết từng Mã BV
      group.items.forEach(item => {
        excelData.push({
          'Số BG': '',
          'Mã BV': item.ma_bv,
          'Số lượng': item.so_luong,
          'Đơn giá': item.don_gia,
          'Thành tiền': item.thanh_tien
        })
      })
      
      // Dòng trống giữa các Số BG
      excelData.push({
        'Số BG': '',
        'Mã BV': '',
        'Số lượng': '',
        'Đơn giá': '',
        'Thành tiền': ''
      })
    })
    
    // Tạo worksheet
    const ws = XLSX.utils.json_to_sheet(excelData)
    
    // Tạo workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Báo giá')
    
    // Tạo tên file với timestamp
    const fileName = `BaoGia_${new Date().toISOString().slice(0, 10)}.xlsx`
    
    // Download file
    XLSX.writeFile(wb, fileName)
    
    alert('Xuất Excel thành công!')
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error)
    alert('Không thể xuất Excel!')
  }
}

const loadSoBGList = async () => {
  try {
    const response = await qlbgService.getAllSoBG()
    soBGList.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách Số BG:', error)
  }
}

const downloadTemplate = () => {
  try {
    const templateData = [
      {
        'Số BG': 'BG001',
        'Mã BV': 'BV001',
        'Số lượng': 100,
        'Đơn giá': 50000,
        'Thành tiền': 5000000
      },
      {
        'Số BG': 'BG001',
        'Mã BV': 'BV002',
        'Số lượng': 200,
        'Đơn giá': 60000,
        'Thành tiền': 12000000
      },
      {
        'Số BG': 'BG002',
        'Mã BV': 'BV003',
        'Số lượng': 150,
        'Đơn giá': 55000,
        'Thành tiền': 8250000
      }
    ]
    
    const instructions = [
      ['HƯỚNG DẪN SỬ DỤNG FILE MẪU IMPORT BÁO GIÁ'],
      [''],
      ['1. Số BG: Số báo giá (VD: BG001, BG002)'],
      ['2. Mã BV: Mã bao vải (phải tồn tại trong hệ thống)'],
      ['3. Số lượng: Số lượng sản phẩm'],
      ['4. Đơn giá: Đơn giá sản phẩm (VNĐ)'],
      ['5. Thành tiền: Tự động tính = Số lượng × Đơn giá'],
      [''],
      ['LƯU Ý:'],
      ['- Các dòng có cùng Số BG sẽ được gộp thành 1 nhóm'],
      ['- Mã BV phải tồn tại trong danh mục trước khi import'],
      ['- Thành tiền sẽ được tính lại tự động'],
      [''],
      ['DỮ LIỆU MẪU:']
    ]
    
    const wsInstructions = XLSX.utils.aoa_to_sheet(instructions)
    const wsData = XLSX.utils.json_to_sheet(templateData)
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn')
    XLSX.utils.book_append_sheet(wb, wsData, 'Dữ liệu mẫu')
    
    XLSX.writeFile(wb, 'QLBG_Template.xlsx')
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
        
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Array<{
          'Số BG': string
          'Mã BV': string
          'Số lượng': number
          'Đơn giá': number
          'Thành tiền'?: number
        }>
        
        if (jsonData.length === 0) {
          alert('File Excel không có dữ liệu!')
          loading.value = false
          return
        }
        
        const validData: Array<Partial<QLBG>> = []
        const errors: string[] = []
        
        jsonData.forEach((row, index) => {
          const rowNum = index + 2
          
          if (!row['Số BG']) {
            errors.push(`Dòng ${rowNum}: Thiếu Số BG`)
            return
          }
          if (!row['Mã BV']) {
            errors.push(`Dòng ${rowNum}: Thiếu Mã BV`)
            return
          }
          
          const so_luong = Number(row['Số lượng'] || 0)
          const don_gia = Number(row['Đơn giá'] || 0)
          const thanh_tien = so_luong * don_gia
          
          validData.push({
            so_bg: String(row['Số BG']).trim(),
            ma_bv: String(row['Mã BV']).trim(),
            so_luong,
            don_gia,
            thanh_tien
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
        
        const confirmMsg = `Bạn có chắc muốn import ${validData.length} dòng dữ liệu?\n\n` +
          `Các Số BG: ${[...new Set(validData.map(d => d.so_bg))].join(', ')}`
        
        if (!confirm(confirmMsg)) {
          loading.value = false
          return
        }
        
        let successCount = 0
        let failCount = 0
        const failedRows: string[] = []
        
        for (let i = 0; i < validData.length; i++) {
          try {
            await qlbgService.create(validData[i])
            successCount++
          } catch (err: unknown) {
            failCount++
            const error = err as { response?: { data?: { message?: string } } }
            const errorMsg = error?.response?.data?.message || 'Lỗi không xác định'
            failedRows.push(`Dòng ${i + 2}: ${validData[i].so_bg} - ${validData[i].ma_bv} (${errorMsg})`)
          }
        }
        
        await loadData()
        await loadSoBGList()
        
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
    target.value = ''
  }
}

const deleteBG = async (so_bg: string) => {
  const group = groupedData.value.find(g => g.so_bg === so_bg)
  if (!group) return
  
  const confirmMsg = `Bạn có chắc muốn xóa toàn bộ BG "${so_bg}"?\n\n` +
    `Sẽ xóa ${group.items.length} Mã BV:\n` +
    group.items.map(item => `- ${item.ma_bv}`).join('\n')
  
  if (confirm(confirmMsg)) {
    try {
      loading.value = true
      
      const response = await qlbgService.deleteBySoBG(so_bg)
      
      await loadData()
      await loadSoBGList()
      
      alert(`✅ Đã xóa thành công BG "${so_bg}" (${response.data.deletedCount} Mã BV)`)
    } catch (error) {
      console.error('Lỗi khi xóa BG:', error)
      alert('Không thể xóa BG!')
    } finally {
      loading.value = false
    }
  }
}

onMounted(() => {
  loadData()
  loadSoBGList()
  loadMaBVList()
})
</script>
