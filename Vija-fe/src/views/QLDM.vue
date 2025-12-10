<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Định mức (Bản Vẽ)</h1>
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
          📊 Export Excel
        </button>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Thêm mới
        </button>
      </div>
    </div>



    <!-- Filter with Search -->
    <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <label class="block text-sm font-medium mb-2">Lọc theo Mã BV:</label>
      <div class="flex gap-2">
        <input
          v-model="searchMaBV"
          type="text"
          placeholder="Tìm kiếm Mã BV..."
          @keyup.enter="selectFirstMatch"
          class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          v-model="filterMaBV"
          class="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">Tất cả</option>
          <option v-for="item in filteredMaBVList" :key="item.ma_bv" :value="item.ma_bv">
            {{ item.ma_bv }}
          </option>
        </select>
        <button
          v-if="filterMaBV"
          @click="clearFilter"
          class="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Xóa lọc
        </button>
      </div>
      <p v-if="filterMaBV" class="text-xs text-green-600 mt-2">
        Đang hiển thị: {{ filteredData.length }} kết quả cho {{ filterMaBV }}
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left border-collapse">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Mã KH</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Số BG</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Ngày BG</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Mã BV</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Nguyên Liệu</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">XLBM</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Đơn Vị</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Số lượng</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Đơn giá</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">ĐV Tiền tệ</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Ghi Chú</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="12" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="filteredData.length === 0">
              <td colspan="12" class="px-4 py-8 text-center text-gray-500">{{ searchMaBV ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu' }}</td>
            </tr>
            <tr
              v-else
              v-for="item in filteredData"
              :key="item.id"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.ma_kh || '-' }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.so_bg || '-' }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ formatDate(item.ngay_bg) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600 font-medium">{{ item.ma_bv }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.nguyen_lieu || '-' }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.xlbm || '-' }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.dvt || 'p' }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.so_luong }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ formatCurrency(item.don_gia) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.don_vi_tien_te || 'VND' }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.ghi_chu || '-' }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-99999 p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ editId !== null ? 'Sửa định mức' : 'Thêm định mức mới' }}
        </h2>
        <form @submit.prevent="saveItem">
          <div class="grid grid-cols-2 gap-4">
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
              <label class="block text-sm font-medium mb-2">Số BG</label>
              <input
                v-model="formData.so_bg"
                type="text"
                placeholder="VD: BG001 (Tùy chọn)"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Ngày BG</label>
              <input
                v-model="formData.ngay_bg"
                type="date"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
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
              <label class="block text-sm font-medium mb-2">Nguyên Liệu</label>
              <input
                v-model="formData.nguyen_lieu"
                type="text"
                placeholder="VD: Thép không gỉ"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">XLBM</label>
              <input
                v-model="formData.xlbm"
                type="text"
                placeholder="VD: Mạ kẽm"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Đơn Vị</label>
              <select
                v-model="formData.dvt"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="p">p</option>
                <option value="cặp">cặp</option>
                <option value="bộ">bộ</option>
                <option value="kg">kg</option>
                <option value="m">m</option>
                <option value="m2">m²</option>
                <option value="m3">m³</option>
              </select>
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
              <p class="text-xs text-gray-500 mt-1">Số lượng định mức</p>
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
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">ĐV Tiền tệ</label>
              <select
                v-model="formData.don_vi_tien_te"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="VND">VND</option>
                <option value="AUD">AUD</option>
                <option value="SGD">SGD</option>
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
                <option value="KRW">KRW</option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Ghi Chú</label>
            <textarea
              v-model="formData.ghi_chu"
              rows="3"
              placeholder="Ghi chú thêm..."
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            ></textarea>
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
import * as XLSX from 'xlsx'

const data = ref<QLDM[]>([])
const maBVList = ref<{ ma_bv: string }[]>([])
const searchMaBV = ref('')
const filterMaBV = ref('')
const showAddModal = ref(false)
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  ma_kh: '',
  so_bg: '',
  ngay_bg: '',
  ma_bv: '',
  nguyen_lieu: '',
  xlbm: '',
  dvt: 'p',
  so_luong: 0,
  don_gia: 0,
  don_vi_tien_te: 'VND',
  ghi_chu: '',
})



// Filter Mã BV list by search
const filteredMaBVList = computed(() => {
  if (!searchMaBV.value) return maBVList.value
  return maBVList.value.filter(item => 
    item.ma_bv.toLowerCase().includes(searchMaBV.value.toLowerCase())
  )
})

// Filter data by selected Mã BV
const filteredData = computed(() => {
  if (!filterMaBV.value) return data.value
  return data.value.filter(item => item.ma_bv === filterMaBV.value)
})

const selectFirstMatch = () => {
  if (filteredMaBVList.value.length > 0) {
    filterMaBV.value = filteredMaBVList.value[0].ma_bv
  }
}

