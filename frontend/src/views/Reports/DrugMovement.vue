<template>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Drugs Movement Report</h1>
        <div class="flex gap-3">
          <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center">
            <span class="material-icons mr-2">download</span>
            Export
          </button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <span class="material-icons mr-2">filter_list</span>
            Filter
          </button>
        </div>
      </div>
  
      <!-- Date Range and Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Drug Category</label>
            <select class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Categories</option>
              <option>Analgesics</option>
              <option>Antibiotics</option>
              <option>Antivirals</option>
              <option>Vitamins</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Movement Type</label>
            <select class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Movements</option>
              <option>Incoming</option>
              <option>Outgoing</option>
              <option>Adjustments</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Generate Report
          </button>
        </div>
      </div>
  
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span class="material-icons text-green-600">arrow_downward</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Incoming</p>
              <p class="text-xl font-semibold">1,245</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span class="material-icons text-red-600">arrow_upward</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Outgoing</p>
              <p class="text-xl font-semibold">892</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span class="material-icons text-blue-600">compare_arrows</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Adjustments</p>
              <p class="text-xl font-semibold">47</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <span class="material-icons text-purple-600">inventory</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Net Movement</p>
              <p class="text-xl font-semibold text-green-600">+353</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Drugs Movement Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movement Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(movement, index) in movements" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ movement.drugName }}</div>
                <div class="text-sm text-gray-500">Batch: {{ movement.batchNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {{ movement.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'px-2 py-1 text-xs rounded-full': true,
                  'bg-green-100 text-green-800': movement.type === 'Incoming',
                  'bg-red-100 text-red-800': movement.type === 'Outgoing',
                  'bg-blue-100 text-blue-800': movement.type === 'Adjustment'
                }">
                  {{ movement.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div :class="{
                  'font-medium': true,
                  'text-green-600': movement.type === 'Incoming',
                  'text-red-600': movement.type === 'Outgoing',
                  'text-blue-600': movement.type === 'Adjustment'
                }">
                  {{ movement.type !== 'Outgoing' ? '+' : '-' }}{{ movement.quantity }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-gray-900">{{ formatDate(movement.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ movement.reference }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Pagination -->
      <div class="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">124</span> results
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
            Previous
          </button>
          <button class="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            1
          </button>
          <button class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
            2
          </button>
          <button class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
            3
          </button>
          <button class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
            Next
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Sample data - replace with actual data from your API
  const movements = ref([
    { id: 1, drugName: 'Paracetamol 500mg', batchNumber: 'BATCH001', category: 'Analgesics', type: 'Incoming', quantity: 100, date: '2023-06-15', reference: 'PO-12345' },
    { id: 2, drugName: 'Amoxicillin 250mg', batchNumber: 'BATCH002', category: 'Antibiotics', type: 'Outgoing', quantity: 25, date: '2023-06-15', reference: 'SO-67890' },
    { id: 3, drugName: 'Vitamin C 1000mg', batchNumber: 'BATCH003', category: 'Vitamins', type: 'Incoming', quantity: 50, date: '2023-06-14', reference: 'PO-12346' },
    { id: 4, drugName: 'Ibuprofen 400mg', batchNumber: 'BATCH004', category: 'Analgesics', type: 'Adjustment', quantity: 5, date: '2023-06-14', reference: 'ADJ-0001' },
    { id: 5, drugName: 'Azithromycin 500mg', batchNumber: 'BATCH005', category: 'Antibiotics', type: 'Outgoing', quantity: 15, date: '2023-06-13', reference: 'SO-67891' },
    { id: 6, drugName: 'Metformin 500mg', batchNumber: 'BATCH006', category: 'Diabetes', type: 'Incoming', quantity: 75, date: '2023-06-13', reference: 'PO-12347' },
    { id: 7, drugName: 'Aspirin 100mg', batchNumber: 'BATCH007', category: 'Analgesics', type: 'Outgoing', quantity: 30, date: '2023-06-12', reference: 'SO-67892' },
    { id: 8, drugName: 'Omeprazole 20mg', batchNumber: 'BATCH008', category: 'GI', type: 'Incoming', quantity: 40, date: '2023-06-12', reference: 'PO-12348' },
    { id: 9, drugName: 'Atorvastatin 10mg', batchNumber: 'BATCH009', category: 'Cardiovascular', type: 'Adjustment', quantity: 3, date: '2023-06-11', reference: 'ADJ-0002' },
    { id: 10, drugName: 'Salbutamol Inhaler', batchNumber: 'BATCH010', category: 'Respiratory', type: 'Outgoing', quantity: 10, date: '2023-06-11', reference: 'SO-67893' }
  ])
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  </script>