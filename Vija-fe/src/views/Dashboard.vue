<template>
  <AdminLayout>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
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
            <tr
              v-for="item in dashboardData"
              :key="item.po + item.maBV"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3">{{ item.po }}</td>
              <td class="px-4 py-3">{{ item.maBV }}</td>
              <td class="px-4 py-3">{{ item.soLuong }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.donGia) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.thanhTien) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.phoiLieu) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.giaCongNgoai) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.giaCongNoiBo) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.xuLyBeMatItem) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.vanChuyen) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.phiQLDN) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.tongPhi) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.loiNhuan) }}</td>
              <td class="px-4 py-3">{{ item.tyLe }}%</td>
              <td class="px-4 py-3">{{ item.ngayTao }}</td>
              <td class="px-4 py-3">{{ item.ghiChu }}</td>
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

interface QLKHData {
  po: string
  maBV: string
  soLuong: number
  donGia: number
  thanhTien: number
}

interface QLNBData {
  po: string
  maBV: string
  phoiLieu: number
  giaCongNgoai: number
  giaCongNoiBo: number
  xuLyBeMatItem: number
  vanChuyen: number
  phiQLDN: number
  tongPhi: number
}

interface DashboardItem extends QLKHData, QLNBData {
  loiNhuan: number
  tyLe: number
  ngayTao: string
  ghiChu: string
}

const dashboardData = ref<DashboardItem[]>([])

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const loadData = () => {
  const qlkhData = JSON.parse(localStorage.getItem('qlkhData') || '[]')
  const qlnbData = JSON.parse(localStorage.getItem('qlnbData') || '[]')

  dashboardData.value = qlkhData.map((kh: QLKHData) => {
    const nb = qlnbData.find((n: QLNBData) => n.po === kh.po && n.maBV === kh.maBV)
    
    const tongPhi = nb?.tongPhi || 0
    const loiNhuan = kh.thanhTien - tongPhi
    const tyLe = kh.thanhTien > 0 ? ((loiNhuan / kh.thanhTien) * 100).toFixed(2) : 0

    return {
      ...kh,
      phoiLieu: nb?.phoiLieu || 0,
      giaCongNgoai: nb?.giaCongNgoai || 0,
      giaCongNoiBo: nb?.giaCongNoiBo || 0,
      xuLyBeMatItem: nb?.xuLyBeMatItem || 0,
      vanChuyen: nb?.vanChuyen || 0,
      phiQLDN: nb?.phiQLDN || 0,
      tongPhi,
      loiNhuan,
      tyLe: Number(tyLe),
      ngayTao: new Date().toLocaleDateString('vi-VN'),
      ghiChu: '',
    }
  })
}

onMounted(() => {
  loadData()
})
</script>
