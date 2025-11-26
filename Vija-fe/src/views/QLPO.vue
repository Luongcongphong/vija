<template>
  <AdminLayout>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý PO</h1>
      <div class="flex gap-2">
        <button
          @click="exportToExcel"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          :disabled="loading"
        >
          📊 Export Excel
        </button>
        <button
          @click="openAddModal()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Thêm mới
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3">Mã PO</th>
              <th class="px-4 py-3">Mã BV</th>
              <th class="px-4 py-3">Ngày tạo</th>
              <th class="px-4 py-3">Ngày giao</th>
              <th class="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="groupedData.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
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
                <td class="px-4 py-2">
                  <button
                    @click="openAddModal(group.ma_po, group.ngay_tao, group.ngay_giao)"
                    class="text-green-600 hover:text-green-800 text-xs"
                    :disabled="loading"
                  >
                    + Thêm Mã BV
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
const maBVList = ref<{ ma_bv: string }[]>([])
const showAddModal = ref(false)
const selectedMaPO = ref('')
const editId = ref<number | null>(null)
const loading = ref(false)
const formData = ref({
  ma_po: '',
  ma_bv: '',
  ngay_tao: '',
  ngay_giao: '',
})

// Gộp dữ liệu theo Mã PO
const groupedData = computed(() => {
  const groups: { [key: string]: QLPO[] } = {}
  
  data.value.forEach(item => {
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
  } catch (error: any) {
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
    ngay_tao: item.ngay_tao || '',
    ngay_giao: item.ngay_giao || '',
  }
  showAddModal.value = true
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa PO này?')) {
    try {
      loading.value = true
      await qlpoService.delete(id)
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
  selectedMaPO.value = ''
  formData.value = {
    ma_po: '',
    ma_bv: '',
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

onMounted(() => {
  loadData()
  loadMaBVList()
})
</script>
