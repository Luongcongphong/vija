<template>
  <AdminLayout v-if="isAuthenticated">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Quản lý PO</h1>
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
          📊 Export Excel {{ filterMaPO ? '(Đã lọc)' : '' }}
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
    <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-3 text-sm">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <!-- Lọc theo Mã PO -->
        <div class="flex items-center gap-2">
          <label class="font-medium min-w-[70px]">Mã PO:</label>
          <input
            v-model="searchMaPO"
            type="text"
            placeholder="Tìm theo PO..."
            @keyup.enter="selectFirstMatchPO"
            class="flex-1 px-2 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <select
            v-model="filterMaPO"
            class="w-32 px-2 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Tất cả</option>
            <option v-for="item in filteredMaPOList" :key="item.ma_po" :value="item.ma_po">
              {{ item.ma_po }}
            </option>
          </select>
        </div>
        
        <!-- Lọc theo Mã BV -->
        <div class="flex items-center gap-2">
          <label class="font-medium min-w-[70px]">Mã BV:</label>
          <input
            v-model="searchMaBV"
            type="text"
            placeholder="Tìm theo BV..."
            @keyup.enter="selectFirstMatchBV"
            class="flex-1 px-2 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <select
            v-model="filterMaBV"
            class="w-32 px-2 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Tất cả</option>
            <option v-for="item in filteredMaBVList" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Lọc bổ sung: Trạng thái, Loại ngày, Từ ngày, Đến ngày -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        <!-- Lọc trạng thái -->
        <div class="flex items-center gap-2">
          <label class="font-medium min-w-[70px]">Trạng thái:</label>
          <select
            v-model="filterStatus"
            class="flex-1 px-2 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Tất cả</option>
            <option value="completed">Hoàn thành</option>
            <option value="incomplete">Chưa xong</option>
          </select>
        </div>
        
        <!-- Loại ngày -->
        <div class="flex items-center gap-2">
          <label class="font-medium min-w-[70px]">Loại ngày:</label>
          <select
            v-model="filterDateType"
            class="flex-1 px-2 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="ngay_hoan_thanh">Hoàn thành</option>
            <option value="ngay_tao">Tạo PO</option>
            <option value="ngay_giao">Giao PO</option>
          </select>
        </div>

        <!-- Từ ngày -->
        <div class="flex items-center gap-2">
          <label class="font-medium min-w-[70px]">Từ ngày:</label>
          <div class="relative flex-1">
            <input
              v-model="filterFromDate"
              type="date"
              class="w-full px-2 py-1.5 pr-8 border rounded dark:bg-gray-700 dark:border-gray-600 cursor-pointer date-input"
              style="color-scheme: light dark;"
              @click="openDatePicker"
              @focus="openDatePicker"
            />
          </div>
        </div>
        
        <!-- Đến ngày -->
        <div class="flex items-center gap-2">
          <label class="font-medium min-w-[70px]">Đến ngày:</label>
          <div class="relative flex-1">
            <input
              v-model="filterToDate"
              type="date"
              class="w-full px-2 py-1.5 pr-8 border rounded dark:bg-gray-700 dark:border-gray-600 cursor-pointer date-input"
              style="color-scheme: light dark;"
              @click="openDatePicker"
              @focus="openDatePicker"
            />
          </div>
        </div>
      </div>
      
      <div class="flex gap-2 mt-3 items-center">
        <button
          v-if="filterMaPO || filterMaBV || searchMaPO || searchMaBV || filterStatus || filterFromDate || filterToDate"
          @click="clearFilter"
          class="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 whitespace-nowrap"
        >
          Xóa lọc
        </button>
        <p v-if="filterMaPO || filterMaBV || searchMaPO || searchMaBV || filterStatus || filterFromDate || filterToDate" class="text-xs text-green-600 flex flex-wrap items-center gap-1">
          <span>Đang hiển thị: {{ filteredData.length }} KQ.</span>
          <span v-if="searchMaPO">Tìm PO: "{{ searchMaPO }}"</span>
          <span v-if="filterMaPO">Cho PO: {{ filterMaPO }}</span>
          <span v-if="searchMaBV">Tìm BV: "{{ searchMaBV }}"</span>
          <span v-if="filterMaBV">Cho BV: {{ filterMaBV }}</span>
          <span v-if="filterStatus === 'completed'" class="font-bold"> (Hoàn thành)</span>
          <span v-if="filterStatus === 'incomplete'" class="font-bold text-orange-500"> (Chưa xong)</span>
          <span v-if="filterFromDate || filterToDate" class="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
            (Hạn: {{ filterFromDate ? formatDate(filterFromDate) : '...' }} - {{ filterToDate ? formatDate(filterToDate) : '...' }})
          </span>
        </p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left border-collapse">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">Mã PO</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">Mã BV</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">Mã KH</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-right">SL</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">ĐVT</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-right">Đã giao</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-right">Còn lại</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">Ngày tạo</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">Ngày giao</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">Ngày hoàn thành</th>
              <th class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center w-48">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="11" class="px-4 py-8 text-center text-gray-500">Đang tải...</td>
            </tr>
            <tr v-else-if="groupedData.length === 0">
              <td colspan="11" class="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
            </tr>
            <template v-else v-for="group in groupedData" :key="group.ma_po">
              <!-- Header row cho mỗi Mã PO -->
              <tr class="bg-green-50 dark:bg-green-900 border-b-2 border-green-200 dark:border-green-700">
                <td class="px-3 py-1.5 font-bold text-green-700 dark:text-green-300 border border-gray-300 dark:border-gray-600 text-center align-middle" :rowspan="group.items.length + 1">
                  {{ group.ma_po }}
                </td>
                <td class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600" colspan="2">
                  SLBV: {{ group.items.length }}
                </td>
                <td class="px-1 py-1 border border-gray-300 dark:border-gray-600" colspan="6"></td>
                <td class="px-1 py-1 border border-gray-300 dark:border-gray-600 flex gap-2 justify-center items-center" colspan="2">
                  <button
                    @click="openAddModal(group.ma_po, group.ngay_tao, group.ngay_giao)"
                    class="text-green-600 hover:text-green-800 text-xs"
                    :disabled="loading"
                  >
                    + Thêm Mã BV
                  </button>
                  <button
                    @click="deletePO(group.ma_po)"
                    class="text-red-600 hover:text-red-800 text-xs font-medium"
                    :disabled="loading"
                  >
                    🗑️ Xóa PO
                  </button>
                </td>
              </tr>
              <!-- Chi tiết từng Mã BV -->
              <tr
                v-for="item in group.items"
                :key="item.id"
                class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">{{ item.ma_bv }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">{{ item.ma_kh || '-' }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-right font-bold">{{ item.so_luong || 0 }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">{{ item.dvt || 'p' }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-right text-green-600">{{ Number(item.sl_da_giao || 0) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-right text-red-600 font-bold">
                  {{ Number(item.so_luong || 0) - Number(item.sl_da_giao || 0) }}
                </td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">{{ formatDate(item.ngay_tao) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">{{ formatDate(item.ngay_giao) }}</td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center font-bold text-green-600">
                  <span v-if="(Number(item.so_luong || 0) - Number(item.sl_da_giao || 0)) <= 0">
                    {{ formatDate(item.ngay_hoan_thanh) }}
                  </span>
                  <span v-else class="text-gray-400 font-normal">-</span>
                </td>
                <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 flex flex-wrap gap-2 justify-center items-center">
                  <span
                    v-if="(Number(item.so_luong || 0) - Number(item.sl_da_giao || 0)) <= 0"
                    class="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded mr-3 whitespace-nowrap inline-flex items-center shadow-sm"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    Hoàn thành
                  </span>
                  <button
                    @click="openDeliveryModal(item)"
                    class="text-green-600 hover:text-green-800 mr-3 whitespace-nowrap"
                    :disabled="loading"
                  >
                    Chi tiết
                  </button>
                  <button
                    @click="editItem(item)"
                    class="text-blue-600 hover:text-blue-800 mr-3 whitespace-nowrap"
                    :disabled="loading"
                  >
                    Sửa
                  </button>
                  <button
                    @click="deleteItem(item.id!)"
                    class="text-red-600 hover:text-red-800 whitespace-nowrap"
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-99999 p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
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
              @update:modelValue="handleMaBVChange"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Mã KH</label>
            <input
              v-model="formData.ma_kh"
              type="text"
              readonly
              placeholder="Tự động từ QLDM"
              class="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600"
            />
            <p class="text-xs text-gray-500 mt-1">Mã khách hàng tự động lấy từ QLDM theo Mã BV</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Số lượng</label>
            <input
              v-model.number="formData.so_luong"
              type="number"
              min="0"
              placeholder="VD: 100"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Ngày tạo</label>
            <div class="relative">
              <input
                v-model="formData.ngay_tao"
                type="date"
                :max="new Date().toISOString().split('T')[0]"
                class="w-full px-3 py-2 pr-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600 cursor-pointer date-input"
                style="color-scheme: light dark;"
                @click="openDatePicker"
                @focus="openDatePicker"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Chọn ngày tạo PO</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Ngày giao</label>
            <div class="relative">
              <input
                v-model="formData.ngay_giao"
                type="date"
                :min="formData.ngay_tao || undefined"
                class="w-full px-3 py-2 pr-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600 cursor-pointer date-input"
                style="color-scheme: light dark;"
                @click="openDatePicker"
                @focus="openDatePicker"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Chọn ngày giao (phải sau ngày tạo)</p>
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

    <!-- Modal Chi tiết giao hàng -->
    <div
      v-if="showDeliveryModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Chi tiết giao hàng</h2>
          <button @click="closeDeliveryModal" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Thông tin PO -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div><p class="text-xs text-gray-500">Mã PO</p><p class="font-medium">{{ currentDeliveryPO?.ma_po }}</p></div>
          <div><p class="text-xs text-gray-500">Mã BV</p><p class="font-medium">{{ currentDeliveryPO?.ma_bv }}</p></div>
          <div><p class="text-xs text-gray-500">Mã KH</p><p class="font-medium">{{ currentDeliveryPO?.ma_kh || '-' }}</p></div>
          <div><p class="text-xs text-gray-500">Tổng SL / ĐVT</p><p class="font-bold text-blue-600">{{ currentDeliveryPO?.so_luong }} {{ currentDeliveryPO?.dvt }}</p></div>
          <div><p class="text-xs text-gray-500">Đã giao</p><p class="font-bold text-green-600">{{ Number(currentDeliveryPO?.sl_da_giao || 0) }}</p></div>
          <div><p class="text-xs text-gray-500">Còn lại</p><p class="font-bold text-red-600">{{ Number(currentDeliveryPO?.so_luong || 0) - Number(currentDeliveryPO?.sl_da_giao || 0) }}</p></div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
          <!-- Form Thêm Lần giao -->
          <div class="w-full md:w-1/3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg self-start sticky top-0">
            <h3 class="font-bold mb-3 text-sm uppercase">Thêm lần giao mới</h3>
            <form @submit.prevent="saveDelivery">
              <div class="mb-3">
                <label class="block text-sm mb-1">Số lượng giao</label>
                <input
                  v-model.number="deliveryForm.so_luong_giao"
                  type="number"
                  required
                  min="1"
                  :max="Number(currentDeliveryPO?.so_luong || 0) - Number(currentDeliveryPO?.sl_da_giao || 0)"
                  placeholder="SL"
                  class="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm mb-1">Ngày giao</label>
                 <div class="relative">
                  <input
                    v-model="deliveryForm.ngay_giao"
                    type="date"
                    required
                    class="w-full px-3 py-2 pr-10 border rounded-lg dark:bg-gray-600 dark:border-gray-500 cursor-pointer date-input"
                    style="color-scheme: light dark;"
                    @click="openDatePicker"
                    @focus="openDatePicker"
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                :disabled="deliveryLoading || (Number(currentDeliveryPO?.so_luong || 0) - Number(currentDeliveryPO?.sl_da_giao || 0)) <= 0"
              >
                <span v-if="deliveryLoading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Thêm lần giao
              </button>
            </form>
          </div>

          <!-- Danh sách các lần giao -->
          <div class="w-full md:w-2/3">
            <h3 class="font-bold mb-3 text-sm uppercase">Lịch sử giao hàng</h3>
            <table class="w-full text-sm text-left border-collapse">
              <thead class="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                <tr>
                  <th class="px-3 py-2 border border-gray-300 dark:border-gray-500">Lần giao</th>
                  <th class="px-3 py-2 border border-gray-300 dark:border-gray-500">Số lượng</th>
                  <th class="px-3 py-2 border border-gray-300 dark:border-gray-500">Ngày giao</th>
                  <th class="px-3 py-2 border border-gray-300 dark:border-gray-500 w-20">Xóa</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="deliveryList.length === 0">
                  <td colspan="4" class="px-3 py-6 text-center text-gray-500">Chưa có dữ liệu giao hàng</td>
                </tr>
                <tr v-for="del in deliveryList" :key="del.id" class="border-b dark:border-gray-600">
                  <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 font-medium">Lần {{ del.lan_giao }}</td>
                  <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 font-bold text-green-600">{{ del.so_luong_giao }}</td>
                  <td class="px-3 py-2 border border-gray-300 dark:border-gray-600">{{ formatDate(del.ngay_giao) }}</td>
                  <td class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">
                    <button @click="deleteDelivery(del.id!)" class="text-red-500 hover:text-red-700" :disabled="deliveryLoading">
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="closeDeliveryModal" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            Đóng bảng
          </button>
        </div>
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
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SearchableSelect from '@/components/common/SearchableSelect.vue'
import { qlpoService, type QLPO, type QLPODelivery } from '@/services/qlpoService'
import { qldmService } from '@/services/qldmService'
import * as XLSX from 'xlsx'

const data = ref<QLPO[]>([])
const maPOList = ref<{ ma_po: string }[]>([])
const maBVList = ref<{ ma_bv: string; ma_kh?: string }[]>([])
const filterMaPO = ref('')
const searchMaPO = ref('')
const filterMaBV = ref('')
const searchMaBV = ref('')
const filterStatus = ref('')
const filterDateType = ref('ngay_hoan_thanh')
const filterFromDate = ref('')
const filterToDate = ref('')
const showAddModal = ref(false)
const selectedMaPO = ref('')
const editId = ref<number | null>(null)
const loading = ref(false)

// Delivery Modal State
const showDeliveryModal = ref(false)
const currentDeliveryPO = ref<QLPO | null>(null)
const deliveryList = ref<QLPODelivery[]>([])
const deliveryLoading = ref(false)
const deliveryForm = ref({ so_luong_giao: 0, ngay_giao: '' })

// Computed property để kiểm tra authentication
const isAuthenticated = computed(() => {
  const authStatus = localStorage.getItem('isAuthenticated') === 'true'
  const hasToken = !!localStorage.getItem('token')
  return authStatus && hasToken
})
const formData = ref({
  ma_po: '',
  ma_bv: '',
  ma_kh: '',
  so_luong: 0,
  ngay_tao: '',
  ngay_giao: '',
})

// Filter Mã PO list by search
const filteredMaPOList = computed(() => {
  if (!searchMaPO.value) return maPOList.value
  return maPOList.value.filter(item => 
    item.ma_po.toLowerCase().includes(searchMaPO.value.toLowerCase())
  )
})

// Get unique Mã BV list from data
const maBVListUnique = computed(() => {
  const uniqueBV = [...new Set(data.value.map(item => item.ma_bv))]
  return uniqueBV.sort()
})

// Filter Mã BV list by search
const filteredMaBVList = computed(() => {
  if (!searchMaBV.value) return maBVListUnique.value
  return maBVListUnique.value.filter(item => 
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
  
  // Filter theo trạng thái hoàn thành
  if (filterStatus.value === 'completed') {
    result = result.filter(item => (Number(item.so_luong || 0) - Number(item.sl_da_giao || 0)) <= 0)
  } else if (filterStatus.value === 'incomplete') {
    result = result.filter(item => (Number(item.so_luong || 0) - Number(item.sl_da_giao || 0)) > 0)
  }

  // Filter theo khoảng thời gian
  if (filterFromDate.value || filterToDate.value) {
    const fromTime = filterFromDate.value ? new Date(filterFromDate.value).getTime() : 0
    // To time should include the whole day (23:59:59.999), 86400000 ms - 1 ms
    const toTime = filterToDate.value ? new Date(filterToDate.value).getTime() + 86400000 - 1 : Infinity

    result = result.filter(item => {
      let itemDateStr = ''
      if (filterDateType.value === 'ngay_hoan_thanh') {
        const isCompleted = (Number(item.so_luong || 0) - Number(item.sl_da_giao || 0)) <= 0
        itemDateStr = isCompleted ? (item.ngay_hoan_thanh || '') : ''
      } else if (filterDateType.value === 'ngay_tao') {
        itemDateStr = item.ngay_tao || ''
      } else if (filterDateType.value === 'ngay_giao') {
        itemDateStr = item.ngay_giao || ''
      }
      
      if (!itemDateStr) return false
      const itemTime = new Date(itemDateStr).getTime()
      return itemTime >= fromTime && itemTime <= toTime
    })
  }
  
  return result
})

// Gộp dữ liệu theo Mã PO (chỉ dữ liệu đã lọc)
const groupedData = computed(() => {
  const groups: { [key: string]: QLPO[] } = {}
  
  filteredData.value.forEach(item => {
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
  filterStatus.value = ''
  filterDateType.value = 'ngay_hoan_thanh'
  filterFromDate.value = ''
  filterToDate.value = ''
}

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

const openDatePicker = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input && input.showPicker) {
    try {
      input.showPicker()
    } catch (error) {
      // Fallback for browsers that don't support showPicker
      input.focus()
    }
  } else {
    input.focus()
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
  // Kiểm tra authentication trước khi gọi API
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const hasToken = !!localStorage.getItem('token')
  
  if (!isAuthenticated || !hasToken) {
    console.log('Not authenticated, skip loading BV list')
    return
  }
  
  try {
    const response = await qldmService.getAll()
    maBVList.value = response.data.map(item => ({
      ma_bv: item.ma_bv,
      ma_kh: item.ma_kh
    }))
  } catch (error) {
    console.error('Lỗi khi tải danh sách Mã BV:', error)
  }
}

const handleMaBVChange = (ma_bv: string) => {
  const selected = maBVList.value.find(item => item.ma_bv === ma_bv)
  if (selected) {
    formData.value.ma_kh = selected.ma_kh || ''
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
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } }; message?: string }
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
    ma_kh: item.ma_kh || '',
    so_luong: item.so_luong || 0,
    ngay_tao: item.ngay_tao || '',
    ngay_giao: item.ngay_giao || '',
  }
  showAddModal.value = true
}

const deleteItem = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa dòng này?')) {
    try {
      loading.value = true
      await qlpoService.delete(id)
      await loadData()
      await loadMaPOList()
    } catch (error) {
      console.error('Lỗi khi xóa:', error)
      alert('Không thể xóa dữ liệu!')
    } finally {
      loading.value = false
    }
  }
}

