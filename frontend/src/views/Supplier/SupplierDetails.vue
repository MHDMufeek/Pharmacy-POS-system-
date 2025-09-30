<template>
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Supplier Details</h1>
        <button 
          @click="$emit('go-back')" 
          class="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span class="material-icons mr-1">arrow_back</span>
          
        </button>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex justify-between mb-6">
        <div class="flex gap-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center" @click="showAddSupplierModal">
            <span class="material-icons text-sm mr-1">add</span>
            
          </button>
          <button class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
            <span class="material-icons text-sm mr-1">file_download</span>
            
          </button>
        </div>
        <div class="flex gap-2">
          <div class="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <span class="material-icons text-gray-400 mr-2">search</span>
            <input
              type="text"
              placeholder="Search suppliers..."
              class="bg-transparent outline-none w-full text-sm"
              v-model="searchQuery"
            />
          </div>
          <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center">
            <span class="material-icons text-sm mr-1">filter_list</span>
            
          </button>
        </div>
      </div>
  
      <!-- Suppliers Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Order
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span class="material-icons text-blue-600"></span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ supplier.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ supplier.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ supplier.contactPerson }}</div>
                <div class="text-sm text-gray-500">{{ supplier.phone }}</div>
                <div class="text-sm text-gray-500">{{ supplier.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ supplier.productCount }} items
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', 
                             supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                  {{ supplier.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(supplier.lastOrder) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3" @click="editSupplier(supplier)">
                  <span class="material-icons">edit</span>
                </button>
                <button class="text-green-600 hover:text-green-900 mr-3" @click="viewSupplier(supplier)">
                  <span class="material-icons">visibility</span>
                </button>
                <button class="text-red-600 hover:text-red-900" @click="deleteSupplier(supplier)">
                  <span class="material-icons">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="filteredSuppliers.length === 0" class="text-center py-12">
          <span class="material-icons text-gray-300 text-6xl">business</span>
          <p class="mt-4 text-gray-500">No suppliers found</p>
          <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg" @click="showAddSupplierModal">
            Add Your First Supplier
          </button>
        </div>
        
        <!-- Pagination -->
        <div v-if="filteredSuppliers.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredSuppliers.length }}</span> of
                <span class="font-medium">{{ filteredSuppliers.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <span class="material-icons">Back</span>
                </a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">1</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">2</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">3</a>
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
                  <span class="material-icons">Next</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Supplier Modal -->
      <div v-if="showSupplierModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">{{ isEditing ? 'Edit' : 'Add' }} Supplier</h3>
          </div>
          <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
              <input 
                type="text" 
                v-model="currentSupplier.name" 
                class="w-full bg-black-100 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Enter supplier name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
              <input 
                type="text" 
                v-model="currentSupplier.contactPerson" 
                class="w-full bg-black-100 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Enter contact person name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input 
                type="tel" 
                v-model="currentSupplier.phone" 
                class="w-full bg-black-100 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Enter phone number"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                v-model="currentSupplier.email" 
                class="w-full bg-black-100 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Enter email address"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea 
                v-model="currentSupplier.address" 
                class="w-full bg-black-100 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Enter full address"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="currentSupplier.status" class="w-full bg-black-100 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea 
                v-model="currentSupplier.notes" 
                class="w-full bg-black-100 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Additional notes about this supplier"
                rows="2"
              ></textarea>
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-3">
            <button @click="showSupplierModal = false" class="px-4 py-2 text-gray-700 bg-blue-200 rounded-lg">Cancel</button>
            <button @click="saveSupplier" class="px-4 py-2 text-white bg-blue-600 rounded-lg">{{ isEditing ? 'Update' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  const searchQuery = ref('')
  const showSupplierModal = ref(false)
  const isEditing = ref(false)
  const currentSupplier = ref({
    id: '',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    status: 'Active',
    productCount: 0,
    lastOrder: '',
    notes: ''
  })
  
  // Sample data - in a real application, this would come from an API
  const suppliers = ref([
    { id: 'SUP001', name: 'Pharma Distributors Inc.', contactPerson: 'John Smith', phone: '+1 (555) 123-4567', email: 'john@pharmadist.com', address: '123 Medical Blvd, Health City', status: 'Active', productCount: 45, lastOrder: '2023-10-20', notes: 'Primary supplier for antibiotics' },
    { id: 'SUP002', name: 'MediSupply Co.', contactPerson: 'Sarah Johnson', phone: '+1 (555) 987-6543', email: 'sarah@medisupply.com', address: '456 Healthcare Ave, Medtown', status: 'Active', productCount: 32, lastOrder: '2023-10-18', notes: 'Specializes in surgical supplies' },
    { id: 'SUP003', name: 'Global Pharma Ltd.', contactPerson: 'Mike Chen', phone: '+1 (555) 456-7890', email: 'mike@globalpharma.com', address: '789 Drug Street, Pharmaville', status: 'Active', productCount: 67, lastOrder: '2023-10-15', notes: 'International supplier with wide range' },
    { id: 'SUP004', name: 'First Aid Supplies Corp.', contactPerson: 'Emily Davis', phone: '+1 (555) 234-5678', email: 'emily@firstaid.com', address: '321 Emergency Rd, Safety City', status: 'Inactive', productCount: 28, lastOrder: '2023-09-05', notes: 'Temporarily suspended due to quality issues' },
    { id: 'SUP005', name: 'Lab Equipment Specialists', contactPerson: 'David Wilson', phone: '+1 (555) 876-5432', email: 'david@labspecialists.com', address: '654 Laboratory Lane, Sciencetown', status: 'Active', productCount: 19, lastOrder: '2023-10-22', notes: 'Specialized lab equipment only' }
  ])
  
  onMounted(() => {
    loadSuppliers()
  })
  
  const filteredSuppliers = computed(() => {
    if (!searchQuery.value) return suppliers.value
    const query = searchQuery.value.toLowerCase()
    return suppliers.value.filter(supplier => 
      supplier.name.toLowerCase().includes(query) || 
      supplier.contactPerson.toLowerCase().includes(query) ||
      supplier.email.toLowerCase().includes(query) ||
      supplier.phone.includes(query)
    )
  })
  
  function loadSuppliers() {
    // In a real application, this would fetch data from an API
    console.log('Loading suppliers...')
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString()
  }
  
  function showAddSupplierModal() {
    isEditing.value = false
    currentSupplier.value = {
      id: 'SUP' + String(suppliers.value.length + 1).padStart(3, '0'),
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      status: 'Active',
      productCount: 0,
      lastOrder: new Date().toISOString().split('T')[0],
      notes: ''
    }
    showSupplierModal.value = true
  }
  
  function editSupplier(supplier) {
    isEditing.value = true
    currentSupplier.value = { ...supplier }
    showSupplierModal.value = true
  }
  
  function viewSupplier(supplier) {
    alert(`Viewing details for: ${supplier.name}`)
    // In a real application, this would navigate to a detailed view
  }
  
  function deleteSupplier(supplier) {
    if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      suppliers.value = suppliers.value.filter(s => s.id !== supplier.id)
      alert('Supplier deleted successfully')
    }
  }
  
  function saveSupplier() {
    if (!currentSupplier.value.name || !currentSupplier.value.contactPerson || !currentSupplier.value.phone) {
      alert('Please fill in all required fields')
      return
    }
  
    if (isEditing.value) {
      // Update existing supplier
      const index = suppliers.value.findIndex(s => s.id === currentSupplier.value.id)
      if (index !== -1) {
        suppliers.value[index] = { ...currentSupplier.value }
      }
    } else {
      // Add new supplier
      suppliers.value.push({ ...currentSupplier.value })
    }
  
    showSupplierModal.value = false
    alert(`Supplier ${isEditing.value ? 'updated' : 'added'} successfully`)
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 100%;
  }
  </style>
  