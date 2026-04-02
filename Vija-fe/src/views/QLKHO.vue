<template>
  <AdminLayout v-if="isAuthenticated">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Kho</h1>
      <div class="flex gap-2">
        <!-- Có thể thêm nút Export Excel if needed -->
      </div>
    </div>

    <!-- Search/Filter -->
    <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Tìm kiếm theo Mã BV:</label>
          <input
            v-model="searchMaBV"
            type="text"
            placeholder="Gõ để tìm theo Mã BV..."
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
    </div>

    <!-- Danh sách Tồn Kho -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left border-collapse">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Mã KH</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Mã BV</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Đơn vị</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Tổng Nhập</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600">Tổng Xuất</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600 font-bold bg-gray-100 dark:bg-gray-600">Số Lượng (Tồn)</th>
              <th class="px-4 py-3 border border-gray-300 dark:border-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="filteredData.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu tồn kho</td>
            </tr>
            <tr
              v-else
              v-for="item in filteredData"
              :key="item.ma_bv"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.ma_kh || '-' }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600 font-medium text-blue-600">{{ item.ma_bv }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600">{{ item.don_vi }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600 text-green-600">{{ formatCurrency(item.tong_nhap) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600 text-red-600">{{ formatCurrency(item.tong_xuat) }}</td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600 font-bold bg-gray-50 dark:bg-gray-600 text-lg">
                {{ formatCurrency(item.so_luong) }}
              </td>
              <td class="px-4 py-3 border border-gray-300 dark:border-gray-600 text-center space-x-2">
                <button
                  @click="openNhapModal(item)"
                  class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs shadow-sm"
                  :disabled="loading"
                >
                  Nhập Kho
                </button>
                <button
                  @click="openXuatModal(item)"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs shadow-sm"
                  :disabled="loading"
                >
                  Xuất Kho
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Nhập Kho -->
    <div
      v-if="showNhapModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Nhập Kho: {{ selectedItem?.ma_bv }}
        </h2>
        <form @submit.prevent="submitNhapKho">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Ngày nhập</label>
            <input
              v-model="nhapData.ngay_nhap"
              type="date"
              required
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Số lượng</label>
            <input
              v-model.number="nhapData.so_luong"
              type="number"
              required
              min="1"
              placeholder="Nhập số lượng..."
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button
              type="button"
              @click="showNhapModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              :disabled="loadingAction"
            >
              {{ loadingAction ? 'Đang xử lý...' : 'Xác nhận Nhập' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Xuất Kho -->
    <div
      v-if="showXuatModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Xuất Kho: {{ selectedItem?.ma_bv }}
        </h2>
        <form @submit.prevent="submitXuatKho">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Ngày xuất</label>
            <input
              v-model="xuatData.ngay_xuat"
              type="date"
              required
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Mã PO</label>
            <!-- Sử dụng datalist để vừa có thể gõ tự do, vừa có thể chọn từ danh sách -->
            <input
              v-model="xuatData.ma_po"
              type="text"
              list="poList"
              placeholder="Chọn hoặc nhập mã PO..."
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <datalist id="poList">
              <option v-for="po in maPoList" :key="po.ma_po" :value="po.ma_po" />
            </datalist>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Số lượng</label>
            <input
              v-model.number="xuatData.so_luong"
              type="number"
              required
              min="1"
              placeholder="Nhập số lượng..."
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button
              type="button"
              @click="showXuatModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              :disabled="loadingAction"
            >
              {{ loadingAction ? 'Đang xử lý...' : 'Xác nhận Xuất' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </AdminLayout>
  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Đang kiểm tra quyền truy cập...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { qlkhoService, type QLKHO } from '@/services/qlkhoService'
import { qlpoService } from '@/services/qlpoService'

const data = ref<QLKHO[]>([])
const searchMaBV = ref('')
const loading = ref(false)
const loadingAction = ref(false)

// Data dropdown
const maPoList = ref<{ ma_po: string }[]>([])

// Modals state
const showNhapModal = ref(false)
const showXuatModal = ref(false)
const selectedItem = ref<QLKHO | null>(null)

const nhapData = ref({
  ngay_nhap: new Date().toISOString().split('T')[0],
  so_luong: '' as number | ''
})

const xuatData = ref({
  ngay_xuat: new Date().toISOString().split('T')[0],
  ma_po: '',
  so_luong: '' as number | ''
})

// Check Authentication
const isAuthenticated = computed(() => {
  const authStatus = localStorage.getItem('isAuthenticated') === 'true'
  const hasToken = !!localStorage.getItem('token')
  return authStatus && hasToken
})

// Computed list
const filteredData = computed(() => {
  if (!searchMaBV.value) return data.value
  return data.value.filter(item => 
    item.ma_bv.toLowerCase().includes(searchMaBV.value.toLowerCase())
  )
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value || 0)
}

const loadData = async () => {
  if (!isAuthenticated.value) return
  try {
    loading.value = true
    const res = await qlkhoService.getAll()
    data.value = res
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu Tồn kho:', error)
  } finally {
    loading.value = false
  }
}

const loadMaPoList = async () => {
  if (!isAuthenticated.value) return
  try {
    const res = await qlpoService.getAllMaPO()
    maPoList.value = res.data || []
  } catch (error) {
    console.error('Lỗi khi tải danh sách PO:', error)
  }
}

const openNhapModal = (item: QLKHO) => {
  selectedItem.value = item
  nhapData.value = {
    ngay_nhap: new Date().toISOString().split('T')[0],
    so_luong: ''
  }
  showNhapModal.value = true
}

const submitNhapKho = async () => {
  if (!selectedItem.value || !nhapData.value.so_luong) return
  try {
    loadingAction.value = true
    await qlkhoService.nhapKho({
      ma_bv: selectedItem.value.ma_bv,
      ngay_nhap: nhapData.value.ngay_nhap,
      so_luong: Number(nhapData.value.so_luong)
    })
    showNhapModal.value = false
    await loadData() // Refresh list
    alert(`Đã nhập kho ${nhapData.value.so_luong} cho Mã BV: ${selectedItem.value.ma_bv}`)
  } catch (error) {
    console.error('Lỗi khi nhập kho:', error)
    alert('Có lỗi xảy ra khi nhập kho!')
  } finally {
    loadingAction.value = false
  }
}

const openXuatModal = (item: QLKHO) => {
  selectedItem.value = item
  xuatData.value = {
    ngay_xuat: new Date().toISOString().split('T')[0],
    ma_po: '',
    so_luong: ''
  }
  showXuatModal.value = true
}

const submitXuatKho = async () => {
  if (!selectedItem.value || !xuatData.value.so_luong) return
  try {
    loadingAction.value = true
    await qlkhoService.xuatKho({
      ma_bv: selectedItem.value.ma_bv,
      ma_po: xuatData.value.ma_po,
      ngay_xuat: xuatData.value.ngay_xuat,
      so_luong: Number(xuatData.value.so_luong)
    })
    showXuatModal.value = false
    await loadData() // Refresh list
    alert(`Đã xuất kho ${xuatData.value.so_luong} cho Mã BV: ${selectedItem.value.ma_bv}`)
  } catch (error) {
    console.error('Lỗi khi xuất kho:', error)
    alert('Có lỗi xảy ra khi xuất kho!')
  } finally {
    loadingAction.value = false
  }
}

onMounted(() => {
  loadData()
  loadMaPoList()
})
</script>