const deletePO = async (ma_po: string) => {
  const group = groupedData.value.find(g => g.ma_po === ma_po)
  if (!group) return
  
  const confirmMsg = `Bạn có chắc muốn xóa toàn bộ PO "${ma_po}"?\n\n` +
    `Sẽ xóa ${group.items.length} Mã BV:\n` +
    group.items.map(item => `- ${item.ma_bv}`).join('\n')
  
  if (confirm(confirmMsg)) {
    try {
      loading.value = true
      
      // Xóa toàn bộ PO bằng 1 API call
      const response = await qlpoService.deleteByMaPO(ma_po)
      
      await loadData()
      await loadMaPOList()
      
      alert(`✅ Đã xóa thành công PO "${ma_po}" (${response.data.deletedCount} Mã BV)`)
    } catch (error) {
      console.error('Lỗi khi xóa PO:', error)
      alert('Không thể xóa PO!')
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
    ma_kh: '',
    so_luong: 0,
    ngay_tao: '',
    ngay_giao: '',
  }
}

// =======================
// DELIVERY MODAL LOGIC
// =======================
const openDeliveryModal = async (item: QLPO) => {
  currentDeliveryPO.value = item
  deliveryForm.value = { 
    so_luong_giao: 0, 
    ngay_giao: new Date().toISOString().split('T')[0] 
  }
  showDeliveryModal.value = true
  await loadDeliveries(item.id!)
}

const closeDeliveryModal = () => {
  showDeliveryModal.value = false
  currentDeliveryPO.value = null
  deliveryList.value = []
  // Reload data to update 'sl_da_giao' and 'Còn lại' across the grid
  loadData()
}

const loadDeliveries = async (qlpo_id: number) => {
  try {
    deliveryLoading.value = true
    const res = await qlpoService.getDeliveries(qlpo_id)
    deliveryList.value = res.data
  } catch (err) {
    console.error(err)
    alert("Lỗi khi tải danh sách giao hàng")
  } finally {
    deliveryLoading.value = false
  }
}

const saveDelivery = async () => {
  if (!currentDeliveryPO.value?.id) return
  if (deliveryForm.value.so_luong_giao <= 0) {
    alert("Số lượng giao phải lớn hơn 0")
    return
  }

  const conLai = Number(currentDeliveryPO.value.so_luong || 0) - Number(currentDeliveryPO.value.sl_da_giao || 0)
  if (Number(deliveryForm.value.so_luong_giao) > conLai) {
    alert("Số lượng giao không được vượt quá số lượng còn lại")
    return
  }

  try {
    deliveryLoading.value = true
    await qlpoService.addDelivery(currentDeliveryPO.value.id, {
      so_luong_giao: Number(deliveryForm.value.so_luong_giao),
      ngay_giao: deliveryForm.value.ngay_giao
    })
    
    // Update local sl_da_giao without reloading whole grid right away to keep modal smooth
    currentDeliveryPO.value.sl_da_giao = Number(currentDeliveryPO.value.sl_da_giao || 0) + Number(deliveryForm.value.so_luong_giao)
    
    deliveryForm.value.so_luong_giao = 0
    await loadDeliveries(currentDeliveryPO.value.id)
  } catch (err) {
    console.error(err)
    alert("Lỗi khi thêm giao hàng")
  } finally {
    deliveryLoading.value = false
  }
}

const deleteDelivery = async (delivery_id: number) => {
  if (!confirm("Bạn có chắc chắn muốn xóa lần giao hàng này?")) return
  if (!currentDeliveryPO.value?.id) return

  try {
    // Find delivery to adjust local sl_da_giao
    const del = deliveryList.value.find(d => d.id === delivery_id)
    const soLuongXoa = Number(del?.so_luong_giao || 0)

    deliveryLoading.value = true
    await qlpoService.deleteDelivery(delivery_id)
    
    currentDeliveryPO.value.sl_da_giao = Number(currentDeliveryPO.value.sl_da_giao || 0) - soLuongXoa
    await loadDeliveries(currentDeliveryPO.value.id)
  } catch (err) {
    console.error(err)
    alert("Lỗi khi xóa giao hàng")
  } finally {
    deliveryLoading.value = false
  }
}

const exportToExcel = () => {
  try {
    const excelData: unknown[] = []
    
    groupedData.value.forEach(group => {
      excelData.push({
        'Mã PO': group.ma_po,
        'Mã BV': `Số lượng: ${group.items.length}`,
        'Mã KH': '',
        'Số lượng': '',
        'ĐVT': '',
        'Ngày tạo': formatDate(group.ngay_tao),
        'Ngày giao': formatDate(group.ngay_giao),
        'Ngày hoàn thành': ''
      })
      
      group.items.forEach(item => {
        excelData.push({
          'Mã PO': '',
          'Mã BV': item.ma_bv,
          'Mã KH': item.ma_kh || '',
          'Số lượng': item.so_luong || 0,
          'ĐVT': item.dvt || 'p',
          'Ngày tạo': formatDate(item.ngay_tao),
          'Ngày giao': formatDate(item.ngay_giao),
          'Ngày hoàn thành': ((Number(item.so_luong || 0) - Number(item.sl_da_giao || 0)) <= 0) ? formatDate(item.ngay_hoan_thanh) : '-'
        })
      })
      
      excelData.push({
        'Mã PO': '',
        'Mã BV': '',
        'Mã KH': '',
        'Số lượng': '',
        'ĐVT': '',
        'Ngày tạo': '',
        'Ngày giao': '',
        'Ngày hoàn thành': ''
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

const downloadTemplate = () => {
  try {
    const templateData = [
      {
        'Mã PO': 'PO001',
        'Mã BV': 'BV001',
        'Mã KH': 'KH001',
        'Số lượng': 100,
        'ĐVT': 'p',
        'Ngày tạo': '2024-01-15',
        'Ngày giao': '2024-01-20',
        'Ngày hoàn thành': '2024-01-20'
      },
      {
        'Mã PO': 'PO001',
        'Mã BV': 'BV002',
        'Mã KH': 'KH002',
        'Số lượng': 150,
        'ĐVT': 'p',
        'Ngày tạo': '2024-01-15',
        'Ngày giao': '2024-01-20',
        'Ngày hoàn thành': ''
      },
      {
        'Mã PO': 'PO002',
        'Mã BV': 'BV003',
        'Mã KH': 'KH001',
        'Số lượng': 200,
        'ĐVT': 'p',
        'Ngày tạo': '2024-01-16',
        'Ngày giao': '2024-01-21',
        'Ngày hoàn thành': ''
      }
    ]
    
    const wsData = XLSX.utils.json_to_sheet(templateData)
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, wsData, 'Dữ liệu mẫu')
    
    XLSX.writeFile(wb, 'QLPO_Template.xlsx')
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
        
        // Đọc sheet đầu tiên
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        // Chuyển đổi sang JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Array<{
          'Mã PO': string
          'Mã BV': string
          'Mã KH'?: string
          'Số lượng'?: number
          'ĐVT'?: string
          'Ngày tạo': string | number
          'Ngày giao': string | number
        }>
        
        if (jsonData.length === 0) {
          alert('File Excel không có dữ liệu!')
          loading.value = false
          return
        }
        
        // Validate và chuẩn hóa dữ liệu
        const validData: Array<{
          ma_po: string
          ma_bv: string
          ma_kh?: string
          so_luong?: number
          dvt?: string
          ngay_tao: string
          ngay_giao: string
        }> = []
        
        const errors: string[] = []
        
        jsonData.forEach((row, index) => {
          const rowNum = index + 2 // +2 vì Excel bắt đầu từ 1 và có header
          
          // Kiểm tra các trường bắt buộc
          if (!row['Mã PO']) {
            errors.push(`Dòng ${rowNum}: Thiếu Mã PO`)
            return
          }
          if (!row['Mã BV']) {
            errors.push(`Dòng ${rowNum}: Thiếu Mã BV`)
            return
          }
          
          // Chuyển đổi ngày từ Excel
          const convertExcelDate = (value: string | number): string => {
            if (typeof value === 'number') {
              // Excel date serial number
              const date = XLSX.SSF.parse_date_code(value)
              return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
            }
            // Nếu là string, giữ nguyên (giả sử đã đúng định dạng)
            return value
          }
          
          validData.push({
            ma_po: String(row['Mã PO']).trim(),
            ma_bv: String(row['Mã BV']).trim(),
            ma_kh: row['Mã KH'] ? String(row['Mã KH']).trim() : undefined,
            so_luong: row['Số lượng'] ? Number(row['Số lượng']) : undefined,
            dvt: row['ĐVT'] ? String(row['ĐVT']).trim() : undefined,
            ngay_tao: row['Ngày tạo'] ? convertExcelDate(row['Ngày tạo']) : '',
            ngay_giao: row['Ngày giao'] ? convertExcelDate(row['Ngày giao']) : ''
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
        
        // Xác nhận trước khi import
        const confirmMsg = `Bạn có chắc muốn import ${validData.length} dòng dữ liệu?\n\n` +
          `Các Mã PO: ${[...new Set(validData.map(d => d.ma_po))].join(', ')}`
        
        if (!confirm(confirmMsg)) {
          loading.value = false
          return
        }
        
        // Import từng dòng
        let successCount = 0
        let failCount = 0
        const failedRows: string[] = []
        
        for (let i = 0; i < validData.length; i++) {
          try {
            await qlpoService.create(validData[i])
            successCount++
          } catch (err: unknown) {
            failCount++
            const error = err as { response?: { data?: { message?: string } } }
            const errorMsg = error?.response?.data?.message || 'Lỗi không xác định'
            failedRows.push(`Dòng ${i + 2}: ${validData[i].ma_po} - ${validData[i].ma_bv} (${errorMsg})`)
          }
        }
        
        // Reload dữ liệu
        await loadData()
        await loadMaPOList()
        
        // Hiển thị kết quả
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
    // Reset input để có thể chọn lại cùng file
    target.value = ''
  }
}

onMounted(() => {
  loadData()
  loadMaPOList()
  loadMaBVList()
})
</script>

<style scoped>
/* Force date picker to show */
.date-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  position: relative;
}

/* Show native date picker icon */
.date-input::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  opacity: 1;
  width: 20px;
  height: 20px;
  background: transparent;
  color: #6b7280;
}

.date-input::-webkit-calendar-picker-indicator:hover {
  color: #374151;
}

/* Dark mode */
.dark .date-input::-webkit-calendar-picker-indicator {
  color: #9ca3af;
}

.dark .date-input::-webkit-calendar-picker-indicator:hover {
  color: #d1d5db;
}

/* Firefox date picker */
.date-input::-moz-calendar-picker-indicator {
  cursor: pointer;
  opacity: 1;
}

/* Ensure date input works on all browsers */
.date-input[type="date"] {
  min-height: 42px;
  line-height: 1.5;
}

/* Force show calendar icon */
.date-input::-webkit-inner-spin-button,
.date-input::-webkit-clear-button {
  display: none;
}
</style>
