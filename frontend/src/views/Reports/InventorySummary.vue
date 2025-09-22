<template>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Inventory Summary</h1>
        <div class="flex gap-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <span class="material-icons mr-2">download</span>
            Export Report
          </button>
          <button class="bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
            <span class="material-icons mr-2">print</span>
            Print
          </button>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">As of Date</label>
            <input type="date" class="w-full p-2 border border-gray-300 rounded-md" v-model="filterDate">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select class="w-full p-2 border border-gray-300 rounded-md" v-model="filterCategory">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <select class="w-full p-2 border border-gray-300 rounded-md" v-model="filterSupplier">
              <option value="">All Suppliers</option>
              <option v-for="supplier in suppliers" :key="supplier" :value="supplier">{{ supplier }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-md w-full" @click="applyFilters">Apply Filters</button>
          </div>
        </div>
      </div>
  
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="rounded-full bg-blue-100 p-3 mr-4">
              <span class="material-icons text-blue-600">inventory_2</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Items</p>
              <p class="text-2xl font-bold">{{ summaryData.totalItems }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="rounded-full bg-green-100 p-3 mr-4">
              <span class="material-icons text-green-600">check_circle</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">In Stock</p>
              <p class="text-2xl font-bold">{{ summaryData.inStock }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="rounded-full bg-yellow-100 p-3 mr-4">
              <span class="material-icons text-yellow-600">warning</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Low Stock</p>
              <p class="text-2xl font-bold">{{ summaryData.lowStock }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="rounded-full bg-red-100 p-3 mr-4">
              <span class="material-icons text-red-600">cancel</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Out of Stock</p>
              <p class="text-2xl font-bold">{{ summaryData.outOfStock }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Inventory Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in inventoryData" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.code }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.category }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.stock }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ item.price.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ (item.stock * item.price).toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="['px-2 py-1 text-xs rounded-full', 
                    item.status === 'In Stock' ? 'bg-green-100 text-green-800' : 
                    item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800']">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of
                <span class="font-medium">{{ inventoryData.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <span class="material-icons text-sm">chevron_left</span>
                </a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">1</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">2</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">3</a>
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
                  <span class="material-icons text-sm">chevron_right</span>
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
  
  // Sample data - in a real app, this would come from an API
  const inventoryData = ref([
    { code: 'M001', name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 150, price: 5.25, status: 'In Stock' },
    { code: 'M002', name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 75, price: 8.50, status: 'In Stock' },
    { code: 'M003', name: 'Ibuprofen 200mg', category: 'Pain Relief', stock: 45, price: 6.75, status: 'In Stock' },
    { code: 'M004', name: 'Vitamin C 1000mg', category: 'Vitamins', stock: 8, price: 12.99, status: 'Low Stock' },
    { code: 'M005', name: 'Metformin 500mg', category: 'Diabetes', stock: 0, price: 15.25, status: 'Out of Stock' },
    { code: 'M006', name: 'Aspirin 81mg', category: 'Pain Relief', stock: 200, price: 4.50, status: 'In Stock' },
    { code: 'M007', name: 'Lisinopril 10mg', category: 'Blood Pressure', stock: 5, price: 9.75, status: 'Low Stock' },
    { code: 'M008', name: 'Atorvastatin 20mg', category: 'Cholesterol', stock: 60, price: 18.25, status: 'In Stock' },
    { code: 'M009', name: 'Omeprazole 20mg', category: 'Acid Reflux', stock: 0, price: 11.50, status: 'Out of Stock' },
    { code: 'M010', name: 'Metoprolol 50mg', category: 'Blood Pressure', stock: 30, price: 7.25, status: 'In Stock' },
  ])
  
  const filterDate = ref('')
  const filterCategory = ref('')
  const filterSupplier = ref('')
  
  const categories = ref(['Pain Relief', 'Antibiotics', 'Vitamins', 'Diabetes', 'Blood Pressure', 'Cholesterol', 'Acid Reflux'])
  const suppliers = ref(['PharmaCorp', 'MediSupply', 'HealthPlus', 'DrugsDirect'])
  
  // Compute summary data
  const summaryData = computed(() => {
    const totalItems = inventoryData.value.length
    const inStock = inventoryData.value.filter(item => item.status === 'In Stock').length
    const lowStock = inventoryData.value.filter(item => item.status === 'Low Stock').length
    const outOfStock = inventoryData.value.filter(item => item.status === 'Out of Stock').length
    
    return {
      totalItems,
      inStock,
      lowStock,
      outOfStock
    }
  })
  
  function applyFilters() {
    // In a real app, this would filter the data based on the selected filters
    console.log('Applying filters:', {
      date: filterDate.value,
      category: filterCategory.value,
      supplier: filterSupplier.value
    })
    // You would typically make an API call here with the filter parameters
  }
  </script>