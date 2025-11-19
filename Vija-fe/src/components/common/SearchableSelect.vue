<template>
  <div class="relative" ref="dropdownRef">
    <label v-if="label" class="block text-sm font-medium mb-2">
      {{ label }}<span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        v-model="searchQuery"
        @focus="showDropdown = true"
        @input="handleSearch"
        type="text"
        :placeholder="placeholder"
        :required="required"
        class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 pr-8"
      />
      <svg
        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    
    <!-- Dropdown list -->
    <div
      v-if="showDropdown && filteredOptions.length > 0"
      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="option in filteredOptions"
        :key="option.value"
        @click="selectOption(option)"
        class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm"
      >
        {{ option.label }}
      </div>
    </div>
    
    <!-- No results -->
    <div
      v-if="showDropdown && searchQuery && filteredOptions.length === 0"
      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg px-3 py-2 text-sm text-gray-500"
    >
      Không tìm thấy kết quả
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: Option[]
  label?: string
  placeholder?: string
  required?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const searchQuery = ref('')
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Khởi tạo searchQuery với giá trị hiện tại
watch(() => props.modelValue, (newValue) => {
  if (newValue && !searchQuery.value) {
    const option = props.options.find(opt => opt.value === newValue)
    if (option) {
      searchQuery.value = option.label
    }
  }
}, { immediate: true })

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.options
  }
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query) ||
    option.value.toLowerCase().includes(query)
  )
})

const handleSearch = () => {
  showDropdown.value = true
}

const selectOption = (option: Option) => {
  searchQuery.value = option.label
  emit('update:modelValue', option.value)
  showDropdown.value = false
}

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
