<template>
    <div class="container mx-auto p-6 dark:bg-slate-900 dark:text-white">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-blue-900 dark:text-blue-300">Supplier Management</h1>
          <p class="text-gray-600 mt-1 dark:text-gray-300">Manage your suppliers and invoices in one place</p>
        </div>
      
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Suppliers</p>
              <p class="text-2xl font-bold text-gray-900 mt-1 dark:text-white">{{ suppliers.length }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <span class="material-icons text-blue-600">business</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Invoices</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ pendingCount }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <span class="material-icons text-green-600">receipt</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500 dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Overdue</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ overdueCount }}</p>
            </div>
            <div class="bg-red-100 p-3 rounded-full">
              <span class="material-icons text-red-600">warning</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500 dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Amount</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">Rs.{{ totalAmount.toFixed(2) }}</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <span class="material-icons text-purple-600">payments</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Main Content Tabs -->
      <div class="bg-white rounded-lg shadow mb-6 dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
        <div class="border-b">
          <nav class="flex -mb-px">
            <button 
              @click="activeTab = 'invoices'"
              :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors', 
                      activeTab === 'invoices' 
                        ? 'border-blue-500 text-blue-600 dark:border-blue-300 dark:text-blue-300' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-slate-600']"
            >
              <span class="material-icons align-middle mr-2 text-base">receipt</span>
              Supplier Invoices
            </button>
            <button 
              @click="activeTab = 'suppliers'"
              :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors', 
                      activeTab === 'suppliers' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            >
              <span class="material-icons align-middle mr-2 text-base">business</span>
              Supplier Directory
            </button>
            <button 
              @click="activeTab = 'analytics'"
              :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors', 
                      activeTab === 'analytics' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            >
              <span class="material-icons align-middle mr-2 text-base">analytics</span>
              Analytics
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Invoices Tab -->
          <div v-if="activeTab === 'invoices'">
            <!-- Filters and Actions -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6 dark:bg-slate-800 dark:text-gray-300">
              <div class="flex flex-col md:flex-row gap-4 items-end">
                <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <select v-model="filters.supplier" class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <option value="">All Suppliers</option>
                      <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">{{ supplier.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select v-model="filters.status" class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
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
                      class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input 
                      type="date" 
                      v-model="filters.toDate" 
                      class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    >
                  </div>
                </div>
                <div class="flex gap-2">
                  <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors" @click="applyFilters">
                    <span class="material-icons text-sm mr-1">search</span>
                    Search
                  </button>
                  <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600" @click="resetFilters">
                    <span class="material-icons text-sm mr-1">refresh</span>
                    Reset
                  </button>
                </div>
              </div>
            </div>
      
            <!-- Action Buttons -->
            <div class="flex justify-between mb-6">
              <div class="flex gap-2">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors" @click="showCreateInvoiceModal">
                  <span class="material-icons text-sm mr-1">add</span>
                  New Invoice
                </button>
               
               
               
              </div>
              <div class="flex gap-2">
                  <div class="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                  <span class="material-icons text-gray-400 mr-2">search</span>
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    v-model="searchQuery"
                    class="bg-transparent outline-none w-full text-sm text-gray-700"
                  />
                </div>
              </div>
            </div>
      
            <!-- Invoices Table -->
            <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 dark:bg-slate-700">
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
                <tbody class="bg-white divide-y divide-gray-200 dark:bg-transparent dark:divide-slate-700">
                  <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50 transition-colors dark:hover:bg-slate-700">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-blue-600 dark:text-blue-300">INV-{{ invoice.id }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ getSupplierName(invoice.supplierId) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {{ formatDate(invoice.date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {{ formatDate(invoice.dueDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Rs.{{ ((invoice.balance !== undefined ? invoice.balance : invoice.totalAmount) || 0).toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', 
                                  getStatusClass(invoice.status)]">
                        {{ invoice.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex items-center space-x-2">
                        <button class="text-gray-700 hover:text-gray-900 transition-colors dark:text-gray-200 dark:hover:text-white" @click="openInvoiceDetails(invoice)" title="View Invoice">
                          <span class="material-icons text-base">visibility</span>
                        </button>

                        <button class="text-green-600 hover:text-green-900 transition-colors dark:text-green-300 dark:hover:text-green-100" @click="editInvoice(invoice)" title="Edit Invoice">
                          <span class="material-icons text-base">edit</span>
                        </button>

                        <button class="text-red-600 hover:text-red-900 transition-colors dark:text-red-300 dark:hover:text-red-100" @click="deleteInvoice(invoice)" title="Delete Invoice">
                          <span class="material-icons text-base">delete</span>
                        </button>

                        <button
                          class="text-purple-600 hover:text-purple-900 transition-colors dark:text-purple-300 dark:hover:text-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          @click="openPaymentModal(invoice)"
                          :disabled="((invoice.balance !== undefined ? invoice.balance : invoice.totalAmount) <= 0)"
                          title="Record Payment"
                        >
                          <span class="material-icons text-base">payments</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Empty State -->
              <div v-if="filteredInvoices.length === 0" class="text-center py-12">
                <span class="material-icons text-gray-300 text-6xl dark:text-gray-500">receipt</span>
                <p class="mt-4 text-gray-500 dark:text-gray-400">No invoices found</p>
                <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors" @click="showCreateInvoiceModal">
                  Create Your First Invoice
                </button>
              </div>
              
              <!-- Summary -->
              <div v-if="filteredInvoices.length > 0" class="bg-gray-50 px-6 py-4 border-t dark:bg-slate-800 dark:text-gray-300">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="font-medium">Total Invoices:</span> {{ filteredInvoices.length }}
                  </div>
                  <div>
                    <span class="font-medium">Total Amount:</span> Rs.{{ totalAmount.toFixed(2) }}
                  </div>
                  <div>
                    <span class="font-medium">Pending:</span> {{ pendingCount }}
                  </div>
                  <div>
                    <span class="font-medium">Overdue:</span> {{ overdueCount }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Suppliers Tab -->
          <div v-if="activeTab === 'suppliers'">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Supplier Directory</h3>
             
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="supplier in suppliers" :key="supplier.id" class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                <div class="flex items-start justify-between mb-4">
                  <div class="bg-blue-100 p-3 rounded-lg">
                    <span class="material-icons text-blue-600">business</span>
                  </div>
                  <!-- edit/delete removed per request -->
                </div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2 dark:text-white">{{ supplier.name }}</h4>
                <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div class="flex items-center">
                    <span class="material-icons text-gray-400 text-base mr-2">person</span>
                    <span>{{ supplier.contactPerson || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="material-icons text-gray-400 text-base mr-2">email</span>
                    <span>{{ supplier.email || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="material-icons text-gray-400 text-base mr-2">phone</span>
                    <span>{{ supplier.phone || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="material-icons text-gray-400 text-base mr-2">location_on</span>
                    <span>{{ (supplier.city || supplier.address) ? (supplier.city || supplier.address) : 'N/A' }}{{ supplier.country ? ', ' + supplier.country : '' }}</span>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Total Invoices:</span>
                    <span class="font-medium text-gray-900">{{ getSupplierInvoiceCount(supplier.id) }}</span>
                  </div>
                  <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Total Pending:</span>
                    <span class="font-medium text-red-600">Rs.{{ getSupplierPendingAmount(supplier.id).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Tab -->
          <div v-if="activeTab === 'analytics'">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Invoice Status Chart -->
              <div class="bg-white p-6 rounded-lg shadow border border-gray-200 dark:bg-slate-800 dark:text-white dark:border-slate-700">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Invoice Status Distribution</h3>
                <div class="space-y-3">
                  <div v-for="status in invoiceStatusStats" :key="status.name" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full mr-3" :class="status.color"></div>
                      <span class="text-sm text-gray-600">{{ status.name }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium text-gray-900">{{ status.count }}</span>
                      <span class="text-xs text-gray-500">({{ status.percentage }}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Top Suppliers -->
              <div class="bg-white p-6 rounded-lg shadow border border-gray-200 dark:bg-slate-800 dark:text-white dark:border-slate-700">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Top Suppliers by Invoice Volume</h3>
                <div class="space-y-4">
                  <div v-for="supplier in topSuppliers" :key="supplier.id" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="bg-blue-100 p-2 rounded-lg mr-3 dark:bg-slate-700">
                        <span class="material-icons text-blue-600 text-sm dark:text-blue-300">business</span>
                      </div>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ supplier.name }}</span>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ supplier.invoiceCount }} invoices</div>
                      <div class="text-xs text-gray-500 dark:text-gray-300">Rs.{{ supplier.totalAmount.toFixed(2) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Monthly Summary -->
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 mt-6 dark:bg-slate-800 dark:text-white dark:border-slate-700">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Monthly Invoice Summary</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center p-4 bg-blue-50 rounded-lg dark:bg-slate-800 dark:text-white">
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-300">{{ currentMonthInvoices }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">This Month</div>
                </div>
                <div class="text-center p-4 bg-green-50 rounded-lg dark:bg-slate-800 dark:text-white">
                  <div class="text-2xl font-bold text-green-600 dark:text-green-300">Rs.{{ currentMonthAmount.toFixed(2) }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">Month Amount</div>
                </div>
                <div class="text-center p-4 bg-orange-50 rounded-lg dark:bg-slate-800 dark:text-white">
                  <div class="text-2xl font-bold text-orange-600 dark:text-orange-300">{{ lastMonthInvoices }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">Last Month</div>
                </div>
                <div class="text-center p-4 bg-purple-50 rounded-lg dark:bg-slate-800 dark:text-white">
                  <div class="text-2xl font-bold text-purple-600 dark:text-purple-300">Rs.{{ lastMonthAmount.toFixed(2) }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">Last Month Amount</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Invoice Modal -->
      <div v-if="showInvoiceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ isEditing ? 'Edit' : 'Create' }} Invoice</h3>
          </div>
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Supplier *</label>
                <select v-model="currentInvoice.supplierId" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600" required>
                  <option value="">Select Supplier</option>
                  <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">{{ supplier.name }}</option>
                </select>
                <div v-if="supplierDetails" class="mt-2 p-3 bg-white border rounded text-sm text-gray-700 dark:bg-slate-900 dark:text-gray-200 dark:border dark:border-slate-700">
                  <div class="font-semibold mb-1">Supplier Details</div>
                  <div class="text-xs">Name: {{ supplierDetails.name }}</div>
                  <div class="text-xs">Contact: {{ supplierDetails.contactPerson || '-' }}</div>
                  <div class="text-xs">Email: {{ supplierDetails.email || '-' }}</div>
                  <div class="text-xs">Phone: {{ supplierDetails.phone || '-' }}</div>
                  <div class="text-xs">Address: {{ supplierDetails.address || '-' }}</div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Invoice Date *</label>
                <input 
                  type="date" 
                  v-model="currentInvoice.date" 
                  class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Due Date *</label>
                <input 
                  type="date" 
                  v-model="currentInvoice.dueDate" 
                  class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Status</label>
                <select v-model="currentInvoice.status" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <!-- Invoice Items -->
            <div class="mb-6 text-gray-900 dark:text-gray-100">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-medium text-gray-700 dark:text-gray-300">Invoice Items</h4>
                <button type="button" @click="addInvoiceItem" class="text-blue-600 hover:text-blue-800 dark:text-blue-300 flex items-center">
                  <span class="material-icons text-sm mr-1">add</span>
                  Add Item
                </button>
              </div>
              
              <div v-for="(item, index) in currentInvoice.items" :key="index" class="grid grid-cols-12 gap-2 mb-3 items-center">
                <div class="col-span-5">
                  <input 
                    type="text" 
                    v-model="item.description" 
                    :name="`item-name-${index}`"
                    placeholder="Name"
                    aria-label="Item name"
                    class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white"
                  >
                </div>
                <div class="col-span-2">
                  <input 
                    type="number" 
                    v-model.number="item.quantity" 
                    placeholder="Qty"
                    min="1"
                    class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    @input="calculateItemTotal(item)"
                  >
                </div>
                <div class="col-span-2">
                  <input 
                    type="number" 
                    v-model.number="item.unitPrice" 
                    placeholder="Unit Price"
                    min="0"
                    step="0.01"
                    class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    @input="calculateItemTotal(item)"
                  >
                </div>
                <div class="col-span-2">
                  <input 
                    type="text" 
                    :value="'Rs.' + (item.total || 0).toFixed(2)" 
                    disabled
                    class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600"
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
                    <span class="text-sm text-gray-600 dark:text-gray-300">Subtotal:</span>
                    <span class="font-medium dark:text-white">Rs.{{ currentInvoice.subtotal.toFixed(2) }}</span>
                  </div>


                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-gray-600 dark:text-gray-300">Discount</span>
                    <div class="flex items-center space-x-2">
                      <select v-model="discountMode" class="w-28 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600">
                        <option value="percent">Percent</option>
                        <option value="amount">Amount</option>
                      </select>
                      <input
                        type="number"
                        :min="discountMode === 'percent' ? 0 : 0"
                        :max="discountMode === 'percent' ? 100 : null"
                        step="0.01"
                        v-model.number="discountInput"
                        @change="() => {}"
                        class="w-36 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600"
                      />
                      <span class="font-medium dark:text-white">- Rs.{{ currentInvoice.discount.toFixed(2) }}</span>
                    </div>
                  </div>

                  <div class="flex justify-between border-t pt-2">
                    <span class="text-lg font-bold text-gray-800 dark:text-white">Total:</span>
                    <span class="text-lg font-bold text-blue-600 dark:text-blue-300">Rs.{{ currentInvoice.totalAmount.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Notes</label>
              <textarea 
                v-model="currentInvoice.notes" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white"
                placeholder="Additional notes for this invoice"
                rows="2"
              ></textarea>
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-3 dark:bg-slate-800 dark:border-t dark:border-slate-700">
            <button @click="showInvoiceModal = false" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg dark:bg-slate-700 dark:text-white">Cancel</button>
            <button @click="saveInvoice" class="px-4 py-2 text-white bg-blue-600 rounded-lg dark:bg-blue-600">{{ isEditing ? 'Update' : 'Create' }} Invoice</button>
          </div>
        </div>
      </div>

      <!-- Add Supplier Modal -->
      <div v-if="showSupplierModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Add New Supplier</h3>
          </div>
          <div class="px-6 py-4">
            <form @submit.prevent="saveSupplier" class="space-y-6">
              <!-- Basic Information -->
              <div>
                <h4 class="text-md font-medium text-gray-700 mb-4 dark:text-gray-300">Basic Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Company Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newSupplier.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-slate-700 dark:text-white dark:border-slate-600"
                      placeholder="Enter company name"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newSupplier.contactPerson"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter contact person name"
                    >
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div>
                <h4 class="text-md font-medium text-gray-700 mb-4">Contact Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newSupplier.email"
                      type="email"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="supplier@company.com"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newSupplier.phone"
                      type="tel"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    >
                  </div>
                </div>
              </div>

              <!-- Address Information -->
              <div>
                <h4 class="text-md font-medium text-gray-700 mb-4">Address Information</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      v-model="newSupplier.address"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter street address"
                    >
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        v-model="newSupplier.city"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="City"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        v-model="newSupplier.state"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="State"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        v-model="newSupplier.zipCode"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="ZIP Code"
                      >
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      v-model="newSupplier.country"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Country"
                    >
                  </div>
                </div>
              </div>

              <!-- Additional Information -->
              <div>
                <h4 class="text-md font-medium text-gray-700 mb-4">Additional Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Tax ID / VAT Number
                    </label>
                    <input
                      v-model="newSupplier.taxId"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter tax identification number"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Payment Terms (Days)
                    </label>
                    <select
                      v-model="newSupplier.paymentTerms"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="7">7 Days</option>
                      <option value="15">15 Days</option>
                      <option value="30" selected>30 Days</option>
                      <option value="45">45 Days</option>
                      <option value="60">60 Days</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  v-model="newSupplier.notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Additional notes about this supplier..."
                ></textarea>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  @click="closeSupplierModal"
                  class="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <span class="material-icons text-sm mr-2">save</span>
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Invoice Details Modal -->
      <div v-if="showInvoiceDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Invoice Details</h3>
          </div>
          <div class="px-6 py-4">
            <div v-if="loadingInvoiceDetails" class="text-center py-12">
              <span class="material-icons animate-spin text-gray-400 text-4xl">hourglass_empty</span>
              <p class="mt-4 text-gray-500">Loading...</p>
            </div>
            <div v-else-if="invoiceDetails">
              <div class="mb-4">
                <div class="text-sm text-gray-600">Invoice ID: <span class="font-medium">{{ invoiceDetails._id || invoiceDetails.id }}</span></div>
                <div class="text-sm text-gray-600">Supplier: <span class="font-medium">{{ invoiceDetails.supplierName || getSupplierName(invoiceDetails.supplierId) }}</span></div>
                <div class="text-sm text-gray-600">Date: <span class="font-medium">{{ formatDate(invoiceDetails.date) }}</span></div>
                <div class="text-sm text-gray-600">Due Date: <span class="font-medium">{{ formatDate(invoiceDetails.dueDate) }}</span></div>
                <div class="text-sm text-gray-600">Status: <span class="font-medium">{{ invoiceDetails.status }}</span></div>
              </div>

              <div class="mb-4">
                <h4 class="font-medium mb-2">Items</h4>
                <div class="space-y-2">
                  <div v-for="(it, idx) in invoiceDetails.items || []" :key="idx" class="flex items-center justify-between border rounded p-3">
                    <div class="text-sm">
                      <div class="font-medium">{{ it.description }}</div>
                      <div class="text-xs text-gray-500">Qty: {{ it.quantity }}, Unit: Rs.{{ (it.unitPrice || 0).toFixed(2) }}</div>
                    </div>
                    <div class="text-sm font-medium">Rs.{{ ((it.total || (it.quantity*(it.unitPrice||0)))||0).toFixed(2) }}</div>
                  </div>
                </div>
              </div>

              <!-- Transactions / Payments -->
              <div class="mb-4">
                <h4 class="font-medium mb-2">Transactions</h4>
                <div v-if="(invoiceDetails.payments || []).length > 0" class="space-y-2">
                  <div v-for="(p, idx) in invoiceDetails.payments" :key="idx" class="flex items-center justify-between border rounded p-3 bg-gray-50 dark:bg-slate-900">
                    <div class="text-sm">
                      <div class="font-medium text-gray-800 dark:text-gray-200">Rs.{{ Number(p.amount || 0).toFixed(2) }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Date: {{ formatDate(p.date) }} • Method: {{ p.method || '-' }} • Ref: {{ p.reference || '-' }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400" v-if="p.notes">Notes: {{ p.notes }}</div>
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">#{{ idx + 1 }}</div>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500 dark:text-gray-400">No transactions recorded.</div>
              </div>

              <div class="border-t pt-4 text-right">
                <div class="text-sm text-gray-600">Subtotal: <span class="font-medium">Rs.{{ (invoiceDetails.subtotal || 0).toFixed(2) }}</span></div>
                <div class="text-sm text-gray-600">Discount: <span class="font-medium">Rs.{{ (invoiceDetails.discount || 0).toFixed(2) }}</span></div>
                <div class="text-sm text-gray-600">Paid: <span class="font-medium">Rs.{{ getPaidAmount(invoiceDetails).toFixed(2) }}</span></div>
                <div class="text-sm text-gray-600">Balance: <span class="font-medium">Rs.{{ getBalance(invoiceDetails).toFixed(2) }}</span></div>
                <div class="text-lg font-bold mt-2">Total: <span class="text-blue-600">Rs.{{ (invoiceDetails.totalAmount || 0).toFixed(2) }}</span></div>
              </div>
            </div>

            <div v-else class="text-center py-12 text-gray-500">No details available</div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-3 dark:bg-slate-800 dark:border-t dark:border-slate-700">
            <button @click="closeInvoiceDetails" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg dark:bg-slate-700 dark:text-white">Close</button>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <div v-if="showPaymentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Record Payment</h3>
          </div>
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" v-model.number="paymentForm.amount" min="0" step="0.01" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" v-model="paymentForm.date" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select v-model="paymentForm.method" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                <input type="text" v-model="paymentForm.reference" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea v-model="paymentForm.notes" rows="3" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none dark:bg-slate-700 dark:text-white"></textarea>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-3 dark:bg-slate-800 dark:border-t dark:border-slate-700">
            <button @click="closePaymentModal" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg dark:bg-slate-700 dark:text-white">Cancel</button>
            <button @click="payInvoice" class="px-4 py-2 text-white bg-blue-600 rounded-lg">Pay</button>
          </div>
        </div>
      </div>

    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
  const token = localStorage.getItem('token')
  
  const searchQuery = ref('')
  const showInvoiceModal = ref(false)
  const showSupplierModal = ref(false)
  const showInvoiceDetailsModal = ref(false)
  const loadingInvoiceDetails = ref(false)
  const invoiceDetails = ref(null)
  // Payment modal state
  const showPaymentModal = ref(false)
  const paymentForm = ref({ amount: 0, date: new Date().toISOString().split('T')[0], method: 'cash', reference: '', notes: '' })
  const invoiceToPrint = ref(null)
  const isEditing = ref(false)
  const activeTab = ref('invoices')
  const lastEditedDiscount = ref('percent')
  const discountMode = ref('percent')
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
    discount: 0,
    discountPercent: 0,
    totalAmount: 0,
    notes: ''
  })

  // single input abstraction: either percent or amount depending on `discountMode`
  const discountInput = computed({
    get() {
      return discountMode.value === 'percent' ? (currentInvoice.value.discountPercent || 0) : (currentInvoice.value.discount || 0)
    },
    set(v) {
      const val = Number(v || 0)
      if (discountMode.value === 'percent') {
        lastEditedDiscount.value = 'percent'
        currentInvoice.value.discountPercent = val
        currentInvoice.value.discount = +(currentInvoice.value.subtotal * (val / 100))
      } else {
        lastEditedDiscount.value = 'amount'
        currentInvoice.value.discount = val
        currentInvoice.value.discountPercent = currentInvoice.value.subtotal ? +(val / currentInvoice.value.subtotal * 100) : 0
      }
      calculateTotals()
    }
  })

  // New supplier form data
  const newSupplier = ref({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    taxId: '',
    paymentTerms: '30',
    notes: ''
  })
  
  // Sample fallback; will try to replace by fetching from backend
  const suppliers = ref([
    { 
      id: 'SUP001', 
      name: 'Pharma Distributors Inc.', 
      contactPerson: 'John Smith',
      email: 'john@pharmadist.com',
      phone: '+1 (555) 123-4567',
      address: '123 Medical Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    { 
      id: 'SUP002', 
      name: 'MediSupply Co.', 
      contactPerson: 'Sarah Johnson',
      email: 'sarah@medisupply.com',
      phone: '+1 (555) 987-6543',
      address: '456 Health St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    { 
      id: 'SUP003', 
      name: 'Global Pharma Ltd.', 
      contactPerson: 'Mike Wilson',
      email: 'mike@globalpharma.com',
      phone: '+1 (555) 456-7890',
      address: '789 Pharma Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60007',
      country: 'USA'
    }
  ])

  // Try to load suppliers from backend (overrides sample data if successful)
  async function fetchSuppliers() {
    try {
      const res = await axios.get(`${API_BASE}/suppliers`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.data && Array.isArray(res.data.data)) {
        // map backend suppliers to expected shape (use _id as id)
        suppliers.value = res.data.data.map(s => {
          const addressRaw = s.address || s.fullAddress || (s.location && typeof s.location === 'string' ? s.location : '') || ''
          let parsedCity = s.city || ''
          let parsedCountry = s.country || ''
          if (typeof addressRaw === 'string' && addressRaw.includes(',')) {
            const parts = addressRaw.split(',').map(p => p.trim()).filter(Boolean)
            if (parts.length >= 2) {
              parsedCountry = parsedCountry || parts[parts.length - 1]
              parsedCity = parsedCity || parts[parts.length - 2]
            } else if (parts.length === 1) {
              parsedCity = parsedCity || parts[0]
            }
          } else if (addressRaw && typeof addressRaw === 'object') {
            parsedCity = parsedCity || addressRaw.city || ''
            parsedCountry = parsedCountry || addressRaw.country || ''
          }

          return {
            id: s._id || s.id,
            name: s.name,
            contactPerson: s.contactName || s.contactPerson || '',
            email: s.email || '',
            phone: s.phone || '',
            address: addressRaw || '',
            city: parsedCity,
            state: s.state || '',
            zipCode: s.zipCode || s.postalCode || '',
            country: parsedCountry
          }
        })
      } else {
        // backend returned no suppliers or unexpected payload -> use empty list (no sample data)
        suppliers.value = []
      }
    } catch (err) {
      console.warn('Could not fetch suppliers, using sample data', err)
    }
  }
  
  const invoices = ref([
    
  ])
  
  onMounted(() => {
    loadInvoices()
    fetchSuppliers()
  })

  // computed supplier details for the selected supplier in invoice modal
  const supplierDetails = computed(() => {
    const id = currentInvoice.value.supplierId
    if (!id) return null
    const s = suppliers.value.find(x => x.id === id)
    if (!s) return null
    return {
      name: s.name,
      contactPerson: s.contactPerson || '',
      email: s.email || '',
      phone: s.phone || '',
      address: [s.address, s.city, s.state, s.zipCode, s.country].filter(Boolean).join(', ')
    }
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
    return invoices.value.filter(inv => inv.status === 'pending').length
  })
  
  const overdueCount = computed(() => {
    return invoices.value.filter(inv => inv.status === 'overdue').length
  })

  // Analytics computed properties
  const invoiceStatusStats = computed(() => {
    const statuses = ['pending', 'paid', 'overdue', 'cancelled']
    const total = invoices.value.length
    return statuses.map(status => {
      const count = invoices.value.filter(inv => inv.status === status).length
      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0
      return {
        name: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        percentage,
        color: getStatusColor(status)
      }
    })
  })

  const topSuppliers = computed(() => {
    const supplierStats = suppliers.value.map(supplier => {
      const supplierInvoices = invoices.value.filter(inv => inv.supplierId === supplier.id)
      return {
        id: supplier.id,
        name: supplier.name,
        invoiceCount: supplierInvoices.length,
        totalAmount: supplierInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
      }
    })
    return supplierStats.sort((a, b) => b.invoiceCount - a.invoiceCount).slice(0, 5)
  })

  const currentMonthInvoices = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return invoices.value.filter(inv => {
      const invDate = new Date(inv.date)
      return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear
    }).length
  })

  const currentMonthAmount = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return invoices.value
      .filter(inv => {
        const invDate = new Date(inv.date)
        return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear
      })
      .reduce((sum, inv) => sum + inv.totalAmount, 0)
  })

  const lastMonthInvoices = computed(() => {
    const lastMonth = new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1
    const year = new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear()
    return invoices.value.filter(inv => {
      const invDate = new Date(inv.date)
      return invDate.getMonth() === lastMonth && invDate.getFullYear() === year
    }).length
  })

  const lastMonthAmount = computed(() => {
    const lastMonth = new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1
    const year = new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear()
    return invoices.value
      .filter(inv => {
        const invDate = new Date(inv.date)
        return invDate.getMonth() === lastMonth && invDate.getFullYear() === year
      })
      .reduce((sum, inv) => sum + inv.totalAmount, 0)
  })

  function getStatusColor(status) {
    switch (status) {
      case 'paid': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'overdue': return 'bg-red-500'
      case 'cancelled': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  function getSupplierInvoiceCount(supplierId) {
    return invoices.value.filter(inv => inv.supplierId === supplierId).length
  }
  
  function persistInvoices() {
    try {
      localStorage.setItem('invoices', JSON.stringify(invoices.value || []))
    } catch (err) {
      console.error('Failed to persist invoices', err)
    }
  }

  async function loadInvoices() {
    // Prefer server-backed invoices when a token is available
    invoices.value = []
    if (token) {
      try {
        const res = await axios.get(`${API_BASE}/invoices`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.data && Array.isArray(res.data.data)) {
          invoices.value = res.data.data.map(i => {
            const inv = {
              ...i,
              id: i._id || i.id,
              subtotal: Number(i.subtotal || 0),
              discount: Number(i.discount || 0),
              discountPercent: Number(i.discountPercent || 0),
              totalAmount: Number(i.totalAmount || 0),
              payments: Array.isArray(i.payments) ? i.payments : (i.payments || [])
            }
            const paidSum = (inv.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0)
            inv.balance = Math.max(0, (inv.totalAmount || 0) - paidSum)
            inv.status = inv.balance <= 0 ? 'paid' : (inv.status || 'pending')
            return inv
          })
          console.log('Loaded', invoices.value.length, 'invoices from API')
          return
        }
      } catch (err) {
        console.warn('Could not load invoices from API, falling back to localStorage', err)
      }
    }

    // Load persisted invoices from localStorage so data survives page refresh
    try {
      const raw = localStorage.getItem('invoices')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
        invoices.value = parsed.map(i => {
          const inv = {
            ...i,
            subtotal: Number(i.subtotal || 0),
            discount: Number(i.discount || 0),
            discountPercent: Number(i.discountPercent || 0),
            totalAmount: Number(i.totalAmount || 0),
            payments: Array.isArray(i.payments) ? i.payments : (i.payments || [])
          }
          const paidSum = (inv.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0)
          inv.balance = Math.max(0, (inv.totalAmount || 0) - paidSum)
          inv.status = inv.balance <= 0 ? 'paid' : (inv.status || 'pending')
          return inv
        })
          console.log('Loaded', invoices.value.length, 'invoices from localStorage')
          return
        }
      }
    } catch (err) {
      console.warn('Could not load invoices from localStorage', err)
    }

    invoices.value = []
    console.log('No persisted invoices found; starting with empty list')
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  function getSupplierName(supplierId) {
    const supplier = suppliers.value.find(s => s.id === supplierId)
    return supplier ? supplier.name : 'Unknown Supplier'
  }
  
  function getStatusClass(status) {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300'
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
      discount: 0,
      discountPercent: 0,
      totalAmount: 0,
      notes: ''
    }
    lastEditedDiscount.value = 'percent'
    showInvoiceModal.value = true
  }

  // Show add supplier modal
  function showAddSupplierModal() {
    resetSupplierForm()
    showSupplierModal.value = true
  }

  // Close supplier modal
  function closeSupplierModal() {
    showSupplierModal.value = false
    resetSupplierForm()
  }

  // Reset supplier form
  function resetSupplierForm() {
    newSupplier.value = {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      taxId: '',
      paymentTerms: '30',
      notes: ''
    }
  }

  // Save new supplier
  function saveSupplier() {
    if (!newSupplier.value.name || !newSupplier.value.contactPerson || !newSupplier.value.email || !newSupplier.value.phone) {
      alert('Please fill in all required fields')
      return
    }

    // Generate new supplier ID
    const newSupplierId = `SUP${String(suppliers.value.length + 1).padStart(3, '0')}`
    
    // Add new supplier to the list
    suppliers.value.push({
      id: newSupplierId,
      ...newSupplier.value
    })

    // Show success message
    alert('Supplier added successfully!')
    
    // Close modal and reset form
    closeSupplierModal()
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
    // No tax field — tax removed entirely
    // compute discount based on last edited field
    if (lastEditedDiscount.value === 'percent') {
      const pct = Number(currentInvoice.value.discountPercent || 0)
      currentInvoice.value.discount = +(currentInvoice.value.subtotal * (pct / 100))
    } else {
      // amount was edited last -> update percent (avoid division by zero)
      currentInvoice.value.discountPercent = currentInvoice.value.subtotal ? +(currentInvoice.value.discount / currentInvoice.value.subtotal * 100) : 0
    }
    // total is subtotal minus discount (tax removed)
    currentInvoice.value.totalAmount = currentInvoice.value.subtotal - currentInvoice.value.discount
  }

  function onDiscountPercentInput() {
    lastEditedDiscount.value = 'percent'
    // ensure discount amount follows percent
    const pct = Number(currentInvoice.value.discountPercent || 0)
    currentInvoice.value.discount = +(currentInvoice.value.subtotal * (pct / 100))
    calculateTotals()
  }

  function onDiscountAmountInput() {
    lastEditedDiscount.value = 'amount'
    // update percent based on entered amount
    const amt = Number(currentInvoice.value.discount || 0)
    currentInvoice.value.discountPercent = currentInvoice.value.subtotal ? +(amt / currentInvoice.value.subtotal * 100) : 0
    calculateTotals()
  }
  
  function editInvoice(invoice) {
    isEditing.value = true
    currentInvoice.value = { ...invoice }
    if (typeof currentInvoice.value.discountPercent === 'undefined') currentInvoice.value.discountPercent = 0
    if (typeof currentInvoice.value.discount === 'undefined') currentInvoice.value.discount = 0
    // prefer percent if it was provided, otherwise treat amount as last-edited
    lastEditedDiscount.value = (currentInvoice.value.discountPercent && Number(currentInvoice.value.discountPercent) > 0) ? 'percent' : 'amount'
    discountMode.value = lastEditedDiscount.value
    calculateTotals()
    showInvoiceModal.value = true
  }
  
  function viewInvoice(invoice) {
    openInvoiceDetails(invoice)
  }

  async function deleteInvoice(invoice) {
    if (!confirm(`Are you sure you want to delete invoice INV-${invoice.id}?`)) return

    if (token && (invoice._id || (invoice.id && invoice.id.match(/^[0-9a-fA-F]{24}$/)))) {
      const id = invoice._id || invoice.id
      try {
        await axios.delete(`${API_BASE}/invoices/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        invoices.value = invoices.value.filter(inv => inv._id !== id && inv.id !== id)
      } catch (err) {
        console.warn('Failed to delete invoice on server, removing locally', err)
        invoices.value = invoices.value.filter(inv => inv.id !== invoice.id)
      }
    } else {
      invoices.value = invoices.value.filter(inv => inv.id !== invoice.id)
    }

    persistInvoices()
    alert('Invoice deleted successfully')
  }
  
  function openInvoiceDetails(invoice) {
    const id = invoice._id || invoice.id
    if (!id) {
      alert('Invoice ID not found')
      return
    }
    loadingInvoiceDetails.value = true
    invoiceDetails.value = null
    showInvoiceDetailsModal.value = true
    axios.get(`${API_BASE}/invoices/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const d = res.data && res.data.data ? res.data.data : res.data
        d.payments = Array.isArray(d.payments) ? d.payments : (d.payments || [])
        const paidSum = (d.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0)
        d.balance = Math.max(0, (Number(d.totalAmount || 0) - paidSum))
        d.status = d.balance <= 0 ? 'paid' : (d.status || 'pending')
        invoiceDetails.value = d
      })
      .catch(err => {
        console.error('Failed to load invoice details', err)
        alert(err?.response?.data?.message || 'Failed to load invoice details')
        showInvoiceDetailsModal.value = false
      })
      .finally(() => {
        loadingInvoiceDetails.value = false
      })
  }

  function closeInvoiceDetails() {
    showInvoiceDetailsModal.value = false
    invoiceDetails.value = null
    loadingInvoiceDetails.value = false
  }

  function openPaymentModal(invoice) {
    // prefill payment form
    const available = (typeof invoice.balance !== 'undefined') ? invoice.balance : (invoice.totalAmount || 0)
    paymentForm.value = {
      amount: available,
      date: new Date().toISOString().split('T')[0],
      method: 'cash',
      reference: '',
      notes: ''
    }
    paymentForm.value._invoiceId = invoice._id || invoice.id
    invoiceToPrint.value = null
    showPaymentModal.value = true
  }

  function closePaymentModal() {
    showPaymentModal.value = false
    paymentForm.value = { amount: 0, date: new Date().toISOString().split('T')[0], method: 'cash', reference: '', notes: '' }
  }

  async function payInvoice() {
    const invId = paymentForm.value._invoiceId
    if (!invId) {
      alert('Invoice id missing')
      return
    }

    const payload = {
      amount: Number(paymentForm.value.amount || 0),
      date: paymentForm.value.date,
      method: paymentForm.value.method,
      reference: paymentForm.value.reference,
      notes: paymentForm.value.notes
    }
    try {
      if (token) {
        const res = await axios.post(`${API_BASE}/invoices/${invId}/pay`, payload, { headers: { Authorization: `Bearer ${token}` } })
        const updated = res.data && res.data.data ? res.data.data : res.data

        // find local invoice entry (by local id or server id)
        const idx = invoices.value.findIndex(inv => (inv._id === updated._id) || (inv.id === updated._id) || (inv.id === updated.id) || (inv._id === updated.id) || (inv.id === invId) || (inv._id === invId))

        if (idx !== -1) {
          // merge server fields but prefer server payments when provided
          const localTotal = Number(invoices.value[idx].totalAmount || 0)
          const serverTotal = (typeof updated.totalAmount !== 'undefined') ? Number(updated.totalAmount) : null
          // create merged invoice object
          invoices.value[idx] = { ...invoices.value[idx], ...updated, id: updated._id || updated.id || invoices.value[idx].id }
          invoices.value[idx].totalAmount = serverTotal === null ? localTotal : serverTotal

          if (Array.isArray(updated.payments) && updated.payments.length > 0) {
            // use server payments (normalize amounts to numbers)
            invoices.value[idx].payments = updated.payments.map(p => ({ ...p, amount: Number(p.amount || 0) }))
          } else {
            invoices.value[idx].payments = invoices.value[idx].payments || []
            // avoid duplicating same payment: check last entry
            const last = invoices.value[idx].payments[invoices.value[idx].payments.length - 1]
            const same = last && Number(last.amount || 0) === Number(payload.amount || 0) && last.date === payload.date
            if (!same) invoices.value[idx].payments.push({ ...payload })
          }

          const paidSum = (invoices.value[idx].payments || []).reduce((s, p) => s + Number(p.amount || 0), 0)
          const totalForBalance = Number(invoices.value[idx].totalAmount || 0)
          invoices.value[idx].balance = Math.max(0, totalForBalance - paidSum)
          invoices.value[idx].status = invoices.value[idx].balance <= 0 ? 'paid' : 'pending'
        } else if (updated) {
          // not found locally — insert normalized invoice with payment info
          const normalized = { ...updated, id: updated._id || updated.id }
          if (Array.isArray(updated.payments) && updated.payments.length > 0) {
            normalized.payments = updated.payments.map(p => ({ ...p, amount: Number(p.amount || 0) }))
          } else {
            normalized.payments = [{ ...payload }]
          }
          const totalForBalance = Number(normalized.totalAmount || 0)
          const paidSum = (normalized.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0)
          normalized.balance = Math.max(0, totalForBalance - paidSum)
          normalized.status = normalized.balance <= 0 ? 'paid' : 'pending'
          invoices.value.unshift(normalized)
        }

        // persist local snapshot so UI reflects newest state across reloads
        persistInvoices()
      } else {
        // offline: update local invoice payments and compute balance
        const idx = invoices.value.findIndex(inv => inv.id === invId || inv._id === invId)
        if (idx !== -1) {
          invoices.value[idx].payments = invoices.value[idx].payments || []
          const last = invoices.value[idx].payments[invoices.value[idx].payments.length - 1]
          const same = last && Number(last.amount || 0) === Number(payload.amount || 0) && last.date === payload.date
          if (!same) invoices.value[idx].payments.push({ ...payload })
          const totalForBalance = Number(invoices.value[idx].totalAmount || 0)
          const paidSum = (invoices.value[idx].payments || []).reduce((s, p) => s + Number(p.amount || 0), 0)
          invoices.value[idx].balance = Math.max(0, totalForBalance - paidSum)
          invoices.value[idx].status = invoices.value[idx].balance <= 0 ? 'paid' : 'pending'
        }
        persistInvoices()
      }

      closePaymentModal()
    } catch (err) {
      console.error('Payment failed', err)
      alert(err?.response?.data?.message || 'Payment failed')
    }
  }

  function printInvoice({ invoice, payment }) {
    try {
      const win = window.open('', '_blank')
      if (!win) {
        alert('Pop-up blocked. Please allow pop-ups to print the bill.')
        return
      }

      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${invoice._id || invoice.id}</title>
        <style>body{font-family: Arial, sans-serif;padding:20px;color:#111} .header{display:flex;justify-content:space-between;margin-bottom:20px} .items{width:100%;border-collapse:collapse} .items th,.items td{border:1px solid #ddd;padding:8px;text-align:left} .right{text-align:right}</style>
        </head><body>
        <div class="header"><div><h2>Supplier Invoice</h2><div>Invoice: ${invoice._id || invoice.id}</div><div>Date: ${new Date(invoice.date).toLocaleDateString()}</div></div>
        <div class="right"><div><strong>${invoice.supplierName || getSupplierName(invoice.supplierId)}</strong></div><div>Payment: ${payment.method}</div><div>Reference: ${payment.reference || '-'}</div></div></div>
        <table class="items"><thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th class="right">Total</th></tr></thead><tbody>
        ${ (invoice.items || []).map(i=>`<tr><td>${i.description}</td><td>${i.quantity}</td><td>Rs.${(i.unitPrice||0).toFixed(2)}</td><td class="right">Rs.${((i.total)||((i.quantity||0)*(i.unitPrice||0))).toFixed(2)}</td></tr>`).join('') }
        </tbody></table>
        <div style="margin-top:20px;text-align:right">Subtotal: Rs.${(invoice.subtotal||0).toFixed(2)}<br>Discount: Rs.${(invoice.discount||0).toFixed(2)}<br><strong>Total Paid: Rs.${(payment.amount||0).toFixed(2)}</strong><br><strong>Balance: Rs.${((invoice.totalAmount||0)- (payment.amount||0)).toFixed(2)}</strong></div>
        <div style="margin-top:30px">Notes: ${payment.notes || invoice.notes || '-'}</div>
        <script>window.onload=function(){window.print(); setTimeout(()=>window.close(), 200);}</\/script>
        </body></html>`

      win.document.open()
      win.document.write(html)
      win.document.close()
    } catch (err) {
      console.error('Print failed', err)
      alert('Could not open print window')
    }
  }

  function getPaidAmount(inv) {
    try {
      const arr = inv && (Array.isArray(inv.payments) ? inv.payments : (inv.payments || [])) || []
      return (arr || []).reduce((s, p) => {
        const raw = p && p.amount != null ? String(p.amount) : '0'
        const numeric = Number(raw.replace(/,/g, '')) || 0
        return s + numeric
      }, 0)
    } catch (e) { return 0 }
  }

  function getBalance(inv) {
    const total = Number(inv.totalAmount || 0)
    const paid = getPaidAmount(inv)
    return Math.max(0, total - paid)
  }

  function getSupplierPendingAmount(supplierId) {
    try {
      const list = invoices.value.filter(inv => (inv.supplierId === supplierId) || (inv.supplierId === String(supplierId)))
      return list.reduce((sum, inv) => {
        const bal = (typeof inv.balance !== 'undefined') ? Number(inv.balance || 0) : Math.max(0, Number(inv.totalAmount || 0) - (inv.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0))
        // count only pending/overdue balances
        return sum + (bal > 0 ? bal : 0)
      }, 0)
    } catch (e) { return 0 }
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
  
  async function saveInvoice() {
    if (!currentInvoice.value.supplierId) {
      alert('Please select a supplier')
      return
    }
  
    if (!currentInvoice.value.date || !currentInvoice.value.dueDate) {
      alert('Please fill in all required fields')
      return
    }

    // ensure totals up-to-date
    calculateTotals()

    if (isEditing.value) {
      // Update existing invoice
      const idToUse = currentInvoice.value._id || currentInvoice.value.id
      if (token && idToUse) {
        try {
          const res = await axios.put(`${API_BASE}/invoices/${idToUse}`, currentInvoice.value, { headers: { Authorization: `Bearer ${token}` } })
          const updated = res.data
          const normalized = {
            ...updated,
            id: updated._id || updated.id,
            _id: updated._id || updated._id,
            subtotal: Number(updated.subtotal || currentInvoice.value.subtotal || 0),
            discount: Number(updated.discount || currentInvoice.value.discount || 0),
            discountPercent: Number(updated.discountPercent || currentInvoice.value.discountPercent || 0),
            totalAmount: Number(updated.totalAmount || currentInvoice.value.totalAmount || 0),
            date: updated.date ? new Date(updated.date).toISOString().split('T')[0] : (currentInvoice.value.date || ''),
            dueDate: updated.dueDate ? new Date(updated.dueDate).toISOString().split('T')[0] : (currentInvoice.value.dueDate || '')
          }
          const idx = invoices.value.findIndex(inv => inv._id === idToUse || inv.id === idToUse || inv.id === currentInvoice.value.id)
          if (idx !== -1) invoices.value[idx] = normalized
        } catch (err) {
          console.warn('Failed to update invoice on server, falling back to local update', err)
          const index = invoices.value.findIndex(inv => inv.id === currentInvoice.value.id || inv._id === currentInvoice.value._id)
          if (index !== -1) invoices.value[index] = { ...currentInvoice.value }
        }
      } else {
        const index = invoices.value.findIndex(inv => inv.id === currentInvoice.value.id)
        if (index !== -1) invoices.value[index] = { ...currentInvoice.value }
      }
    } else {
      // Add new invoice - include supplier details snapshot
      const sd = supplierDetails.value || null
      let invoiceToSave = {
        ...currentInvoice.value,
        supplierName: sd ? sd.name : getSupplierName(currentInvoice.value.supplierId)
      }

      if (token) {
        try {
          const res = await axios.post(`${API_BASE}/invoices`, invoiceToSave, { headers: { Authorization: `Bearer ${token}` } })
          const created = res.data
          // normalize created invoice shape
          const normalized = {
            ...created,
            id: created._id || created.id,
            _id: created._id || created._id,
            subtotal: Number(created.subtotal || invoiceToSave.subtotal || 0),
            discount: Number(created.discount || invoiceToSave.discount || 0),
            discountPercent: Number(created.discountPercent || invoiceToSave.discountPercent || 0),
            totalAmount: Number(created.totalAmount || invoiceToSave.totalAmount || 0),
            date: created.date ? new Date(created.date).toISOString().split('T')[0] : (invoiceToSave.date || new Date().toISOString().split('T')[0]),
            dueDate: created.dueDate ? new Date(created.dueDate).toISOString().split('T')[0] : (invoiceToSave.dueDate || '')
          }
          normalized.payments = Array.isArray(normalized.payments) ? normalized.payments : []
          const paidSum = (normalized.payments || []).reduce((s,p) => s + Number(p.amount || 0), 0)
          normalized.balance = Math.max(0, (normalized.totalAmount || 0) - paidSum)
          normalized.status = normalized.balance <= 0 ? 'paid' : (normalized.status || 'pending')
          invoices.value.unshift(normalized)
        } catch (err) {
          console.warn('Failed to create invoice on server, saving locally', err)
        invoiceToSave.id = invoiceToSave.id || String(1000 + (invoices.value.length || 0) + 1)
        invoiceToSave.payments = Array.isArray(invoiceToSave.payments) ? invoiceToSave.payments : []
        invoiceToSave.balance = Math.max(0, (invoiceToSave.totalAmount || 0) - (invoiceToSave.payments || []).reduce((s,p) => s + Number(p.amount || 0), 0))
        invoiceToSave.status = invoiceToSave.balance <= 0 ? 'paid' : (invoiceToSave.status || 'pending')
        invoices.value.unshift(invoiceToSave)
        }
      } else {
        invoiceToSave.id = invoiceToSave.id || String(1000 + (invoices.value.length || 0) + 1)
        invoices.value.unshift(invoiceToSave)
      }

      // Reset filters/search so the newly created invoice is visible
      filters.value = { supplier: '', status: '', fromDate: '', toDate: '' }
      searchQuery.value = ''
      activeTab.value = 'invoices'
    }

    // Persist changes so they survive refresh
    try {
      persistInvoices()
    } catch (e) {
      console.warn('Could not persist invoices locally', e)
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