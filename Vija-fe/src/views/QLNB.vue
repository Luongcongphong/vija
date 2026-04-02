<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Nội bộ</h1>
      <div class="flex gap-2">
        <button
          @click="downloadTemplate"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          📥 Tải file mẫu
        </button>
        <button
          @click="exportToExcel"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          :disabled="loading"
        >
          📊 Export Excel {{ filterMaPO ? '(Đã lọc)' : '' }}
        </button>
        <button
          @click="refreshData"
          class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          :disabled="loading"
        >
          🔄 Refresh PO
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
              placeholder="Gõ để tìm tất cả PO chứa từ khóa..."
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
              placeholder="Gõ để tìm tất cả BV chứa từ khóa..."
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
          v-if="filterMaPO || filterMaBV || searchMaPO || searchMaBV"
          @click="clearFilter"
          class="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Xóa tất cả lọc
        </button>
        <p v-if="filterMaPO || filterMaBV || searchMaPO || searchMaBV" class="text-xs text-green-600 flex items-center">
          Đang hiển thị: {{ filteredData.length }} kết quả
          <span v-if="searchMaPO"> tìm PO: "{{ searchMaPO }}"</span>
          <span v-if="filterMaPO"> cho PO: {{ filterMaPO }}</span>
          <span v-if="searchMaBV"> tìm BV: "{{ searchMaBV }}"</span>
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
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Phôi Liệu</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">GC Ngoài</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">GC Nội Bộ</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">XL Bề Mặt</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Vận Chuyển</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Phí QLDN</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Tổng Phí</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="13" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="groupedData.length === 0">
              <td colspan="13" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
            </tr>
            <template v-else v-for="group in groupedData" :key="group.ma_po">
              <!-- Header row cho mỗi Mã PO -->
              <tr class="bg-green-50 dark:bg-green-900 border-b-2 border-green-200 dark:border-green-700">
                <td class="px-3 py-1.5 font-bold text-green-700 dark:text-green-300 border border-gray-300 dark:border-gray-600" :rowspan="group.totalRows">
                  {{ group.ma_po }}
                </td>
                <td class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600" colspan="2">
                  SLBV: {{ group.items.length }}/{{ group.totalBVCount }}
                  <span v-if="group.missingBVs.length > 0" class="text-orange-600 font-medium">
                    ({{ group.missingBVs.length }} thiếu)
                  </span>
                </td>
                <td class="px-1 py-1 border border-gray-300 dark:border-gray-600" colspan="8"></td>
                <td class="px-1 py-1 border border-gray-300 dark:border-gray-600 flex gap-1">
                </td>
              </tr>
              <!-- Chi tiết từng Mã BV có dữ liệu -->
              <tr
                v-for="item in group.items"
                :key="item.id"
                class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.ma_bv }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.ma_kh || '-' }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.so_luong || 0 }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ item.dvt || 'p' }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatCurrency(item.phoi_lieu) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatCurrency(item.gia_cong_ngoai) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatCurrency(item.gia_cong_noi_bo) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatCurrency(item.xu_ly_be_mat) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatCurrency(item.van_chuyen) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatCurrency(item.phi_qldn) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 font-medium">{{ formatCurrency(item.tong_phi || 0) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">
                  <button
                    @click="editItem(item)"
                    class="text-blue-600 hover:text-blue-800"
                    :disabled="loading"
                  >
                    Sửa
                  </button>
                </td>
              </tr>
              
              <!-- Hiển thị các Mã BV còn thiếu -->
              <tr
                v-for="missingBV in group.missingBVs"
                :key="`missing-${group.ma_po}-${missingBV.ma_bv}`"
                class="border-b dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20"
              >
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">
                  {{ missingBV.ma_bv }}
                  <span class="text-xs text-orange-500 ml-1">(chưa có chi phí)</span>
                </td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-400">{{ missingBV.ma_kh || '-' }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ missingBV.so_luong || 0 }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-400">{{ missingBV.dvt || '-' }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-400">-</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-400">-</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-400">-</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-400">-</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-400">-</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-400">-</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-400">0</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">
                  <button
                    @click="editMissingBV(group.ma_po, missingBV)"
                    class="text-blue-600 hover:text-blue-800"
                    :disabled="loading"
                  >
                    Sửa
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-99999 p-4"
    >
      <form @submit.prevent="saveItem" class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-5xl flex flex-col max-h-[96vh]">
        <!-- Header cố định -->
        <div class="p-6 border-b dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Sửa chi phí nội bộ
          </h2>
        </div>
        
        <!-- Nội dung có scroll -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="mb-4">
            <SearchableSelect
              v-model="formData.ma_po"
              :options="maPOOptions"
              label="Mã PO"
              placeholder="Chọn hoặc tìm Mã PO..."
              :required="true"
              max-height="max-h-80"
              @update:modelValue="handleMaPOChange"
            />
          </div>
          
          <!-- Form nhập thủ công (hiển thị khi sửa) -->
          <div class="grid grid-cols-2 gap-4">
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
              <label class="block text-sm font-medium mb-2">Số lượng (tự động)</label>
              <input
                v-model.number="formData.so_luong"
                type="number"
                readonly
                class="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Mã KH (Từ PO)</label>
              <input
                v-model="formData.ma_kh"
                type="text"
                readonly
                class="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">ĐVT (Từ PO)</label>
              <input
                v-model="formData.dvt"
                type="text"
                readonly
                class="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600"
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
        </div>
        
        <!-- Footer cố định -->
        <div class="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div class="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p class="text-sm font-medium">
                Tổng phí: <span class="text-blue-600 dark:text-blue-300">{{ formatCurrency(tongPhi) }}</span>
              </p>
            </div>
            
            <div class="flex gap-2 text-right w-full justify-end mt-4 md:mt-0">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SearchableSelect from '@/components/common/SearchableSelect.vue'
import { qlnbService, type QLNB } from '@/services/qlnbService'
import { qlpoService } from '@/services/qlpoService'
import * as XLSX from 'xlsx'

const data = ref<QLNB[]>([])
const qlpoData = ref<Array<{ ma_po: string; ma_bv: string; ma_kh?: string; dvt?: string; so_luong?: number }>>([])
const maPOList = ref<{ ma_po: string }[]>([])
const filterMaPO = ref('')
const searchMaPO = ref('')
const filterMaBV = ref('')
const searchMaBV = ref('')
const showAddModal = ref(false)
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  ma_po: '',
  ma_bv: '',
  ma_kh: '',
  dvt: '',
  so_luong: 0,
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

// Get unique Mã BV list from data
const maBVList = computed(() => {
  const uniqueBV = [...new Set(data.value.map(item => item.ma_bv))]
  return uniqueBV.sort()
})

// Filter Mã BV list by search
const filteredMaBVList = computed(() => {
  if (!searchMaBV.value) return maBVList.value
  return maBVList.value.filter(item => 
    item.toLowerCase().includes(searchMaBV.value.toLowerCase())
  )
})

// Filter data by selected Mã PO and/or Mã BV
// Filter data by search text and selected values
const filteredData = computed(() => {
  let result = data.value
  
  // Filter theo search text Mã PO (khi user gõ vào input)
  if (searchMaPO.value) {
    result = result.filter(item => 
      item.ma_po && item.ma_po.toLowerCase().includes(searchMaPO.value.toLowerCase())
    )
  }
  
  // Filter theo search text Mã BV (khi user gõ vào input)
  if (searchMaBV.value) {
    result = result.filter(item => 
      item.ma_bv && item.ma_bv.toLowerCase().includes(searchMaBV.value.toLowerCase())
    )
  }
  
  // Filter theo selected value Mã PO (khi user chọn từ dropdown)
  if (filterMaPO.value) {
    result = result.filter(item => item.ma_po === filterMaPO.value)
  }
  
  // Filter theo selected value Mã BV (khi user chọn từ dropdown)
  if (filterMaBV.value) {
    result = result.filter(item => item.ma_bv === filterMaBV.value)
  }
  
  return result
})

// Gộp dữ liệu theo Mã PO và tính toán Mã BV còn thiếu
const groupedData = computed(() => {
  const groups: { [key: string]: QLNB[] } = {}
  
  // Nhóm dữ liệu QLNB theo Mã PO
  filteredData.value.forEach(item => {
    if (!groups[item.ma_po]) {
      groups[item.ma_po] = []
    }
    groups[item.ma_po].push(item)
  })
  
  // Lấy tất cả Mã PO từ QLPO (bao gồm cả PO không có trong QLNB)
  const allPOs = [...new Set([
    ...Object.keys(groups),
    ...qlpoData.value.map(item => item.ma_po)
  ])]
  
  return allPOs.map(ma_po => {
    const items = groups[ma_po] || []
    
    // Lấy tất cả Mã BV từ QLPO cho PO này
    const allBVsInPO = qlpoData.value.filter(item => item.ma_po === ma_po)
    
    // Tìm các Mã BV còn thiếu (có trong QLPO nhưng chưa có trong QLNB)
    const existingBVs = items.map(item => item.ma_bv)
    const missingBVs = allBVsInPO.filter(bv => !existingBVs.includes(bv.ma_bv))
    
    return {
      ma_po,
      items,
      missingBVs,
      totalBVCount: allBVsInPO.length,
      totalRows: items.length + missingBVs.length + 1 // +1 for header row
    }
  })
  .filter(group => group.items.length > 0 || group.missingBVs.length > 0) // Chỉ hiển thị PO có dữ liệu
  .sort((a, b) => b.ma_po.localeCompare(a.ma_po))
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
  // Kiểm tra authentication trước khi gọi API
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const hasToken = !!localStorage.getItem('token')
  
  if (!isAuthenticated || !hasToken) {
    console.log('Not authenticated, skip loading QLPO')
    return
  }
  
  try {
    const response = await qlpoService.getAll()
    qlpoData.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải QLPO:', error)
  }
}

const loadMaPOList = async () => {
  // Kiểm tra authentication trước khi gọi API
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const hasToken = !!localStorage.getItem('token')
  
  if (!isAuthenticated || !hasToken) {
    console.log('Not authenticated, skip loading PO list')
    return
  }
  
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


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value)
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

// Hàm refresh tất cả dữ liệu
const refreshData = async () => {
  try {
    loading.value = true
    console.log('Refreshing all data...')
    
    // Load lại dữ liệu từ QLPO trước
    await loadQLPO()
    await loadMaPOList()
    
    // Sau đó load lại QLNB
    await loadData()
    
    alert('✅ Đã cập nhật dữ liệu từ QLPO!')
  } catch (error) {
    console.error('Lỗi khi refresh:', error)
    alert('Không thể refresh dữ liệu!')
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
    ma_kh: item.ma_kh || '',
    dvt: item.dvt || '',
    so_luong: item.so_luong || 0,
    phoi_lieu: item.phoi_lieu,
    gia_cong_ngoai: item.gia_cong_ngoai,
    gia_cong_noi_bo: item.gia_cong_noi_bo,
    xu_ly_be_mat: item.xu_ly_be_mat,
    van_chuyen: item.van_chuyen,
    phi_qldn: item.phi_qldn,
  }
  showAddModal.value = true
}

const editMissingBV = (ma_po: string, missingBV: any) => {
  editId.value = null // Null means it will create a new record
  formData.value = {
    ma_po: ma_po,
    ma_bv: missingBV.ma_bv,
    ma_kh: missingBV.ma_kh || '',
    dvt: missingBV.dvt || '',
    so_luong: missingBV.so_luong || 0,
    phoi_lieu: 0,
    gia_cong_ngoai: 0,
    gia_cong_noi_bo: 0,
    xu_ly_be_mat: 0,
    van_chuyen: 0,
    phi_qldn: 0,
  }
  showAddModal.value = true
}


const closeModal = () => {
  showAddModal.value = false
  editId.value = null
  formData.value = {
    ma_po: '',
    ma_bv: '',
    ma_kh: '',
    dvt: '',
    so_luong: 0,
    phoi_lieu: 0,
    gia_cong_ngoai: 0,
    gia_cong_noi_bo: 0,
    xu_ly_be_mat: 0,
    van_chuyen: 0,
    phi_qldn: 0,
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
        'Phôi Liệu': 50000,
        'Gia Công Ngoài': 30000,
        'Gia Công Nội Bộ': 20000,
        'Xử lý Bề Mặt': 15000,
        'Vận Chuyển': 10000,
        'Phí QLDN': 5000
      },
      {
        'Mã PO': 'PO001',
        'Mã BV': 'BV002',
        'Mã KH': 'KH002',
        'Số lượng': 200,
        'ĐVT': 'p',
        'Phôi Liệu': 80000,
        'Gia Công Ngoài': 40000,
        'Gia Công Nội Bộ': 25000,
        'Xử lý Bề Mặt': 18000,
        'Vận Chuyển': 12000,
        'Phí QLDN': 6000
      }
    ]
    
    const wb = XLSX.utils.book_new()
    const wsData = XLSX.utils.json_to_sheet(templateData)
    
    XLSX.utils.book_append_sheet(wb, wsData, 'Dữ liệu mẫu')
    
    XLSX.writeFile(wb, 'QLNB_Template.xlsx')
    alert('Đã tải file mẫu thành công!')
  } catch (error) {
    console.error('Lỗi khi tải file mẫu:', error)
    alert('Không thể tải file mẫu!')
  }
}

