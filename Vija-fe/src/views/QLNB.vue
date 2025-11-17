<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Nội bộ</h1>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Thêm mới
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3">PO</th>
              <th class="px-4 py-3">Mã BV</th>
              <th class="px-4 py-3">Phôi Liệu</th>
              <th class="px-4 py-3">Gia Công Ngoài</th>
              <th class="px-4 py-3">Gia Công Nội Bộ</th>
              <th class="px-4 py-3">Xử lý Bề Mặt</th>
              <th class="px-4 py-3">Vận Chuyển</th>
              <th class="px-4 py-3">Phí QLDN</th>
              <th class="px-4 py-3">Tổng Phí</th>
              <th class="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in data"
              :key="index"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3">{{ item.po }}</td>
              <td class="px-4 py-3">{{ item.maBV }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.phoiLieu) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.giaCongNgoai) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.giaCongNoiBo) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.xuLyBeMatItem) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.vanChuyen) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.phiQLDN) }}</td>
              <td class="px-4 py-3">{{ formatCurrency(item.tongPhi) }}</td>
              <td class="px-4 py-3">
                <button
                  @click="editItem(index)"
                  class="text-blue-600 hover:text-blue-800 mr-3"
                >
                  Sửa
                </button>
                <button
                  @click="deleteItem(index)"
                  class="text-red-600 hover:text-red-800"
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-99999"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ editIndex !== null ? 'Sửa' : 'Thêm mới' }}
        </h2>
        <form @submit.prevent="saveItem">
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">PO</label>
              <input
                v-model="formData.po"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Mã BV</label>
              <input
                v-model="formData.maBV"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Phôi Liệu</label>
              <input
                v-model.number="formData.phoiLieu"
                type="number"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Gia Công Ngoài</label>
              <input
                v-model.number="formData.giaCongNgoai"
                type="number"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Gia Công Nội Bộ</label>
              <input
                v-model.number="formData.giaCongNoiBo"
                type="number"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Xử lý Bề Mặt</label>
              <input
                v-model.number="formData.xuLyBeMatItem"
                type="number"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Vận Chuyển</label>
              <input
                v-model.number="formData.vanChuyen"
                type="number"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Phí QLDN</label>
              <input
                v-model.number="formData.phiQLDN"
                type="number"
                required
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
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
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

interface QLNBItem {
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

const data = ref<QLNBItem[]>([])
const showAddModal = ref(false)
const editIndex = ref<number | null>(null)
const formData = ref({
  po: '',
  maBV: '',
  phoiLieu: 0,
  giaCongNgoai: 0,
  giaCongNoiBo: 0,
  xuLyBeMatItem: 0,
  vanChuyen: 0,
  phiQLDN: 0,
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const loadData = () => {
  const saved = localStorage.getItem('qlnbData')
  if (saved) {
    data.value = JSON.parse(saved)
  }
}

const saveData = () => {
  localStorage.setItem('qlnbData', JSON.stringify(data.value))
}

const saveItem = () => {
  const tongPhi =
    formData.value.phoiLieu +
    formData.value.giaCongNgoai +
    formData.value.giaCongNoiBo +
    formData.value.xuLyBeMatItem +
    formData.value.vanChuyen +
    formData.value.phiQLDN

  if (editIndex.value !== null) {
    data.value[editIndex.value] = { ...formData.value, tongPhi }
  } else {
    data.value.push({ ...formData.value, tongPhi })
  }

  saveData()
  closeModal()
}

const editItem = (index: number) => {
  editIndex.value = index
  const item = data.value[index]
  formData.value = { ...item }
  showAddModal.value = true
}

const deleteItem = (index: number) => {
  if (confirm('Bạn có chắc muốn xóa?')) {
    data.value.splice(index, 1)
    saveData()
  }
}

const closeModal = () => {
  showAddModal.value = false
  editIndex.value = null
  formData.value = {
    po: '',
    maBV: '',
    phoiLieu: 0,
    giaCongNgoai: 0,
    giaCongNoiBo: 0,
    xuLyBeMatItem: 0,
    vanChuyen: 0,
    phiQLDN: 0,
  }
}

onMounted(() => {
  loadData()
})
</script>
