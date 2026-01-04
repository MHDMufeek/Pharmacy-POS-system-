<template>
    <div class="container mx-auto p-6 dark:bg-slate-900 dark:text-white">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900 dark:text-blue-300">Supplier Details</h1>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex justify-between mb-6">
        <div class="flex gap-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center" @click="showAddSupplierModal">
            <span class="material-icons text-sm mr-1">add</span>
            Add Supplier
          </button>
        </div>
        <div class="flex gap-2">
          <div class="flex items-center bg-gray-100 rounded-lg px-3 py-2 dark:bg-slate-800">
            <span
              class="material-icons text-gray-600 mr-2 cursor-pointer dark:text-gray-300"
              role="button"
              tabindex="0"
              @click="focusSearch"
              @keydown.enter.prevent="focusSearch"
              @keydown.space.prevent="focusSearch"
            >search</span>
            <input
              ref="searchRef"
              type="text"
              placeholder="Search suppliers..."
              class="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-500 dark:text-gray-200 dark:placeholder-gray-400"
              v-model="searchQuery"
            />
            <button v-if="searchQuery" @click="clearSearch" class="ml-2 text-gray-500 hover:text-gray-700" title="Clear search">
              <span class="material-icons text-sm">close</span>
            </button>
          </div>
          <div class="relative">
            <button id="supplier-filter-btn" @click="toggleFilter" @keydown.enter.prevent="toggleFilter" @keydown.space.prevent="toggleFilter" :aria-expanded="filterOpen" aria-haspopup="true" type="button" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center dark:bg-slate-700 dark:text-gray-200">
              <span class="material-icons text-sm mr-1">filter_list</span>
              <span class="sr-only">Open filter menu</span>
            </button>

            <div v-if="filterOpen" id="supplier-filter-dropdown" @click.stop class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow border p-3 z-50 dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
              <label class="text-xs text-gray-500 mb-1 block dark:text-gray-300">Status</label>
              <select v-model="statusFilter" class="w-full rounded px-2 py-1 border text-sm text-gray-900 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600">
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                </select>
              <div class="mt-3 flex justify-end gap-2">
                <button @click="clearFilter" class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600">Clear</button>
                <button @click="applyFilter" class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Suppliers Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-transparent dark:divide-slate-700">
            <tr v-for="supplier in paginatedSuppliers" :key="supplier.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ supplier.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-300">ID: {{ supplier.id }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ supplier.contactPerson }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-300">{{ supplier.phone }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-300">{{ supplier.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', 
                             supplier.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300']">
                  {{ supplier.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3 dark:text-blue-300 dark:hover:text-blue-100" @click="editSupplier(supplier)">
                  <span class="material-icons">edit</span>
                </button>
                <button class="text-gray-600 hover:text-gray-900 mr-3 dark:text-gray-300 dark:hover:text-gray-100" @click="viewSupplier(supplier)" title="View details">
                  <span class="material-icons">visibility</span>
                </button>
                <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" @click="deleteSupplier(supplier)">
                  <span class="material-icons">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="totalSuppliers === 0" class="text-center py-12">
          <span class="material-icons text-gray-300 text-6xl dark:text-gray-500">business</span>
          <p class="mt-4 text-gray-500 dark:text-gray-400">No suppliers found</p>
          <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg" @click="showAddSupplierModal">
            Add Your First Supplier
          </button>
        </div>
        
        <!-- Pagination (visible only when suppliers exceed current page size) -->
        <div v-if="totalSuppliers > pageSize" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 dark:bg-slate-800 dark:border-t dark:border-slate-700 dark:text-gray-300">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing <span class="font-medium">{{ displayedFrom }}</span> to <span class="font-medium">{{ displayedTo }}</span> of
                <span class="font-medium">{{ totalSuppliers }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button @click.prevent="changePage(currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-transparent dark:text-gray-300 dark:hover:bg-slate-700">
                  <span class="sr-only">previous</span>
                    <span class="material-icons">chevron_left</span>
                </button>
                <button v-for="p in pageNumbers" :key="p" @click.prevent="changePage(p)" :class="['relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium', p === currentPage ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300' : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:hover:bg-slate-700']">{{ p }}</button>
                <button @click.prevent="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-transparent dark:text-gray-300 dark:hover:bg-slate-700">
                  <span class="sr-only">next</span>
                    <span class="material-icons">chevron_right</span> 
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Supplier Modal -->
      <div v-if="showSupplierModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden dark:bg-slate-800 dark:text-white">
          <div class="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b dark:bg-slate-800 dark:border-b dark:border-slate-700">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Supplier Details</h2>
              <p class="text-sm text-gray-600 mt-1 dark:text-gray-300">{{ currentSupplier.name }} — {{ currentSupplier.contactPerson || '' }}</p>
              <p class="text-xs text-gray-500 mt-1 dark:text-gray-400">{{ currentSupplier.phone }} · {{ currentSupplier.email }}</p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-slate-700">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div v-if="isViewing" class="px-6 py-6 overflow-auto flex-grow">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
              <div class="bg-green-50 p-4 rounded-lg">
                <div class="flex items-center">
                  <div class="bg-green-100 p-2 rounded-lg mr-3">
                    <span class="material-icons text-green-600">check_circle</span>
                  </div>
                  <div>
                    <p class="text-gray-500 text-xs">Status</p>
                    <p class="text-lg font-bold text-green-600">{{ currentSupplier.status || 'Active' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white p-4 rounded-lg shadow-sm dark:bg-slate-800 dark:text-white">
              <h3 class="text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Contact Person</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ currentSupplier.contactPerson || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Phone</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ currentSupplier.phone || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Email</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ currentSupplier.email || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Address</p>
                  <p class="text-sm text-gray-900 whitespace-pre-line dark:text-white">{{ currentSupplier.address || '-' }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-xs text-gray-500">Notes</p>
                  <p class="text-sm text-gray-900 whitespace-pre-line dark:text-white">{{ currentSupplier.notes || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Recent Activity Table (stock-update style) -->
            <div class="mt-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">Recent Activity</h3>
              <div class="overflow-auto max-h-48 bg-white rounded-lg p-4 dark:bg-slate-800 dark:text-white">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 sticky top-0 dark:bg-slate-700">
                    <tr>
                      <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
                      <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Type</th>
                      <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Reference</th>
                      <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Amount</th>
                      <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Performed By</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200 dark:bg-transparent dark:divide-slate-700">
                    <tr v-for="(act, idx) in supplierActivity" :key="idx">
                      <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ formatDate(act.date) }}</td>
                      <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ act.type }}</td>
                      <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ act.ref || '-' }}</td>
                      <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ act.amount !== undefined ? act.amount : '-' }}</td>
                      <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ act.performedBy || '-' }}</td>
                    </tr>
                  </tbody>
                </table>

                <div v-if="supplierActivity.length === 0" class="text-center py-6">
                  <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 dark:bg-slate-700">
                    <span class="material-icons text-gray-400 dark:text-gray-300">history</span>
                  </div>
                  <h3 class="text-md font-medium text-gray-900 mb-1 dark:text-white">No recent supplier activity available</h3>
                  <p class="text-gray-500 text-sm dark:text-gray-400">There are no invoices or stock notes recorded for this supplier yet.</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto flex-grow">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Supplier Name *</label>
              <input 
                type="text" 
                v-model="currentSupplier.name" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white"
                placeholder="Enter supplier name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Contact Person *</label>
              <input 
                type="text" 
                v-model="currentSupplier.contactPerson" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white"
                placeholder="Enter contact person name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Phone Number *</label>
              <input 
                type="tel" 
                v-model="currentSupplier.phone" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white"
                placeholder="Enter phone number"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Email Address</label>
              <input 
                type="email" 
                v-model="currentSupplier.email" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white"
                placeholder="Enter email address"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Address</label>
              <textarea 
                v-model="currentSupplier.address" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white"
                placeholder="Enter full address"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Status</label>
              <select v-model="currentSupplier.status" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Notes</label>
              <textarea 
                v-model="currentSupplier.notes" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white"
                placeholder="Additional notes about this supplier"
                rows="2"
              ></textarea>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3 sticky bottom-0 z-20 dark:bg-slate-800 dark:border-t dark:border-slate-700">
            <button @click="closeModal" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Close</button>
            <button v-if="!isViewing" @click="saveSupplier" class="px-4 py-2 text-white bg-blue-600 rounded-lg">{{ isEditing ? 'Update' : 'Save' }}</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue' 

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
  
  const searchQuery = ref('')
  const searchRef = ref(null)
  const filterOpen = ref(false)
  const statusFilter = ref('')

  function focusSearch() { if (searchRef.value) searchRef.value.focus() }
  function clearSearch() { searchQuery.value = '' }
  function toggleFilter() { filterOpen.value = !filterOpen.value }
  function closeFilter() { filterOpen.value = false }
  function applyFilter() { filterOpen.value = false }
  function clearFilter() { statusFilter.value = ''; filterOpen.value = false }

  const showSupplierModal = ref(false)
  const isEditing = ref(false)
  const isViewing = ref(false)
  const currentPage = ref(1)
  // show 5 rows per page so pagination appears when list grows beyond 5
  const pageSize = ref(5)
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
  
  // Suppliers loaded from backend
  const suppliers = ref([])
  const supplierActivity = ref([])
  const isLoading = ref(false)
  
  function handleDocumentClick(e) {
    const btn = document.getElementById('supplier-filter-btn')
    const dropdown = document.getElementById('supplier-filter-dropdown')
    if (!filterOpen.value) return
    if (btn && btn.contains(e.target)) return
    if (dropdown && dropdown.contains(e.target)) return
    filterOpen.value = false
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && filterOpen.value) closeFilter()
  }

  onMounted(() => {
    loadSuppliers()
    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleDocumentClick)
    document.removeEventListener('keydown', handleKeydown)
  })
  
  const filteredSuppliersBase = computed(() => {
    let list = suppliers.value
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      list = list.filter(supplier => 
        supplier.name.toLowerCase().includes(query) || 
        supplier.contactPerson.toLowerCase().includes(query) ||
        supplier.email.toLowerCase().includes(query) ||
        supplier.phone.includes(query)
      )
    }

    if (statusFilter.value) {
      list = list.filter(supplier => supplier.status === statusFilter.value)
    }

    return list
  })

  const totalSuppliers = computed(() => filteredSuppliersBase.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalSuppliers.value / pageSize.value)))
  const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

  // Reset to first page when searching
  watch(searchQuery, () => {
    currentPage.value = 1
  })

  // Reset to first page when filter changes
  watch(statusFilter, () => {
    currentPage.value = 1
  })

  // Keep current page within bounds when total changes
  watch(totalSuppliers, () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  })

  const paginatedSuppliers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredSuppliersBase.value.slice(start, start + pageSize.value)
  })

  const displayedFrom = computed(() => totalSuppliers.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1)
  const displayedTo = computed(() => Math.min(currentPage.value * pageSize.value, totalSuppliers.value))

  function changePage(n) {
    if (n < 1 || n > totalPages.value) return
    currentPage.value = n
  }
  
  async function loadSuppliers() {
    isLoading.value = true
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/suppliers?page=1&limit=100`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error('Failed to load suppliers')
      const json = await res.json()
      suppliers.value = (json.data || []).map(s => ({
        id: s._id,
        name: s.name,
        contactPerson: s.contactName || '',
        phone: s.phone || '',
        email: s.email || '',
        address: s.address || '',
        status: s.status || 'Active',
        productCount: s.productCount || 0,
        lastOrder: s.lastOrder || '',
        notes: s.notes || ''
      }))
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error loading suppliers')
    } finally {
      isLoading.value = false
    }
  }
  
  function formatDate(dateString) {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }
  
  function showAddSupplierModal() {
    isEditing.value = false
    isViewing.value = false
    currentSupplier.value = {
      id: '',
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
    supplierActivity.value = []
    showSupplierModal.value = true
  }
  
  function editSupplier(supplier) {
    isEditing.value = true
    currentSupplier.value = { ...supplier }
    showSupplierModal.value = true
  }
  
  function viewSupplier(supplier) {
    isViewing.value = true
    isEditing.value = false
    currentSupplier.value = { ...supplier }
    supplierActivity.value = supplier.activity || []
    showSupplierModal.value = true
  }
  
  function closeModal() {
    showSupplierModal.value = false
    isEditing.value = false
    isViewing.value = false
    supplierActivity.value = []
  }

  async function deleteSupplier(supplier) {
    if (!confirm(`Are you sure you want to delete ${supplier.name}?`)) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/suppliers/${supplier.id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }))
        throw new Error(err.message || 'Failed to delete supplier')
      }
      suppliers.value = suppliers.value.filter(s => s.id !== supplier.id)
      alert('Supplier deleted successfully')
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error deleting supplier')
    }
  }
  
  async function saveSupplier() {
    if (!currentSupplier.value.name || !currentSupplier.value.contactPerson || !currentSupplier.value.phone) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const body = {
        name: currentSupplier.value.name,
        contactName: currentSupplier.value.contactPerson,
        email: currentSupplier.value.email,
        phone: currentSupplier.value.phone,
        address: currentSupplier.value.address,
        notes: currentSupplier.value.notes,
        status: currentSupplier.value.status
      }

      if (isEditing.value && currentSupplier.value.id) {
        const res = await fetch(`${API_BASE}/suppliers/${currentSupplier.value.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(body)
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: res.statusText }))
          throw new Error(err.message || 'Failed to update supplier')
        }
        const updated = await res.json()
        const mapped = {
          id: updated._id,
          name: updated.name,
          contactPerson: updated.contactName || '',
          phone: updated.phone || '',
          email: updated.email || '',
          address: updated.address || '',
          status: updated.status || currentSupplier.value.status || 'Active',
          productCount: updated.productCount || 0,
          lastOrder: updated.lastOrder || '',
          notes: updated.notes || ''
        }
        const index = suppliers.value.findIndex(s => s.id === mapped.id)
        if (index !== -1) suppliers.value[index] = mapped
      } else {
        const res = await fetch(`${API_BASE}/suppliers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(body)
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: res.statusText }))
          throw new Error(err.message || 'Failed to create supplier')
        }
        const created = await res.json()
        suppliers.value.unshift({
          id: created._id,
          name: created.name,
          contactPerson: created.contactName || '',
          phone: created.phone || '',
          email: created.email || '',
          address: created.address || '',
          status: created.status || currentSupplier.value.status || 'Active',
          productCount: 0,
          lastOrder: '',
          notes: created.notes || ''
        })
      }

      showSupplierModal.value = false
      alert(`Supplier ${isEditing.value ? 'updated' : 'added'} successfully`)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error saving supplier')
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 100%;
  }
  </style>
  