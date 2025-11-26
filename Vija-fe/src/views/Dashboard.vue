<template>
  <AdminLayout>
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
      <label class="block text-sm font-medium mb-2">Lọc theo Số BG:</label>
      <select
        v-model="filterSoBG"
        @change="loadData"
        class="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">Tất cả</option>
        <option v-for="item in soBGList" :key="item.so_bg" :value="item.so_bg">
          {{ item.so_bg }}
        </option>
      </select>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3">STT</th>
              <th class="px-4 py-3">Số BG</th>
              <th class="px-4 py-3">Mã PO</th>
              <th class="px-4 py-3">Mã BV</th>
              <th class="px-4 py-3">SL</th>
              <th class="px-4 py-3">Đơn giá</th>
              <th class="px-4 py-3">Thành Tiền</th>
              <th class="px-4 py-3">Phôi Liệu</th>
              <th class="px-4 py-3">GC Ngoài</th>
              <th class="px-4 py-3">GC Nội Bộ</th>
              <th class="px-4 py-3">XL Bề Mặt</th>
              <th class="px-4 py-3">Vận Chuyển</th>
              <th class="px-4 py-3">Phí QLDN</th>
              <th class="px-4 py-3">Tổng Phí</th>
              <th class="px-4 py-3">Lợi Nhuận</th>
              <th class="px-4 py-3">Tỷ lệ %</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="16" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="dashboardData.length === 0">
              <td colspan="16" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
            </tr>
            <tr
              v-else
              v-for="item in dashboardData"
              :key="item.id"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3">{{ item.stt }}</td>
              <td class="px-4 py-3 font-medium text-blue-600">{{ item.so_bg }}</td>
              <td class="px-4 py-3">{{ item.ma_po || '-' }}</td>
              <td class="px-4 py-3">{{ item.ma_bv }}</td>
              <td class="px-4 py-3">{{ item.so_luong }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.don_gia) }}</td>
              <td class="px-4 py-3 font-medium">{{ formatCurrency(item.thanh_tien) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.phoi_lieu) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.gia_cong_ngoai) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.gia_cong_noi_bo) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.xu_ly_be_mat) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.van_chuyen) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.phi_qldn) }}</td>
              <td class="px-4 py-3 font-medium">{{ formatCurrency(item.tong_phi) }}</td>
              <td class="px-4 py-3 font-bold" :class="item.loi_nhuan >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(item.loi_nhuan) }}
              </td>
              <td class="px-4 py-3 font-bold" :class="item.ty_le >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ item.ty_le }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { dashboardService } from '@/services/dashboardService'
import { qlbgService } from '@/services/qlbgService'
import * as XLSX from 'xlsx'

interface DashboardItem {
  id: number
  stt: number
  so_bg: string
  ma_po?: string
  ma_bv: string
  so_luong: number
  don_gia: number
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

const dashboardData = ref<DashboardItem[]>([])
const soBGList = ref<{ so_bg: string }[]>([])
const filterSoBG = ref('')
const loading = ref(false)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const loadSoBGList = async () => {
  try {
    const response = await qlbgService.getAllSoBG()
    soBGList.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách Số BG:', error)
  }
}

const loadData = async () => {
  try {
    loading.value = true
    const response = await dashboardService.getData(filterSoBG.value)
    dashboardData.value = response.data || []
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu Dashboard:', error)
    dashboardData.value = []
    alert('Không thể tải dữ liệu Dashboard!')
  } finally {
    loading.value = false
  }
}

const exportToExcel = () => {
  if (dashboardData.value.length === 0) {
    alert('Không có dữ liệu để export!')
    return
  }

  const excelData = dashboardData.value.map(item => ({
    'STT': item.stt,
    'Số BG': item.so_bg,
    'Mã PO': item.ma_po || '-',
    'Mã BV': item.ma_bv,
    'Số Lượng': item.so_luong,
    'Đơn giá': item.don_gia,
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
  loadSoBGList()
  loadData()
})
</script>
