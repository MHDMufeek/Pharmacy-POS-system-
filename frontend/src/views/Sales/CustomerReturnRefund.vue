<template>
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-blue-900">Customer Return / Refund</h1>
          <p class="text-gray-600">Process product returns and issue refunds to customers</p>
        </div>
  
        <!-- Action buttons -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex space-x-3">
            <button 
              @click="showNewReturnForm = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <span class="material-icons mr-2">add</span>
              New Return
            </button>
            <button class="bg-blue-600 hover:bg-blue-700 text-white-700 px-4 py-2 rounded-md flex items-center">
              <span class="material-icons mr-2">print</span>
              Print
            </button>
          </div>
          
          <div class="flex items-center">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search returns..." 
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="searchQuery"
              >
              <span class="material-icons absolute left-3 top-2.5 text-gray-400">search</span>
            </div>
          </div>
        </div>
  
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-white p-4 rounded-lg shadow">
            <div class="flex justify-between items-center">
              <h3 class="text-gray-500">Total Returns</h3>
              <span class="material-icons text-blue-500">assignment_return</span>
            </div>
            <p class="text-2xl font-bold mt-2">142</p>
            <p class="text-sm text-green-500 flex items-center">
              <span class="material-icons text-sm mr-1">arrow_upward</span>
              12% from last month
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg shadow">
            <div class="flex justify-between items-center">
              <h3 class="text-gray-500">Pending Approval</h3>
              <span class="material-icons text-yellow-500">pending_actions</span>
            </div>
            <p class="text-2xl font-bold mt-2">23</p>
            <p class="text-sm text-gray-500">Require attention</p>
          </div>
          
          <div class="bg-white p-4 rounded-lg shadow">
            <div class="flex justify-between items-center">
              <h3 class="text-gray-500">Refund Value</h3>
              <span class="material-icons text-green-500">payments</span>
            </div>
            <p class="text-2xl font-bold mt-2">$4,832</p>
            <p class="text-sm text-gray-500">This month</p>
          </div>
        </div>
  
        <!-- Returns Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="returnItem in filteredReturns" :key="returnItem.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{{ returnItem.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ returnItem.customer }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ returnItem.date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ returnItem.items }} items</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ returnItem.amount }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="['px-2 py-1 text-xs rounded-full', statusClasses[returnItem.status]]">
                      {{ returnItem.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="viewReturn(returnItem)" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button @click="editReturn(returnItem)" class="text-green-600 hover:text-green-900">Edit</button>
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
                  Showing <span class="font-medium">1</span> to <span class="font-medium">5</span> of
                  <span class="font-medium">142</span> results
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
  
        <!-- New Return Modal -->
        <div v-if="showNewReturnForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">Process New Return</h3>
              <button @click="showNewReturnForm = false" class="text-gray-400 hover:text-gray-500">
                <span class="material-icons">close</span>
              </button>
            </div>
            
            <div class="px-6 py-4">
              <form @submit.prevent="submitReturn">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sale Invoice Number</label>
                    <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                  </div>
                </div>
                
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="">Select Customer</option>
                    <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.name }}</option>
                  </select>
                </div>
                
                <div class="mb-4">
                  <div class="flex justify-between items-center mb-2">
                    <label class="block text-sm font-medium text-gray-700">Return Items</label>
                    <button type="button" class="text-blue-600 text-sm flex items-center">
                      <span class="material-icons text-sm mr-1">add</span>
                      Add Item
                    </button>
                  </div>
                  
                  <div class="border border-gray-200 rounded-md overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                          <td class="px-3 py-2 whitespace-nowrap">
                            <select class="w-full px-2 py-1 border border-gray-300 rounded-md">
                              <option value="">Select Product</option>
                              <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
                            </select>
                          </td>
                          <td class="px-3 py-2 whitespace-nowrap">
                            <input type="number" min="1" class="w-full px-2 py-1 border border-gray-300 rounded-md" value="1">
                          </td>
                          <td class="px-3 py-2 whitespace-nowrap">
                            <select class="w-full px-2 py-1 border border-gray-300 rounded-md">
                              <option value="">Select Reason</option>
                              <option value="defective">Defective Product</option>
                              <option value="wrong">Wrong Item Sent</option>
                              <option value="change">Change of Mind</option>
                            </select>
                          </td>
                          <td class="px-3 py-2 whitespace-nowrap">
                            <button type="button" class="text-red-600">
                              <span class="material-icons">delete</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button @click="showNewReturnForm = false" type="button" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Process Return
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  const showNewReturnForm = ref(false)
  const searchQuery = ref('')
  
  // Sample data - in a real app, this would come from an API
  const returns = ref([
    { id: 'RT-001', customer: 'John Smith', date: '2023-05-15', items: 2, amount: 124.50, status: 'Completed' },
    { id: 'RT-002', customer: 'Maria Garcia', date: '2023-05-14', items: 1, amount: 45.99, status: 'Pending' },
    { id: 'RT-003', customer: 'Robert Johnson', date: '2023-05-13', items: 3, amount: 210.75, status: 'Processing' },
    { id: 'RT-004', customer: 'Sarah Williams', date: '2023-05-12', items: 1, amount: 32.50, status: 'Completed' },
    { id: 'RT-005', customer: 'James Brown', date: '2023-05-11', items: 2, amount: 89.99, status: 'Rejected' },
  ])
  
  const customers = ref([
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Maria Garcia' },
    { id: 3, name: 'Robert Johnson' },
  ])
  
  const products = ref([
    { id: 1, name: 'Amoxicillin 500mg' },
    { id: 2, name: 'Ibuprofen 200mg' },
    { id: 3, name: 'Paracetamol 500mg' },
  ])
  
  const statusClasses = {
    'Completed': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Rejected': 'bg-red-100 text-red-800',
  }
  
  const filteredReturns = computed(() => {
    if (!searchQuery.value) return returns.value
    const query = searchQuery.value.toLowerCase()
    return returns.value.filter(item => 
      item.id.toLowerCase().includes(query) || 
      item.customer.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    )
  })
  
  function viewReturn(returnItem) {
    console.log('View return:', returnItem)
    // In a real app, this would navigate to a detail page
  }
  
  function editReturn(returnItem) {
    console.log('Edit return:', returnItem)
    // In a real app, this would open an edit form
  }
  
  function submitReturn() {
    console.log('Return submitted')
    showNewReturnForm.value = false
    // In a real app, this would send data to an API
  }
  </script>