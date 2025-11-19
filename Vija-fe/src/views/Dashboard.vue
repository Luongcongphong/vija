<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <button
        @click="exportToExcel"
        :disabled="loading || dashboardData.length === 0"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Excel
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3">PO</th>
              <th class="px-4 py-3">Mã BV</th>
              <th class="px-4 py-3">Số Lượng</th>
              <th class="px-4 py-3">Đơn giá</th>
              <th class="px-4 py-3">Thành Tiền</th>
              <th class="px-4 py-3">Phôi Liệu</th>
              <th class="px-4 py-3">Gia Công Ngoài</th>
              <th class="px-4 py-3">Gia Công Nội Bộ</th>
              <th class="px-4 py-3">Xử lý Bề Mặt</th>
              <th class="px-4 py-3">Vận Chuyển</th>
              <th class="px-4 py-3">Phí QLDN</th>
              <th class="px-4 py-3">Tổng Phí</th>
              <th class="px-4 py-3">Lợi Nhuận</th>
              <th class="px-4 py-3">Tỷ lệ</th>
              <th class="px-4 py-3">Ngày tạo</th>
              <th class="px-4 py-3">Ghi chú</th>
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
              <td class="px-4 py-3">{{ item.po }}</td>
              <td class="px-4 py-3">{{ item.ma_bv }}</td>
              <td class="px-4 py-3">{{ item.so_luong }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.don_gia) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.thanh_tien) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.phoi_lieu) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.gia_cong_ngoai) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.gia_cong_noi_bo) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.xu_ly_be_mat) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.van_chuyen) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.phi_qldn) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.tong_phi) }}</td>
              <td class="px-4 py-3" :class="item.loi_nhuan >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(item.loi_nhuan) }}
              </td>
              <td class="px-4 py-3" :class="item.ty_le >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ item.ty_le }}%
              </td>
              <td class="px-4 py-3">{{ formatDate(item.ngay_tao) }}</td>
              <td class="px-4 py-3">{{ item.ghi_chu || '-' }}</td>
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
import { dashboardService, type DashboardData } from '@/services/dashboardService'
import * as XLSX from 'xlsx'

const dashboardData = ref<DashboardData[]>([])
const loading = ref(false)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const loadData = async () => {
  try {
    loading.value = true
    const result = await dashboardService.getData()
    dashboardData.value = result
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error)
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

  // Chuẩn bị dữ liệu cho Excel
  const excelData = dashboardData.value.map(item => ({
    'PO': item.po,
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
    'Ngày tạo': formatDate(item.ngay_tao),
  }))

  // Tạo worksheet
  const ws = XLSX.utils.json_to_sheet(excelData)

  // Định dạng cột (width)
  const colWidths = [
    { wch: 12 }, // PO
    { wch: 12 }, // Mã BV
    { wch: 10 }, // Số Lượng
    { wch: 15 }, // Đơn giá
    { wch: 15 }, // Thành Tiền
    { wch: 15 }, // Phôi Liệu
    { wch: 15 }, // Gia Công Ngoài
    { wch: 15 }, // Gia Công Nội Bộ
    { wch: 15 }, // Xử lý Bề Mặt
    { wch: 15 }, // Vận Chuyển
    { wch: 15 }, // Phí QLDN
    { wch: 15 }, // Tổng Phí
    { wch: 15 }, // Lợi Nhuận
    { wch: 10 }, // Tỷ lệ
    { wch: 12 }, // Ngày tạo
  ]
  ws['!cols'] = colWidths

  // Tạo workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Dashboard')

  // Tạo tên file với timestamp
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `Dashboard_${timestamp}.xlsx`

  // Download file
  XLSX.writeFile(wb, filename)
}

onMounted(() => {
  loadData()
})
</script>