const clearFilter = () => {
  filterMaBV.value = ''
  searchMaBV.value = ''
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('vi-VN')
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

const loadMaBVList = async () => {
  try {
    const response = await qldmService.getAllMaBV()
    maBVList.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách Mã BV:', error)
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
    ma_kh: item.ma_kh || '',
    so_bg: item.so_bg || '',
    ngay_bg: item.ngay_bg || '',
    ma_bv: item.ma_bv,
    nguyen_lieu: item.nguyen_lieu || '',
    xlbm: item.xlbm || '',
    dvt: item.dvt || 'p',
    so_luong: item.so_luong,
    don_gia: item.don_gia,
    don_vi_tien_te: item.don_vi_tien_te || 'VND',
    ghi_chu: item.ghi_chu || '',
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
    ma_kh: '',
    so_bg: '',
    ngay_bg: '',
    ma_bv: '',
    nguyen_lieu: '',
    xlbm: '',
    dvt: 'p',
    so_luong: 0,
    don_gia: 0,
    don_vi_tien_te: 'VND',
    ghi_chu: '',
  }
}

const downloadTemplate = () => {
  try {
    const templateData = [
      {
        'Mã BV': 'BV001',
        'Số BG': 'BG001',
        'Mã KH': 'KH001',
        'Số lượng': 50,
        'ĐVT': 'p',
        'Đơn giá': 23000,
        'ĐV Tiền tệ': 'VND'
      },
      {
        'Mã BV': 'BV001',
        'Số BG': 'BG001',
        'Mã KH': 'KH001',
        'Số lượng': 100,
        'ĐVT': 'p',
        'Đơn giá': 12000,
        'ĐV Tiền tệ': 'VND'
      },
      {
        'Mã BV': 'BV002',
        'Số BG': 'BG002',
        'Mã KH': 'KH002',
        'Số lượng': 200,
        'ĐVT': 'cặp',
        'Đơn giá': 8000,
        'ĐV Tiền tệ': 'VND'
      }
    ]
    
    const wb = XLSX.utils.book_new()
    const wsData = XLSX.utils.json_to_sheet(templateData)
    
    XLSX.utils.book_append_sheet(wb, wsData, 'Định mức')
    
    XLSX.writeFile(wb, 'QLDM_Template.xlsx')
    alert('Đã tải file mẫu thành công!')
  } catch (error) {
    console.error('Lỗi khi tải file mẫu:', error)
    alert('Không thể tải file mẫu!')
  }
}

const exportToExcel = () => {
  try {
    const excelData = data.value.map(item => ({
      'Mã BV': item.ma_bv,
      'Số BG': item.so_bg || '',
      'Mã KH': item.ma_kh || '',
      'Số lượng': item.so_luong,
      'ĐVT': item.dvt || 'p',
      'Đơn giá': item.don_gia,
      'ĐV Tiền tệ': item.don_vi_tien_te || 'VND'
    }))
    
    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Định mức')
    
    const fileName = `QLDM_${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(wb, fileName)
    
    alert('Xuất Excel thành công!')
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error)
    alert('Không thể xuất Excel!')
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
          'Mã BV': string
          'Số BG'?: string
          'Mã KH'?: string
          'Số lượng': number
          'ĐVT'?: string
          'Đơn giá': number
          'ĐV Tiền tệ'?: string
        }>
        
        if (jsonData.length === 0) {
          alert('File Excel không có dữ liệu!')
          loading.value = false
          return
        }
        
        const validData: Array<Partial<QLDM>> = []
        const errors: string[] = []
        
        jsonData.forEach((row, index) => {
          const rowNum = index + 2
          
          if (!row['Mã BV']) {
            errors.push(`Dòng ${rowNum}: Thiếu Mã BV`)
            return
          }
          if (!row['Số lượng']) {
            errors.push(`Dòng ${rowNum}: Thiếu Số lượng`)
            return
          }
          if (!row['Đơn giá']) {
            errors.push(`Dòng ${rowNum}: Thiếu Đơn giá`)
            return
          }
          
          validData.push({
            ma_bv: String(row['Mã BV']).trim(),
            so_bg: row['Số BG'] ? String(row['Số BG']).trim() : '',
            ma_kh: row['Mã KH'] ? String(row['Mã KH']).trim() : '',
            so_luong: Number(row['Số lượng']),
            dvt: row['ĐVT'] ? String(row['ĐVT']).trim() : 'p',
            don_gia: Number(row['Đơn giá']),
            don_vi_tien_te: row['ĐV Tiền tệ'] ? String(row['ĐV Tiền tệ']).trim() : 'VND'
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
        
        const confirmMsg = `Bạn có chắc muốn import ${validData.length} dòng dữ liệu?`
        
        if (!confirm(confirmMsg)) {
          loading.value = false
          return
        }
        
        let successCount = 0
        let failCount = 0
        const failedRows: string[] = []
        
        for (let i = 0; i < validData.length; i++) {
          try {
            await qldmService.create(validData[i])
            successCount++
          } catch (err: unknown) {
            failCount++
            const error = err as { response?: { data?: { message?: string } } }
            const errorMsg = error?.response?.data?.message || 'Lỗi không xác định'
            failedRows.push(`Dòng ${i + 2}: ${validData[i].ma_bv} (${errorMsg})`)
          }
        }
        
        await loadData()
        
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

onMounted(() => {
  loadData()
  loadMaBVList()
})
</script>
