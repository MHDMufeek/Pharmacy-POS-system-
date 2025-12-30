<template>
  <div class="container mx-auto p-6 dark:bg-slate-900 dark:text-white">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-blue-900 dark:text-blue-300">Drug Movement Summary</h1>
        <p class="text-gray-600 mt-1 dark:text-gray-300">Track and analyze drug inventory movements and transactions</p>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Transactions</p>
            <p class="text-2xl font-bold text-gray-900 mt-1 dark:text-white">{{ totalTransactions }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full dark:bg-blue-900/20">
            <span class="material-icons text-blue-600">swap_horiz</span>
          </div>
        </div>
        
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Items Sold</p>
            <p class="text-2xl font-bold text-gray-900 mt-1 dark:text-white">{{ itemsSold }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full dark:bg-green-900/20">
            <span class="material-icons text-green-600">point_of_sale</span>
          </div>
        </div>
        
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900 mt-1 dark:text-white">Rs.{{ totalRevenue.toFixed(2) }}</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-full dark:bg-purple-900/20">
            <span class="material-icons text-purple-600">payments</span>
          </div>
        </div>
        
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Low Stock Items</p>
            <p class="text-2xl font-bold text-gray-900 mt-1 dark:text-white">{{ lowStockItems }}</p>
          </div>
          <div class="bg-orange-100 p-3 rounded-full dark:bg-orange-900/20">
            <span class="material-icons text-orange-600">warning</span>
          </div>
        </div>
        
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="bg-white rounded-lg shadow mb-6 dark:bg-slate-800 dark:text-white">
      <div class="border-b">
        <nav class="flex -mb-px overflow-x-auto">
          <button 
            @click="activeTab = 'overview'"
            :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', 
                    activeTab === 'overview' 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-300 dark:border-blue-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600']"
          >
            <span class="material-icons align-middle mr-2 text-base">dashboard</span>
            Overview
          </button>
          <button 
            @click="activeTab = 'transactions'"
            :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', 
                    activeTab === 'transactions' 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-300 dark:border-blue-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600']"
          >
            <span class="material-icons align-middle mr-2 text-base">receipt_long</span>
            All Transactions
          </button>
          <button 
            @click="activeTab = 'stock'"
            :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', 
                    activeTab === 'stock' 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-300 dark:border-blue-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600']"
          >
            <span class="material-icons align-middle mr-2 text-base">inventory</span>
            Stock Movement
          </button>
          <button 
            @click="activeTab = 'analytics'"
            :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', 
                    activeTab === 'analytics' 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-300 dark:border-blue-400' 
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600']"
          >
            <span class="material-icons align-middle mr-2 text-base">analytics</span>
            Analytics
          </button>
          <!-- Reports tab removed -->
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'">
          <!-- Date Range Filter -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6 dark:bg-slate-800 dark:text-gray-300">
            <div class="flex flex-col md:flex-row gap-4 items-center">
              <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">From</label>
                  <div>
                    <input id="startDateInput" type="date" v-model="startDate" class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none text-gray-900 dark:text-white dark:bg-slate-700 dark:border-slate-600" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">To</label>
                  <div>
                    <input id="endDateInput" type="date" v-model="endDate" class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none text-gray-900 dark:text-white dark:bg-slate-700 dark:border-slate-600" />
                  </div>
                </div>
                <!-- Type selector removed per request -->
              </div>
              <div class="flex gap-2 items-center">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors" @click="filterByDate">
                  <span class="material-icons text-sm mr-1">filter_list</span>
                  Filter
                </button>
              </div>
            </div>
          </div>

          <!-- Charts and Metrics -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            

            <!-- Top Selling Drugs -->
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Drugs</h3>
              <div class="space-y-4">
                <div v-for="(drug, index) in topSellingDrugs" :key="drug.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-slate-700">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 dark:bg-blue-900/20">
                      <span class="text-blue-600 font-bold text-sm">{{ index + 1 }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ drug.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-300">{{ drug.category }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ drug.quantity }} sold</div>
                    <div class="text-xs text-gray-500 dark:text-gray-300">Rs.{{ drug.revenue.toFixed(2) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">Transaction Summary</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Total Sales:</span>
                  <span class="font-medium">Rs.{{ salesSummary.totalSales.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Total Purchases:</span>
                  <span class="font-medium">Rs.{{ salesSummary.totalPurchases.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Net Profit:</span>
                  <span class="font-medium text-green-600">Rs.{{ salesSummary.netProfit.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">Inventory Status</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Total Items:</span>
                  <span class="font-medium">{{ inventoryStatus.totalItems }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Low Stock:</span>
                  <span class="font-medium text-orange-600">{{ inventoryStatus.lowStock }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Out of Stock:</span>
                  <span class="font-medium text-red-600">{{ inventoryStatus.outOfStock }}</span>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">Movement Activity</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Today's Transactions:</span>
                  <span class="font-medium">{{ movementActivity.todayTransactions }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Items Moved:</span>
                  <span class="font-medium">{{ movementActivity.itemsMoved }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Avg. Daily Sales:</span>
                  <span class="font-medium">{{ movementActivity.avgDailySales }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transactions Tab -->
        <div v-if="activeTab === 'transactions'">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">All Transactions</h3>
            <div class="flex gap-2">
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <span class="material-icons text-sm mr-1">file_download</span>
                Export
              </button>
              <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <span class="material-icons text-sm mr-1">print</span>
                Print
              </button>
            </div>
          </div>

          <!-- Transactions Table -->
          <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead class="bg-gray-50 dark:bg-slate-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Drug Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 dark:bg-transparent dark:divide-slate-700">
                <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-gray-50 transition-colors dark:hover:bg-slate-700">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-300">
                    {{ transaction.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ transaction.drugName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="['px-2 py-1 text-xs font-semibold rounded-full', getTransactionTypeClass(transaction.type)]">
                      {{ transaction.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ transaction.quantity > 0 ? '+' : '' }}{{ transaction.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Rs.{{ transaction.amount.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {{ formatDate(transaction.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="['px-2 py-1 text-xs font-semibold rounded-full', getStatusClass(transaction.status)]">
                      {{ transaction.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Stock Movement Tab -->
        <div v-if="activeTab === 'stock'">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Stock Alerts -->
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock Alerts</h3>
              <div class="space-y-3">
                <div v-for="alert in stockAlerts" :key="alert.id" class="p-3 border-l-4 rounded bg-red-50 border-red-400 dark:bg-red-900/10 dark:border-red-700">
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ alert.drugName }}</div>
                      <div class="text-xs text-gray-600 dark:text-gray-300 mt-1">Current Stock: {{ alert.currentStock }}</div>
                    </div>
                    <span class="material-icons text-red-500 text-sm">warning</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Stock Movements -->
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 lg:col-span-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Stock Movements</h3>
              <div class="space-y-4">
                <div v-for="movement in recentMovements" :key="movement.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-slate-700">
                  <div class="flex items-center">
                    <div :class="['w-10 h-10 rounded-full flex items-center justify-center mr-3', getMovementIconClass(movement.type)]">
                      <span class="material-icons text-white text-sm">{{ getMovementIcon(movement.type) }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ movement.drugName }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-300">{{ movement.type }} • {{ formatDate(movement.date) }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium" :class="getMovementTextClass(movement.type)">
                      {{ movement.quantity > 0 ? '+' : '' }}{{ movement.quantity }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-300">Stock: {{ movement.newStock }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Performance Metrics -->
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
              <div class="space-y-4">
                <div v-for="metric in performanceMetrics" :key="metric.name" class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ metric.name }}</div>
                    <div class="text-xs text-gray-500">{{ metric.description }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold" :class="metric.trend > 0 ? 'text-green-600' : 'text-red-600'">
                      {{ metric.value }}
                    </div>
                    <div class="text-xs" :class="metric.trend > 0 ? 'text-green-600' : 'text-red-600'">
                      {{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Category Distribution -->
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
              <div class="space-y-3">
                <div v-for="category in categorySales" :key="category.name" class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: category.color }"></div>
                    <span class="text-sm text-gray-700">{{ category.name }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-medium text-gray-900">Rs.{{ category.amount.toFixed(2) }}</span>
                    <span class="text-xs text-gray-500 ml-2">({{ category.percentage }}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reports tab removed per user request -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
const token = localStorage.getItem('token')

// UI state
const activeTab = ref('overview')
const dateRange = ref('month')
const customStartDate = ref('')
const customEndDate = ref('')
// transactionType removed
const searchQuery = ref('')
// start/end date defaults: first day of month -> today
const today = new Date()
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
const startDate = ref(startOfMonth.toISOString().slice(0,10))
const endDate = ref(today.toISOString().slice(0,10))
const generated = ref(false)
const generatedReports = ref({})

// store last fetched payload to include in downloads
const lastData = ref(null)

// Data from API
const totalTransactions = ref(0)
const itemsSold = ref(0)
const totalRevenue = ref(0)
const lowStockItems = ref(0)
const topSellingDrugs = ref([])
const salesSummary = ref({ totalSales: 0, totalPurchases: 0, netProfit: 0 })
const inventoryStatus = ref({ totalItems: 0, lowStock: 0, outOfStock: 0 })
const movementActivity = ref({ todayTransactions: 0, itemsMoved: 0, avgDailySales: 0 })
const stockAlerts = ref([])
const recentMovements = ref([])
const performanceMetrics = ref([])
const categorySales = ref([])
const availableReports = ref([])
const transactions = ref([])

const apiHeaders = token ? { Authorization: `Bearer ${token}` } : {}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getTransactionTypeClass(type) {
  const classes = {
    sale: 'bg-green-100 text-green-800',
    purchase: 'bg-blue-100 text-blue-800',
    return: 'bg-red-100 text-red-800',
    adjustment: 'bg-yellow-100 text-yellow-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

function getStatusClass(status) {
  return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
}

function getMovementIcon(type) {
  const icons = {
    sale: 'remove',
    purchase: 'add',
    return: 'refresh',
    adjustment: 'build'
  }
  return icons[type] || 'swap_horiz'
}

function getMovementIconClass(type) {
  const classes = {
    sale: 'bg-red-500',
    purchase: 'bg-green-500',
    return: 'bg-blue-500',
    adjustment: 'bg-yellow-500'
  }
  return classes[type] || 'bg-gray-500'
}

function getMovementTextClass(type) {
  return type === 'sale' ? 'text-red-600' : 'text-green-600'
}

const filteredTransactions = computed(() => {
  let filtered = transactions.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => (t.drugName || '').toLowerCase().includes(q) || (t.id || '').toLowerCase().includes(q))
  }
  return filtered
})

async function fetchData(opts = {}) {
  try {
    const params = {
      start: opts.start || startDate.value,
      end: opts.end || endDate.value
    }
    const res = await axios.get(`${API_BASE}/reports/drug-movement`, { params, headers: apiHeaders })
    const d = res.data || {}
    totalTransactions.value = d.totalTransactions || 0
    itemsSold.value = d.itemsSold || 0
    totalRevenue.value = d.totalRevenue || 0
    lowStockItems.value = d.lowStockItems || 0
    topSellingDrugs.value = d.topSellingDrugs || []
    salesSummary.value = d.salesSummary || salesSummary.value
    inventoryStatus.value = d.inventoryStatus || inventoryStatus.value
    movementActivity.value = d.movementActivity || movementActivity.value
    stockAlerts.value = d.stockAlerts || []
    recentMovements.value = d.recentMovements || []
    performanceMetrics.value = d.performanceMetrics || []
    categorySales.value = d.categorySales || []
    availableReports.value = d.availableReports || []
    // store full payload for downloads
    lastData.value = d
    // Optionally populate transactions table from recent movements + sales
      // populate transactions list
      transactions.value = (d.transactions || (d.recentMovements || [])).map(r => ({ id: r.id, drugName: r.drugName, type: r.type, quantity: r.quantity, amount: r.amount || 0, date: r.date, status: r.status || 'completed' }))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load drug movement data', err)
  }
}

function applyFilters() {
  // TODO: support date range filters when API supports them
  fetchData()
}

function resetFilters() {
  dateRange.value = 'month'
  searchQuery.value = ''
  customStartDate.value = ''
  customEndDate.value = ''
  fetchData()
}

onMounted(() => {
  fetchData()
})

function downloadReport(report) {
  if (!lastData.value) return
  const payload = { reportTitle: report.title, generatedAt: report.lastGenerated, data: lastData.value }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const name = `${report.title.replace(/\s+/g, '_')}_${(new Date()).toISOString().slice(0,10)}.json`
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function filterByDate() {
  await fetchData({ start: startDate.value, end: endDate.value })
}

async function generateReport(report) {
  await fetchData({ start: startDate.value, end: endDate.value })
  const now = new Date().toLocaleString()
  report.lastGenerated = now
  generatedReports.value = { ...generatedReports.value, [report.id]: true }
  // create PDF
  await createPdfFromPayload(report.title, now, lastData.value || {})
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) return resolve()
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', (e) => reject(e))
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = (e) => reject(e)
    document.head.appendChild(s)
  })
}

async function createPdfFromPayload(title, generatedAt, payload) {
  const container = document.createElement('div')
  container.style.padding = '20px'
  container.style.fontFamily = 'Arial, Helvetica, sans-serif'
  const header = `<div style="text-align:center;margin-bottom:8px"><h2 style="margin:0;padding:0">${title}</h2><div style="font-size:12px;color:#555">Generated: ${generatedAt}</div></div><hr/>`
  const transactionsList = payload.transactions || []
  const rows = transactionsList.map((t, i) => `<tr><td style="padding:6px;border-bottom:1px solid #eee">${i+1}</td><td style="padding:6px;border-bottom:1px solid #eee">${t.drugName}</td><td style="padding:6px;border-bottom:1px solid #eee;text-align:right">${t.quantity}</td><td style="padding:6px;border-bottom:1px solid #eee;text-align:right">Rs.${(t.amount||0).toFixed(2)}</td></tr>`).join('')
  const total = payload.salesSummary ? payload.salesSummary.totalSales : payload.totalRevenue || 0
  const table = `<table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="text-align:left;padding:6px;border-bottom:2px solid #ccc">#</th><th style="text-align:left;padding:6px;border-bottom:2px solid #ccc">Drug</th><th style="text-align:right;padding:6px;border-bottom:2px solid #ccc">Qty</th><th style="text-align:right;padding:6px;border-bottom:2px solid #ccc">Amount</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td></td><td style="text-align:right;font-weight:700;padding:6px">Total</td><td></td><td style="text-align:right;font-weight:700;padding:6px">Rs.${(total).toFixed(2)}</td></tr></tfoot></table>`
  container.innerHTML = header + table
  document.body.appendChild(container)
  try {
    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js')
    const opt = { margin: 10, filename: `${title.replace(/\s+/g,'_')}_${startDate.value || ''}_${endDate.value || ''}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }
    // @ts-ignore
    html2pdf().set(opt).from(container).save().then(() => { container.remove() }).catch(() => { container.remove() })
  } catch (e) {
    const html = buildSalesBillHtml(title, generatedAt, payload)
    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
    container.remove()
  }
}

function buildSalesBillHtml(title, generatedAt, payload) {
  const items = (payload.transactions || []).map((t, i) => `<tr><td>${i+1}</td><td>${t.drugName}</td><td style="text-align:right">${t.quantity}</td><td style="text-align:right">Rs.${(t.amount||0).toFixed(2)}</td></tr>`).join('')
  const total = payload.salesSummary ? payload.salesSummary.totalSales : payload.totalRevenue || 0
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px}h2{text-align:center}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #ddd}tfoot td{font-weight:bold}</style></head><body><h2>${title}</h2><div>Generated: ${generatedAt}</div><hr><table><thead><tr><th>Txn #</th><th>Drug</th><th style="text-align:right">Qty</th><th style="text-align:right">Amount</th></tr></thead><tbody>${items}</tbody><tfoot><tr><td></td><td style="text-align:right">Total</td><td></td><td style="text-align:right">Rs.${(total).toFixed(2)}</td></tr></tfoot></table><div style="margin-top:20px;text-align:center"><button onclick="window.print()">Print</button></div></body></html>`
}
</script>

<style scoped>
.container {
  max-width: 100%;
}
</style>