const exportToExcel = () => {
  try {
    const dataToExport = filterMaPO.value ? filteredData.value : data.value
    
    if (dataToExport.length === 0) {
      alert('Không có dữ liệu để export!')
      return
    }

    const excelData: unknown[] = []
    
    groupedData.value.forEach(group => {
      excelData.push({
        'Mã PO': group.ma_po,
        'Mã BV': `Số lượng: ${group.items.length}`,
        'Mã KH': '',
        'Số lượng': '',
        'ĐVT': '',
        'Phôi Liệu': '',
        'Gia Công Ngoài': '',
        'Gia Công Nội Bộ': '',
        'Xử lý Bề Mặt': '',
        'Vận Chuyển': '',
        'Phí QLDN': '',
        'Tổng Phí': ''
      })
      
      group.items.forEach(item => {
        excelData.push({
          'Mã PO': '',
          'Mã BV': item.ma_bv,
          'Mã KH': item.ma_kh || '-',
          'Số lượng': item.so_luong || 0,
          'ĐVT': item.dvt || 'p',
          'Phôi Liệu': item.phoi_lieu,
          'Gia Công Ngoài': item.gia_cong_ngoai,
          'Gia Công Nội Bộ': item.gia_cong_noi_bo,
          'Xử lý Bề Mặt': item.xu_ly_be_mat,
          'Vận Chuyển': item.van_chuyen,
          'Phí QLDN': item.phi_qldn,
          'Tổng Phí': item.tong_phi || 0
        })
      })
      
      excelData.push({
        'Mã PO': '',
        'Mã BV': '',
        'Mã KH': '',
        'Số lượng': '',
        'ĐVT': '',
        'Phôi Liệu': '',
        'Gia Công Ngoài': '',
        'Gia Công Nội Bộ': '',
        'Xử lý Bề Mặt': '',
        'Vận Chuyển': '',
        'Phí QLDN': '',
        'Tổng Phí': ''
      })
    })
    
    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Chi phí nội bộ')
    
    const fileName = `QLNB_${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(wb, fileName)
    
    alert('Xuất Excel thành công!')
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error)
    alert('Không thể xuất Excel!')
  }
}


onMounted(() => {
  loadQLPO()
  loadMaPOList()
  loadData()
})
</script>
