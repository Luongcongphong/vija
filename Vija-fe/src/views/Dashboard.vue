<template>
  <AdminLayout v-if="isAuthenticated">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <button
        @click="exportToExcel"
        :disabled="loading || dashboardData.length === 0"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        📊 Export Excel
      </button>
    </div>

    <!-- Filter -->
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
          @click="clearFilters"
          class="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Xóa tất cả lọc
        </button>
        <p v-if="filterMaPO || filterMaBV || searchMaPO || searchMaBV" class="text-xs text-green-600 flex items-center">
          Đang hiển thị: {{ groupedDashboardData.length }} dòng
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
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Mã PO</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Mã BV</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Mã KH</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Số Lượng</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">ĐVT</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Đơn giá</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">ĐV Tiền Tệ</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Thành Tiền</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Phôi Liệu</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">GC Ngoài</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">GC Nội Bộ</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">XL Bề Mặt</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Vận Chuyển</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Phí QLDN</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Tổng Phí</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Lợi Nhuận</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Tỷ lệ %</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="17" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="dashboardData.length === 0">
              <td colspan="17" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
            </tr>
            <tr
              v-else
              v-for="item in groupedDashboardData"
              :key="item.id"
              :class="[
                'border-b dark:border-gray-700',
                item.isTotal 
                  ? 'bg-blue-50 dark:bg-blue-900 font-bold border-t-2 border-blue-300 dark:border-blue-700' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600" :class="item.isTotal ? 'font-bold text-blue-700 dark:text-blue-300' : 'font-medium text-blue-600'">
                {{ item.ma_po || '-' }}
              </td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.ma_bv }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.ma_kh || '-' }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600" :class="item.isTotal ? 'font-bold' : ''">{{ item.so_luong }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.isTotal ? '' : (item.dvt || 'p') }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.isTotal ? '' : formatCurrency(item.don_gia) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.isTotal ? '' : (item.don_vi_tien_te || 'VND') }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600" :class="item.isTotal ? 'font-bold' : 'font-medium'">{{ formatCurrency(item.thanh_tien) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600" :class="item.isTotal ? 'font-bold' : ''">{{ formatCurrency(item.phoi_lieu) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600" :class="item.isTotal ? 'font-bold' : ''">{{ formatCurrency(item.gia_cong_ngoai) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600" :class="item.isTotal ? 'font-bold' : ''">{{ formatCurrency(item.gia_cong_noi_bo) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600" :class="item.isTotal ? 'font-bold' : ''">{{ formatCurrency(item.xu_ly_be_mat) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600" :class="item.isTotal ? 'font-bold' : ''">{{ formatCurrency(item.van_chuyen) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600" :class="item.isTotal ? 'font-bold' : ''">{{ formatCurrency(item.phi_qldn) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600 font-bold">{{ formatCurrency(item.tong_phi) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600 font-bold" :class="item.loi_nhuan >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(item.loi_nhuan) }}
              </td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600 font-bold" :class="item.ty_le >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ item.ty_le }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Đang chuyển hướng...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { dashboardService } from '@/services/dashboardService'
import { qlpoService } from '@/services/qlpoService'
import * as XLSX from 'xlsx'

interface DashboardItem {
  id: number
  ma_po: string
  ma_bv: string
  ma_kh?: string
  so_luong: number
  dvt?: string
  don_gia: number
  don_vi_tien_te?: string
  thanh_tien: number
  phoi_lieu: number
  gia_cong_ngoai: number
  gia_cong_noi_bo: number
  xu_ly_be_mat: number
  van_chuyen: number
  phi_qldn: number
  tong_phi: number
  loi_nhuan: number
  ty_le: number
  ngay_tao: string
}

const router = useRouter()
const dashboardData = ref<DashboardItem[]>([])
const maPOList = ref<{ ma_po: string }[]>([])
const filterMaPO = ref('')
const searchMaPO = ref('')
const filterMaBV = ref('')
const searchMaBV = ref('')
const loading = ref(false)

// Computed property để kiểm tra authentication
const isAuthenticated = computed(() => {
  const authStatus = localStorage.getItem('isAuthenticated') === 'true'
  const hasToken = !!localStorage.getItem('token')
  return authStatus && hasToken
})

// DISABLED: Router guard đã xử lý authentication redirect
// watchEffect này gây ra redirect loop
// watchEffect(() => {
//   if (!isAuthenticated.value) {
//     console.log('Authentication lost, redirecting to signin')
//     router.replace('/signin')
//   }
// })

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value)
}

// Filter Mã PO list by search
const filteredMaPOList = computed(() => {
  if (!searchMaPO.value) return maPOList.value
  return maPOList.value.filter(item => 
    item.ma_po.toLowerCase().includes(searchMaPO.value.toLowerCase())
  )
})

// Get unique Mã BV list from data
const maBVList = computed(() => {
  const uniqueBV = [...new Set(dashboardData.value.map(item => item.ma_bv))]
  return uniqueBV.sort()
})

// Filter Mã BV list by search
const filteredMaBVList = computed(() => {
  if (!searchMaBV.value) return maBVList.value
  return maBVList.value.filter(item => 
    item.toLowerCase().includes(searchMaBV.value.toLowerCase())
  )
})

// Filter dashboard data by Mã PO and/or Mã BV
// Filter dashboard data by search text and selected values
const filteredDashboardData = computed(() => {
  let result = dashboardData.value
  
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
    result = result.filter(item => item.ma_po && item.ma_po.includes(filterMaPO.value))
  }
  
  // Filter theo selected value Mã BV (khi user chọn từ dropdown)
  if (filterMaBV.value) {
    result = result.filter(item => item.ma_bv === filterMaBV.value)
  }
  
  return result
})

// Group data by Mã PO and add summary rows
const groupedDashboardData = computed(() => {
  const filtered = filteredDashboardData.value
  if (filtered.length === 0) return []
  
  const result: Array<DashboardItem & { isTotal?: boolean }> = []
  const groups: { [key: string]: DashboardItem[] } = {}
  
  // Group by ma_po
  filtered.forEach(item => {
    const maPO = item.ma_po || 'Không có PO'
    if (!groups[maPO]) {
      groups[maPO] = []
    }
    groups[maPO].push(item)
  })
  
  // Add items and summary for each group
  Object.keys(groups).sort().forEach(maPO => {
    const items = groups[maPO]
    
    // Add all items in group
    items.forEach(item => {
      result.push({ ...item, isTotal: false })
    })
    
    // Calculate totals (convert to number to handle string values from backend)
    const totalSoLuong = items.reduce((sum, item) => sum + Number(item.so_luong || 0), 0)
    const totalThanhTien = items.reduce((sum, item) => sum + Number(item.thanh_tien || 0), 0)
    const totalPhoiLieu = items.reduce((sum, item) => sum + Number(item.phoi_lieu || 0), 0)
    const totalGiaCongNgoai = items.reduce((sum, item) => sum + Number(item.gia_cong_ngoai || 0), 0)
    const totalGiaCongNoiBo = items.reduce((sum, item) => sum + Number(item.gia_cong_noi_bo || 0), 0)
    const totalXuLyBeMat = items.reduce((sum, item) => sum + Number(item.xu_ly_be_mat || 0), 0)
    const totalVanChuyen = items.reduce((sum, item) => sum + Number(item.van_chuyen || 0), 0)
    const totalPhiQLDN = items.reduce((sum, item) => sum + Number(item.phi_qldn || 0), 0)
    const totalTongPhi = items.reduce((sum, item) => sum + Number(item.tong_phi || 0), 0)
    const totalLoiNhuan = items.reduce((sum, item) => sum + Number(item.loi_nhuan || 0), 0)
    const avgTyLe = totalThanhTien > 0 
      ? Math.round((totalLoiNhuan / totalThanhTien * 100) * 100) / 100 
      : 0
    
    // Add summary row
    result.push({
      id: -Math.abs(maPO.charCodeAt(0) + Date.now()),
      ma_po: `TỔNG `,
      ma_bv: '',
      ma_kh: '',
      so_luong: totalSoLuong,
      dvt: '',
      don_gia: 0,
      don_vi_tien_te: '',
      thanh_tien: totalThanhTien,
      phoi_lieu: totalPhoiLieu,
      gia_cong_ngoai: totalGiaCongNgoai,
      gia_cong_noi_bo: totalGiaCongNoiBo,
      xu_ly_be_mat: totalXuLyBeMat,
      van_chuyen: totalVanChuyen,
      phi_qldn: totalPhiQLDN,
      tong_phi: totalTongPhi,
      loi_nhuan: totalLoiNhuan,
      ty_le: avgTyLe,
      ngay_tao: '',
      isTotal: true
    })
  })
  
  return result
})

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

const loadData = async () => {
  // Kiểm tra authentication trước khi gọi API
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const hasToken = !!localStorage.getItem('token')
  
  if (!isAuthenticated || !hasToken) {
    console.log('Not authenticated, skip loading data')
    return
  }
  
  try {
    loading.value = true
    const response = await dashboardService.getData()
    dashboardData.value = response.data || []
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu Dashboard:', error)
    dashboardData.value = []
    alert('Không thể tải dữ liệu Dashboard!')
  } finally {
    loading.value = false
  }
}

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

const clearFilters = () => {
  filterMaPO.value = ''
  searchMaPO.value = ''
  filterMaBV.value = ''
  searchMaBV.value = ''
}

const exportToExcel = () => {
  const dataToExport = groupedDashboardData.value
  
  if (dataToExport.length === 0) {
    alert('Không có dữ liệu để export!')
    return
  }

  const excelData = dataToExport.map(item => ({
    'Mã PO': item.ma_po || '-',
    'Mã BV': item.ma_bv,
    'Mã KH': item.ma_kh || '-',
    'Số Lượng': item.so_luong,
    'ĐVT': item.isTotal ? '' : (item.dvt || 'p'),
    'Đơn giá': item.isTotal ? '' : item.don_gia,
    'ĐV Tiền Tệ': item.isTotal ? '' : (item.don_vi_tien_te || 'VND'),
    'Thành Tiền': item.thanh_tien,
    'Phôi Liệu': item.phoi_lieu,
    'Gia Công Ngoài': item.gia_cong_ngoai,
    'Gia Công Nội Bộ': item.gia_cong_noi_bo,
    'Xử lý Bề Mặt': item.xu_ly_be_mat,
    'Vận Chuyển': item.van_chuyen,
    'Phí QLDN': item.phi_qldn,
    'Tổng Phí': item.tong_phi,
    'Lợi Nhuận': item.loi_nhuan,
    'Tỷ lệ (%)': item.ty_le,
  }))

  const ws = XLSX.utils.json_to_sheet(excelData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Dashboard')
  
  const filename = `Dashboard_${new Date().toISOString().slice(0, 10)}.xlsx`
  XLSX.writeFile(wb, filename)
}

onMounted(() => {
  loadMaPOList()
  loadData()
})
</script>
