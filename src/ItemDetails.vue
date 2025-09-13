<template>
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Item Details</h1>
        <button 
          @click="$router.back()" 
          class="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span class="material-icons mr-1">arrow_back</span>
          Back
        </button>
      </div>
  
      <!-- Search and Filter Section -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <span class="material-icons text-gray-400 mr-2">search</span>
              <input
                type="text"
                placeholder="Search items..."
                class="bg-transparent outline-none w-full text-sm"
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="flex gap-2">
            <select class="bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none">
              <option>All Categories</option>
              <option v-for="category in categories" :key="category">{{ category }}</option>
            </select>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
              <span class="material-icons text-sm mr-1">filter_list</span>
              Filter
            </button>
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex justify-between mb-6">
        <div class="flex gap-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
            <span class="material-icons text-sm mr-1">add</span>
            Add New Item
          </button>
          <button class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
            <span class="material-icons text-sm mr-1">file_download</span>
            Export
          </button>
        </div>
        <div>
          <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center">
            <span class="material-icons text-sm mr-1">settings</span>
            Columns
          </button>
        </div>
      </div>
  
      <!-- Items Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" class="rounded text-blue-600">
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="rounded text-blue-600">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span class="material-icons text-blue-600">inventory_2</span>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span :class="{'text-red-600 font-bold': item.stock < 10, 'text-green-600': item.stock >= 10}">
                  {{ item.stock }} units
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ item.price.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', 
                             item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3">
                  <span class="material-icons">edit</span>
                </button>
                <button class="text-red-600 hover:text-red-900">
                  <span class="material-icons">delete</span>
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
                <span class="font-medium">97</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <span class="material-icons">chevron_left</span>
                </a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">1</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">2</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">3</a>
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
                  <span class="material-icons">chevron_right</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const searchQuery = ref('')
  
  // Sample data - in a real application, this would come from an API
  const items = ref([
    { id: 'MED001', name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 150, price: 5.99, status: 'Active' },
    { id: 'MED002', name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 75, price: 12.50, status: 'Active' },
    { id: 'MED003', name: 'Vitamin C 1000mg', category: 'Supplements', stock: 200, price: 8.75, status: 'Active' },
    { id: 'MED004', name: 'Ibuprofen 400mg', category: 'Pain Relief', stock: 8, price: 6.25, status: 'Active' },
    { id: 'MED005', name: 'Metformin 500mg', category: 'Diabetes', stock: 120, price: 15.30, status: 'Active' },
    { id: 'MED006', name: 'Atorvastatin 20mg', category: 'Cholesterol', stock: 95, price: 22.40, status: 'Active' },
    { id: 'MED007', name: 'Aspirin 81mg', category: 'Cardiac', stock: 0, price: 4.15, status: 'Inactive' },
    { id: 'MED008', name: 'Omeprazole 20mg', category: 'GI', stock: 60, price: 18.75, status: 'Active' },
    { id: 'MED009', name: 'Levothyroxine 50mcg', category: 'Hormones', stock: 45, price: 13.20, status: 'Active' },
    { id: 'MED010', name: 'Albuterol Inhaler', category: 'Respiratory', stock: 25, price: 28.50, status: 'Active' }
  ])
  
  const categories = ref(['Pain Relief', 'Antibiotics', 'Supplements', 'Diabetes', 'Cholesterol', 'Cardiac', 'GI', 'Hormones', 'Respiratory'])
  
  const filteredItems = computed(() => {
    if (!searchQuery.value) return items.value
    const query = searchQuery.value.toLowerCase()
    return items.value.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    )
  })
  </script>
  
  <style scoped>
  .container {
    max-width: 100%;
  }
  </style>