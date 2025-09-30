<template>
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Stock Update</h1>
        <button 
          @click="$emit('go-back')" 
          class="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span class="material-icons mr-1">arrow_back</span>
        
        </button>
      </div>
  
      <!-- Filters and Actions -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-end">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Item</label>
              <select class="w-full bg-black-100 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="">All Items</option>
                <option v-for="item in items" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select class="w-full bg-black-100 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category">{{ category }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
              <select class="w-full bg-black-100 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="">All Status</option>
                <option value="low">Low Stock</option>
                <option value="adequate">Adequate Stock</option>
                <option value="over">Overstock</option>
              </select>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
              <span class="material-icons text-sm mr-1">search</span>
              
            </button>
            <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center">
              <span class="material-icons text-sm mr-1">refresh</span>
              
            </button>
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex justify-between mb-6">
        <div class="flex gap-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center" @click="showBulkUpdate = true">
            <span class="material-icons text-sm mr-1">edit</span>
            
          </button>
          <button class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
            <span class="material-icons text-sm mr-1">file_download</span>
            
          </button>
        </div>
        <div class="flex gap-2">
          <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center">
            <span class="material-icons text-sm mr-1">settings</span>
            
          </button>
          <button class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center" @click="loadStockData">
            <span class="material-icons text-sm mr-1">sync</span>
            
          </button>
        </div>
      </div>
  
      <!-- Stock Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Stock
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Level
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in stockItems" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span class="material-icons text-blue-600"></span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ item.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900 mr-2">{{ item.currentStock }} units</span>
                  <button 
                    class="text-blue-600 hover:text-blue-800 ml-2"
                    @click="editStock(item)"
                  >
                    <span class="material-icons text-sm">edit</span>
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.minLevel }} units
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', 
                             getStockStatus(item) === 'Low' ? 'bg-red-100 text-red-800' : 
                             getStockStatus(item) === 'Adequate' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                  {{ getStockStatus(item) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(item.lastUpdated) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3" @click="showStockHistory(item)">
                  <span class="material-icons">history</span>
                </button>
                <button class="text-green-600 hover:text-green-900" @click="showRestockModal(item)">
                  <span class="material-icons">add</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of
                <span class="font-medium">{{ stockItems.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">revious</span>
                    <span class="material-icons">chevron_left</span>
                </a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">1</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">2</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">3</a>
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">next</span>
                    <span class="material-icons">chevron_right</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Stock Update Modal -->
      <div v-if="showUpdateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Update Stock</h3>
          </div>
          <div class="px-6 py-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Item</label>
              <p class="text-sm text-gray-900 font-medium">{{ selectedItem.name }}</p>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
              <p class="text-sm text-gray-600">{{ selectedItem.currentStock }} units</p>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Adjustment Type</label>
              <select v-model="adjustmentType" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="add">Add Stock</option>
                <option value="subtract">Subtract Stock</option>
                <option value="set">Set Exact Quantity</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input 
                type="number" 
                v-model="adjustmentQuantity" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                min="0"
              >
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <input 
                type="text" 
                v-model="adjustmentReason" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Enter reason for adjustment"
              >
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-3">
            <button @click="showUpdateModal = false" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg">Cancel</button>
            <button @click="updateStock" class="px-4 py-2 text-white bg-blue-600 rounded-lg">Update</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const showUpdateModal = ref(false)
  const showBulkUpdate = ref(false)
  const selectedItem = ref({})
  const adjustmentType = ref('add')
  const adjustmentQuantity = ref(0)
  const adjustmentReason = ref('')
  
  // Sample data - in a real application, this would come from an API
  const items = ref([
    { id: 'MED001', name: 'Paracetamol 500mg', category: 'Pain Relief' },
    { id: 'MED002', name: 'Amoxicillin 250mg', category: 'Antibiotics' },
    { id: 'MED003', name: 'Vitamin C 1000mg', category: 'Supplements' },
    { id: 'MED004', name: 'Ibuprofen 400mg', category: 'Pain Relief' },
    { id: 'MED005', name: 'Metformin 500mg', category: 'Diabetes' },
  ])
  
  const categories = ref(['Pain Relief', 'Antibiotics', 'Supplements', 'Diabetes', 'Cholesterol', 'Cardiac', 'GI', 'Hormones', 'Respiratory'])
  
  const stockItems = ref([
    { id: 'MED001', name: 'Paracetamol 500mg', category: 'Pain Relief', currentStock: 150, minLevel: 50, lastUpdated: '2023-10-15' },
    { id: 'MED002', name: 'Amoxicillin 250mg', category: 'Antibiotics', currentStock: 75, minLevel: 30, lastUpdated: '2023-10-14' },
    { id: 'MED003', name: 'Vitamin C 1000mg', category: 'Supplements', currentStock: 200, minLevel: 40, lastUpdated: '2023-10-16' },
    { id: 'MED004', name: 'Ibuprofen 400mg', category: 'Pain Relief', currentStock: 8, minLevel: 25, lastUpdated: '2023-10-13' },
    { id: 'MED005', name: 'Metformin 500mg', category: 'Diabetes', currentStock: 120, minLevel: 35, lastUpdated: '2023-10-12' },
  ])
  
  onMounted(() => {
    loadStockData()
  })
  
  function loadStockData() {
    // In a real application, this would fetch data from an API
    console.log('Loading stock data...')
  }
  
  function getStockStatus(item) {
    if (item.currentStock <= item.minLevel) {
      return 'Low'
    } else if (item.currentStock <= item.minLevel * 2) {
      return 'Adequate'
    } else {
      return 'Good'
    }
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString()
  }
  
  function editStock(item) {
    selectedItem.value = item
    adjustmentType.value = 'add'
    adjustmentQuantity.value = 0
    adjustmentReason.value = ''
    showUpdateModal.value = true
  }
  
  function updateStock() {
    // In a real application, this would send an API request
    alert(`Stock updated for ${selectedItem.value.name}`)
    showUpdateModal.value = false
  }
  
  function showStockHistory(item) {
    alert(`Show stock history for ${item.name}`)
  }
  
  function showRestockModal(item) {
    selectedItem.value = item
    adjustmentType.value = 'add'
    adjustmentQuantity.value = 50 // Default restock quantity
    adjustmentReason.value = 'Restock'
    showUpdateModal.value = true
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 100%;
  }
  </style>