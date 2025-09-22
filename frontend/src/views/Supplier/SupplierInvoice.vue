<template>
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Supplier Invoices</h1>
        <button 
          @click="$emit('go-back')" 
          class="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span class="material-icons mr-1">arrow_back</span>
          Back
        </button>
      </div>
  
      <!-- Filters and Actions -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-end">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <select v-model="filters.supplier" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="">All Suppliers</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">{{ supplier.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="filters.status" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input 
                type="date" 
                v-model="filters.fromDate" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input 
                type="date" 
                v-model="filters.toDate" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
              >
            </div>
          </div>
          <div class="flex gap-2">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center" @click="applyFilters">
              <span class="material-icons text-sm mr-1">search</span>
              Apply
            </button>
            <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center" @click="resetFilters">
              <span class="material-icons text-sm mr-1">refresh</span>
              Reset
            </button>
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex justify-between mb-6">
        <div class="flex gap-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center" @click="showCreateInvoiceModal">
            <span class="material-icons text-sm mr-1">add</span>
            New Invoice
          </button>
          <button class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
            <span class="material-icons text-sm mr-1">file_download</span>
            Export
          </button>
          <button class="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center">
            <span class="material-icons text-sm mr-1">print</span>
            Print
          </button>
        </div>
        <div class="flex gap-2">
          <div class="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <span class="material-icons text-gray-400 mr-2">search</span>
            <input
              type="text"
              placeholder="Search invoices..."
              v-model="searchQuery"
              class="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>
      </div>
  
      <!-- Invoices Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice #
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
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
            <tr v-for="invoice in filteredInvoices" :key="invoice.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-blue-600">INV-{{ invoice.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ getSupplierName(invoice.supplierId) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(invoice.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(invoice.dueDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${{ invoice.totalAmount.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', 
                             getStatusClass(invoice.status)]">
                  {{ invoice.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3" @click="viewInvoice(invoice)">
                  <span class="material-icons">visibility</span>
                </button>
                <button class="text-green-600 hover:text-green-900 mr-3" @click="editInvoice(invoice)" v-if="invoice.status === 'pending'">
                  <span class="material-icons">edit</span>
                </button>
                <button class="text-red-600 hover:text-red-900" @click="deleteInvoice(invoice)" v-if="invoice.status === 'pending'">
                  <span class="material-icons">delete</span>
                </button>
                <button class="text-purple-600 hover:text-purple-900" @click="markAsPaid(invoice)" v-if="invoice.status === 'pending'">
                  <span class="material-icons">payments</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="filteredInvoices.length === 0" class="text-center py-12">
          <span class="material-icons text-gray-300 text-6xl">receipt</span>
          <p class="mt-4 text-gray-500">No invoices found</p>
          <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg" @click="showCreateInvoiceModal">
            Create Your First Invoice
          </button>
        </div>
        
        <!-- Summary -->
        <div v-if="filteredInvoices.length > 0" class="bg-gray-50 px-6 py-4 border-t">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="font-medium">Total Invoices:</span> {{ filteredInvoices.length }}
            </div>
            <div>
              <span class="font-medium">Total Amount:</span> ${{ totalAmount.toFixed(2) }}
            </div>
            <div>
              <span class="font-medium">Pending:</span> {{ pendingCount }}
            </div>
            <div>
              <span class="font-medium">Overdue:</span> {{ overdueCount }}
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="filteredInvoices.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredInvoices.length }}</span> of
                <span class="font-medium">{{ filteredInvoices.length }}</span> results
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
  
      <!-- Create/Edit Invoice Modal -->
      <div v-if="showInvoiceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">{{ isEditing ? 'Edit' : 'Create' }} Invoice</h3>
          </div>
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
                <select v-model="currentInvoice.supplierId" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none" required>
                  <option value="">Select Supplier</option>
                  <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">{{ supplier.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Date *</label>
                <input 
                  type="date" 
                  v-model="currentInvoice.date" 
                  class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input 
                  type="date" 
                  v-model="currentInvoice.dueDate" 
                  class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="currentInvoice.status" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
  
            <!-- Invoice Items -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-medium text-gray-700">Invoice Items</h4>
                <button type="button" @click="addInvoiceItem" class="text-blue-600 hover:text-blue-800 flex items-center">
                  <span class="material-icons text-sm mr-1">add</span>
                  Add Item
                </button>
              </div>
              
              <div v-for="(item, index) in currentInvoice.items" :key="index" class="grid grid-cols-12 gap-2 mb-3 items-center">
                <div class="col-span-5">
                  <input 
                    type="text" 
                    v-model="item.description" 
                    placeholder="Item description"
                    class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                  >
                </div>
                <div class="col-span-2">
                  <input 
                    type="number" 
                    v-model="item.quantity" 
                    placeholder="Qty"
                    min="1"
                    class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                    @input="calculateItemTotal(item)"
                  >
                </div>
                <div class="col-span-2">
                  <input 
                    type="number" 
                    v-model="item.unitPrice" 
                    placeholder="Unit Price"
                    min="0"
                    step="0.01"
                    class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                    @input="calculateItemTotal(item)"
                  >
                </div>
                <div class="col-span-2">
                  <input 
                    type="text" 
                    :value="'$' + (item.total || 0).toFixed(2)" 
                    disabled
                    class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                  >
                </div>
                <div class="col-span-1">
                  <button type="button" @click="removeInvoiceItem(index)" class="text-red-600 hover:text-red-800">
                    <span class="material-icons">delete</span>
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Totals -->
            <div class="border-t pt-4">
              <div class="flex justify-end">
                <div class="w-64">
                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-gray-600">Subtotal:</span>
                    <span class="font-medium">${{ currentInvoice.subtotal.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-gray-600">Tax (10%):</span>
                    <span class="font-medium">${{ currentInvoice.tax.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-gray-600">Discount:</span>
                    <span class="font-medium">-${{ currentInvoice.discount.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between border-t pt-2">
                    <span class="text-lg font-bold text-gray-800">Total:</span>
                    <span class="text-lg font-bold text-blue-600">${{ currentInvoice.totalAmount.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea 
                v-model="currentInvoice.notes" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Additional notes for this invoice"
                rows="2"
              ></textarea>
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-3">
            <button @click="showInvoiceModal = false" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg">Cancel</button>
            <button @click="saveInvoice" class="px-4 py-2 text-white bg-blue-600 rounded-lg">{{ isEditing ? 'Update' : 'Create' }} Invoice</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  const searchQuery = ref('')
  const showInvoiceModal = ref(false)
  const isEditing = ref(false)
  const filters = ref({
    supplier: '',
    status: '',
    fromDate: '',
    toDate: ''
  })
  
  const currentInvoice = ref({
    id: '',
    supplierId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    items: [
      { description: '', quantity: 1, unitPrice: 0, total: 0 }
    ],
    subtotal: 0,
    tax: 0,
    discount: 0,
    totalAmount: 0,
    notes: ''
  })
  
  // Sample data - in a real application, this would come from an API
  const suppliers = ref([
    { id: 'SUP001', name: 'Pharma Distributors Inc.' },
    { id: 'SUP002', name: 'MediSupply Co.' },
    { id: 'SUP003', name: 'Global Pharma Ltd.' },
    { id: 'SUP004', name: 'First Aid Supplies Corp.' },
    { id: 'SUP005', name: 'Lab Equipment Specialists' }
  ])
  
  const invoices = ref([
    { id: '1001', supplierId: 'SUP001', date: '2023-10-15', dueDate: '2023-11-15', status: 'pending', totalAmount: 1250.75 },
    { id: '1002', supplierId: 'SUP002', date: '2023-10-10', dueDate: '2023-11-10', status: 'paid', totalAmount: 845.50 },
    { id: '1003', supplierId: 'SUP003', date: '2023-10-05', dueDate: '2023-11-05', status: 'overdue', totalAmount: 2100.25 },
    { id: '1004', supplierId: 'SUP001', date: '2023-10-01', dueDate: '2023-11-01', status: 'paid', totalAmount: 567.80 },
    { id: '1005', supplierId: 'SUP004', date: '2023-09-28', dueDate: '2023-10-28', status: 'cancelled', totalAmount: 890.45 }
  ])
  
  onMounted(() => {
    loadInvoices()
  })
  
  const filteredInvoices = computed(() => {
    let filtered = invoices.value
  
    if (filters.value.supplier) {
      filtered = filtered.filter(inv => inv.supplierId === filters.value.supplier)
    }
  
    if (filters.value.status) {
      filtered = filtered.filter(inv => inv.status === filters.value.status)
    }
  
    if (filters.value.fromDate) {
      filtered = filtered.filter(inv => inv.date >= filters.value.fromDate)
    }
  
    if (filters.value.toDate) {
      filtered = filtered.filter(inv => inv.date <= filters.value.toDate)
    }
  
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(inv => 
        inv.id.toLowerCase().includes(query) || 
        getSupplierName(inv.supplierId).toLowerCase().includes(query)
      )
    }
  
    return filtered
  })
  
  const totalAmount = computed(() => {
    return filteredInvoices.value.reduce((sum, inv) => sum + inv.totalAmount, 0)
  })
  
  const pendingCount = computed(() => {
    return filteredInvoices.value.filter(inv => inv.status === 'pending').length
  })
  
  const overdueCount = computed(() => {
    return filteredInvoices.value.filter(inv => inv.status === 'overdue').length
  })
  
  function loadInvoices() {
    // In a real application, this would fetch data from an API
    console.log('Loading invoices...')
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString()
  }
  
  function getSupplierName(supplierId) {
    const supplier = suppliers.value.find(s => s.id === supplierId)
    return supplier ? supplier.name : 'Unknown Supplier'
  }
  
  function getStatusClass(status) {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  function showCreateInvoiceModal() {
    isEditing.value = false
    currentInvoice.value = {
      id: String(1000 + invoices.value.length + 1),
      supplierId: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      items: [
        { description: '', quantity: 1, unitPrice: 0, total: 0 }
      ],
      subtotal: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0,
      notes: ''
    }
    showInvoiceModal.value = true
  }
  
  function addInvoiceItem() {
    currentInvoice.value.items.push({ description: '', quantity: 1, unitPrice: 0, total: 0 })
  }
  
  function removeInvoiceItem(index) {
    if (currentInvoice.value.items.length > 1) {
      currentInvoice.value.items.splice(index, 1)
      calculateTotals()
    }
  }
  
  function calculateItemTotal(item) {
    item.total = (item.quantity || 0) * (item.unitPrice || 0)
    calculateTotals()
  }
  
  function calculateTotals() {
    currentInvoice.value.subtotal = currentInvoice.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
    currentInvoice.value.tax = currentInvoice.value.subtotal * 0.1 // 10% tax
    currentInvoice.value.totalAmount = currentInvoice.value.subtotal + currentInvoice.value.tax - currentInvoice.value.discount
  }
  
  function editInvoice(invoice) {
    isEditing.value = true
    currentInvoice.value = { ...invoice }
    showInvoiceModal.value = true
  }
  
  function viewInvoice(invoice) {
    alert(`Viewing invoice INV-${invoice.id} for ${getSupplierName(invoice.supplierId)}`)
    // In a real application, this would show a detailed view or PDF
  }
  
  function deleteInvoice(invoice) {
    if (confirm(`Are you sure you want to delete invoice INV-${invoice.id}?`)) {
      invoices.value = invoices.value.filter(inv => inv.id !== invoice.id)
      alert('Invoice deleted successfully')
    }
  }
  
  function markAsPaid(invoice) {
    if (confirm(`Mark invoice INV-${invoice.id} as paid?`)) {
      invoice.status = 'paid'
      alert('Invoice marked as paid')
    }
  }
  
  function applyFilters() {
    // Filters are applied automatically through computed property
    console.log('Filters applied')
  }
  
  function resetFilters() {
    filters.value = {
      supplier: '',
      status: '',
      fromDate: '',
      toDate: ''
    }
    searchQuery.value = ''
  }
  
  function saveInvoice() {
    if (!currentInvoice.value.supplierId) {
      alert('Please select a supplier')
      return
    }
  
    if (!currentInvoice.value.date || !currentInvoice.value.dueDate) {
      alert('Please fill in all required fields')
      return
    }
  
    if (isEditing.value) {
      // Update existing invoice
      const index = invoices.value.findIndex(inv => inv.id === currentInvoice.value.id)
      if (index !== -1) {
        invoices.value[index] = { ...currentInvoice.value }
      }
    } else {
      // Add new invoice
      invoices.value.push({ ...currentInvoice.value })
    }
  
    showInvoiceModal.value = false
    alert(`Invoice ${isEditing.value ? 'updated' : 'created'} successfully`)
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 100%;
  }
  </style>