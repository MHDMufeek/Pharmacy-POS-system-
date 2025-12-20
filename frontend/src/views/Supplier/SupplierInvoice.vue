<template>
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-blue-900">Supplier Management</h1>
          <p class="text-gray-600 mt-1">Manage your suppliers and invoices in one place</p>
        </div>
        <button 
          @click="$emit('go-back')" 
          class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span class="material-icons mr-1">arrow_back</span>
          Back to Dashboard
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ suppliers.length }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <span class="material-icons text-blue-600">business</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
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

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
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

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
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
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="border-b">
          <nav class="flex -mb-px">
            <button 
              @click="activeTab = 'invoices'"
              :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors', 
                      activeTab === 'invoices' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
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
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="flex flex-col md:flex-row gap-4 items-end">
                <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <select v-model="filters.supplier" class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Suppliers</option>
                      <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">{{ supplier.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select v-model="filters.status" class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                      class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input 
                      type="date" 
                      v-model="filters.toDate" 
                      class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                  </div>
                </div>
                <div class="flex gap-2">
                  <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors" @click="applyFilters">
                    <span class="material-icons text-sm mr-1">search</span>
                    Search
                  </button>
                  <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors" @click="resetFilters">
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
                <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors" @click="showAddSupplierModal">
                  <span class="material-icons text-sm mr-1">add_business</span>
                  Add Supplier
                </button>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                  <span class="material-icons text-sm mr-1">file_download</span>
                  Export
                </button>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                  <span class="material-icons text-sm mr-1">print</span>
                  Print
                </button>
              </div>
              <div class="flex gap-2">
                <div class="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
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
            <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
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
                  <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50 transition-colors">
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
                      Rs.{{ invoice.totalAmount.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', 
                                  getStatusClass(invoice.status)]">
                        {{ invoice.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex items-center space-x-2">
                        <button type="button" class="password-toggle" @click="showPassword = !showPassword">
  <span class="text-lg">{{ showPassword ? '🙈' : '👁️' }}</span>
</button>
                        <button class="text-green-600 hover:text-green-900 transition-colors" @click="editInvoice(invoice)" v-if="invoice.status === 'pending'" title="Edit Invoice">
                          <span class="material-icons text-base">edit</span>
                        </button>
                        <button class="text-red-600 hover:text-red-900 transition-colors" @click="deleteInvoice(invoice)" v-if="invoice.status === 'pending'" title="Delete Invoice">
                          <span class="material-icons text-base">delete</span>
                        </button>
                        <button class="text-purple-600 hover:text-purple-900 transition-colors" @click="markAsPaid(invoice)" v-if="invoice.status === 'pending'" title="Mark as Paid">
                          <span class="material-icons text-base">payments</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Empty State -->
              <div v-if="filteredInvoices.length === 0" class="text-center py-12">
                <span class="material-icons text-gray-300 text-6xl">receipt</span>
                <p class="mt-4 text-gray-500">No invoices found</p>
                <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors" @click="showCreateInvoiceModal">
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
              <button @click="showAddSupplierModal" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <span class="material-icons text-sm mr-1">add</span>
                Add New Supplier
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="supplier in suppliers" :key="supplier.id" class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="bg-blue-100 p-3 rounded-lg">
                    <span class="material-icons text-blue-600">business</span>
                  </div>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800 transition-colors" title="Edit Supplier">
                      <span class="material-icons text-base">edit</span>
                    </button>
                    <button class="text-red-600 hover:text-red-800 transition-colors" title="Delete Supplier">
                      <span class="material-icons text-base">delete</span>
                    </button>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ supplier.name }}</h4>
                <div class="space-y-2 text-sm text-gray-600">
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
                    <span>{{ supplier.city || 'N/A' }}, {{ supplier.country || 'N/A' }}</span>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Total Invoices:</span>
                    <span class="font-medium">{{ getSupplierInvoiceCount(supplier.id) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Tab -->
          <div v-if="activeTab === 'analytics'">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Invoice Status Chart -->
              <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Invoice Status Distribution</h3>
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
              <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Suppliers by Invoice Volume</h3>
                <div class="space-y-4">
                  <div v-for="supplier in topSuppliers" :key="supplier.id" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="bg-blue-100 p-2 rounded-lg mr-3">
                        <span class="material-icons text-blue-600 text-sm">business</span>
                      </div>
                      <span class="text-sm font-medium text-gray-900">{{ supplier.name }}</span>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-medium text-gray-900">{{ supplier.invoiceCount }} invoices</div>
                      <div class="text-xs text-gray-500">Rs.{{ supplier.totalAmount.toFixed(2) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Monthly Summary -->
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 mt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Invoice Summary</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600">{{ currentMonthInvoices }}</div>
                  <div class="text-sm text-gray-600">This Month</div>
                </div>
                <div class="text-center p-4 bg-green-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">Rs.{{ currentMonthAmount.toFixed(2) }}</div>
                  <div class="text-sm text-gray-600">Month Amount</div>
                </div>
                <div class="text-center p-4 bg-orange-50 rounded-lg">
                  <div class="text-2xl font-bold text-orange-600">{{ lastMonthInvoices }}</div>
                  <div class="text-sm text-gray-600">Last Month</div>
                </div>
                <div class="text-center p-4 bg-purple-50 rounded-lg">
                  <div class="text-2xl font-bold text-purple-600">Rs.{{ lastMonthAmount.toFixed(2) }}</div>
                  <div class="text-sm text-gray-600">Last Month Amount</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Invoice Modal -->
      <div v-if="showInvoiceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                    :value="'Rs. ' + (item.total || 0).toFixed(2)" 
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
                    <span class="font-medium">Rs.{{ currentInvoice.subtotal.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-gray-600">Tax (10%):</span>
                    <span class="font-medium">Rs.{{ currentInvoice.tax.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm text-gray-600">Discount:</span>
                    <span class="font-medium">-Rs.{{ currentInvoice.discount.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between border-t pt-2">
                    <span class="text-lg font-bold text-gray-800">Total:</span>
                    <span class="text-lg font-bold text-blue-600">Rs.{{ currentInvoice.totalAmount.toFixed(2) }}</span>
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

      <!-- Add Supplier Modal -->
      <div v-if="showSupplierModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Add New Supplier</h3>
          </div>
          <div class="px-6 py-4">
            <form @submit.prevent="saveSupplier" class="space-y-6">
              <!-- Basic Information -->
              <div>
                <h4 class="text-md font-medium text-gray-700 mb-4">Basic Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newSupplier.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  const searchQuery = ref('')
  const showInvoiceModal = ref(false)
  const showSupplierModal = ref(false)
  const isEditing = ref(false)
  const activeTab = ref('invoices')
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
  
  // Data will be fetched from the API in production
  const suppliers = ref([])
  const invoices = ref([])
  
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
  
  function loadInvoices() {
    // In a real application, this would fetch data from an API
    console.log('Loading invoices...')
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