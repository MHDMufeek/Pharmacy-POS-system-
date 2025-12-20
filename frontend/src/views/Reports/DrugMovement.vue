<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-blue-900">Drug Movement Summary</h1>
        <p class="text-gray-600 mt-1">Track and analyze drug inventory movements and transactions</p>
      </div>
      <button 
        @click="$emit('go-back')" 
        class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <span class="material-icons mr-1">arrow_back</span>
        Back to Dashboard
      </button>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Transactions</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalTransactions }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <span class="material-icons text-blue-600">swap_horiz</span>
          </div>
        </div>
        <div class="mt-2 text-xs text-green-600 flex items-center">
          <span class="material-icons text-sm mr-1">trending_up</span>
          +12% from last month
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Items Sold</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ itemsSold }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <span class="material-icons text-green-600">point_of_sale</span>
          </div>
        </div>
        <div class="mt-2 text-xs text-green-600 flex items-center">
          <span class="material-icons text-sm mr-1">trending_up</span>
          +8% from last month
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">Rs.{{ totalRevenue.toFixed(2) }}</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
            <span class="material-icons text-purple-600">payments</span>
          </div>
        </div>
        <div class="mt-2 text-xs text-green-600 flex items-center">
          <span class="material-icons text-sm mr-1">trending_up</span>
          +15% from last month
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Low Stock Items</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ lowStockItems }}</p>
          </div>
          <div class="bg-orange-100 p-3 rounded-full">
            <span class="material-icons text-orange-600">warning</span>
          </div>
        </div>
        <div class="mt-2 text-xs text-red-600 flex items-center">
          <span class="material-icons text-sm mr-1">priority_high</span>
          Needs attention
        </div>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="border-b">
        <nav class="flex -mb-px overflow-x-auto">
          <button 
            @click="activeTab = 'overview'"
            :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', 
                    activeTab === 'overview' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            <span class="material-icons align-middle mr-2 text-base">dashboard</span>
            Overview
          </button>
          <button 
            @click="activeTab = 'transactions'"
            :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', 
                    activeTab === 'transactions' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            <span class="material-icons align-middle mr-2 text-base">receipt_long</span>
            All Transactions
          </button>
          <button 
            @click="activeTab = 'stock'"
            :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', 
                    activeTab === 'stock' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            <span class="material-icons align-middle mr-2 text-base">inventory</span>
            Stock Movement
          </button>
          <button 
            @click="activeTab = 'analytics'"
            :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', 
                    activeTab === 'analytics' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            <span class="material-icons align-middle mr-2 text-base">analytics</span>
            Analytics
          </button>
          <button 
            @click="activeTab = 'reports'"
            :class="['py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', 
                    activeTab === 'reports' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            <span class="material-icons align-middle mr-2 text-base">summarize</span>
            Reports
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'">
          <!-- Date Range Filter -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="flex flex-col md:flex-row gap-4 items-end">
              <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select v-model="dateRange" class="w-full bg-black border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">This Week</option>
                    <option value="month" selected>This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div v-if="dateRange === 'custom'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input 
                    type="date" 
                    v-model="customStartDate" 
                    class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                <div v-if="dateRange === 'custom'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input 
                    type="date" 
                    v-model="customEndDate" 
                    class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                  <select v-model="transactionType" class="w-full bg-black
                   border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all">All Types</option>
                    <option value="sale">Sales</option>
                    <option value="purchase">Purchases</option>
                    <option value="return">Returns</option>
                    <option value="adjustment">Adjustments</option>
                  </select>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors" @click="applyFilters">
                  <span class="material-icons text-sm mr-1">search</span>
                  Apply
                </button>
                <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors" @click="resetFilters">
                  <span class="material-icons text-sm mr-1">refresh</span>
                  Reset
                </button>
              </div>
            </div>
          </div>

          <!-- Charts and Metrics -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Sales Trend Chart -->
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
              <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div class="text-center text-gray-500">
                  <span class="material-icons text-4xl mb-2">bar_chart</span>
                  <p>Sales Chart Visualization</p>
                  <p class="text-sm">(Chart would be implemented with a charting library)</p>
                </div>
              </div>
            </div>

            <!-- Top Selling Drugs -->
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Selling Drugs</h3>
              <div class="space-y-4">
                <div v-for="(drug, index) in topSellingDrugs" :key="drug.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span class="text-blue-600 font-bold text-sm">{{ index + 1 }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ drug.name }}</div>
                      <div class="text-xs text-gray-500">{{ drug.category }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">{{ drug.quantity }} sold</div>
                    <div class="text-xs text-gray-500">Rs.{{ drug.revenue.toFixed(2) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h4 class="text-md font-semibold text-gray-900 mb-3">Transaction Summary</h4>
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

            <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h4 class="text-md font-semibold text-gray-900 mb-3">Inventory Status</h4>
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

            <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h4 class="text-md font-semibold text-gray-900 mb-3">Movement Activity</h4>
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
            <h3 class="text-lg font-semibold text-gray-900">All Transactions</h3>
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
          <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {{ transaction.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ transaction.drugName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="['px-2 py-1 text-xs font-semibold rounded-full', getTransactionTypeClass(transaction.type)]">
                      {{ transaction.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ transaction.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rs.{{ transaction.amount.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Stock Alerts</h3>
              <div class="space-y-3">
                <div v-for="alert in stockAlerts" :key="alert.id" class="p-3 border-l-4 rounded bg-red-50 border-red-400">
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ alert.drugName }}</div>
                      <div class="text-xs text-gray-600 mt-1">Current Stock: {{ alert.currentStock }}</div>
                    </div>
                    <span class="material-icons text-red-500 text-sm">warning</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Stock Movements -->
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200 lg:col-span-2">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Stock Movements</h3>
              <div class="space-y-4">
                <div v-for="movement in recentMovements" :key="movement.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center">
                    <div :class="['w-10 h-10 rounded-full flex items-center justify-center mr-3', getMovementIconClass(movement.type)]">
                      <span class="material-icons text-white text-sm">{{ getMovementIcon(movement.type) }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ movement.drugName }}</div>
                      <div class="text-xs text-gray-500">{{ movement.type }} • {{ formatDate(movement.date) }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium" :class="getMovementTextClass(movement.type)">
                      {{ movement.quantity > 0 ? '+' : '' }}{{ movement.quantity }}
                    </div>
                    <div class="text-xs text-gray-500">Stock: {{ movement.newStock }}</div>
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
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
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
            <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
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

        <!-- Reports Tab -->
        <div v-if="activeTab === 'reports'">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="report in availableReports" :key="report.id" class="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div :class="['p-3 rounded-lg', report.iconBg]">
                  <span class="material-icons text-white" :class="report.iconColor">{{ report.icon }}</span>
                </div>
                <button class="text-blue-600 hover:text-blue-800">
                  <span class="material-icons">download</span>
                </button>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ report.title }}</h4>
              <p class="text-sm text-gray-600 mb-4">{{ report.description }}</p>
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Last generated: {{ report.lastGenerated }}</span>
                <button class="text-blue-600 hover:text-blue-800 font-medium">Generate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const activeTab = ref('overview')
const dateRange = ref('month')
const customStartDate = ref('')
const customEndDate = ref('')
const transactionType = ref('all')
const searchQuery = ref('')

// Sample data - in real application, this would come from API
const transactions = ref([
  { id: 'TXN001', drugName: 'Paracetamol 500mg', type: 'sale', quantity: 10, amount: 25.50, date: '2024-01-15', status: 'completed' },
  { id: 'TXN002', drugName: 'Amoxicillin 250mg', type: 'purchase', quantity: 50, amount: 125.75, date: '2024-01-14', status: 'completed' },
  { id: 'TXN003', drugName: 'Vitamin C 1000mg', type: 'sale', quantity: 5, amount: 12.25, date: '2024-01-14', status: 'completed' },
  { id: 'TXN004', drugName: 'Ibuprofen 400mg', type: 'return', quantity: -2, amount: -5.10, date: '2024-01-13', status: 'completed' },
  { id: 'TXN005', drugName: 'Metformin 500mg', type: 'adjustment', quantity: 25, amount: 0, date: '2024-01-13', status: 'completed' }
])

// Computed properties
const totalTransactions = computed(() => transactions.value.length)
const itemsSold = computed(() => transactions.value.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.quantity, 0))
const totalRevenue = computed(() => transactions.value.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0))
const lowStockItems = computed(() => 5) // This would come from actual inventory data

const filteredTransactions = computed(() => {
  let filtered = transactions.value

  if (transactionType.value !== 'all') {
    filtered = filtered.filter(t => t.type === transactionType.value)
  }

  // Add date filtering logic here based on dateRange

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.drugName.toLowerCase().includes(query) || 
      t.id.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Sample data for charts and analytics
const topSellingDrugs = computed(() => [
  { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', quantity: 150, revenue: 382.50 },
  { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics', quantity: 89, revenue: 223.75 },
  { id: 3, name: 'Vitamin C 1000mg', category: 'Supplements', quantity: 67, revenue: 167.50 },
  { id: 4, name: 'Ibuprofen 400mg', category: 'Pain Relief', quantity: 54, revenue: 135.00 },
  { id: 5, name: 'Metformin 500mg', category: 'Diabetes', quantity: 42, revenue: 105.00 }
])

const salesSummary = computed(() => ({
  totalSales: 1250.75,
  totalPurchases: 845.50,
  netProfit: 405.25
}))

const inventoryStatus = computed(() => ({
  totalItems: 245,
  lowStock: 12,
  outOfStock: 3
}))

const movementActivity = computed(() => ({
  todayTransactions: 23,
  itemsMoved: 156,
  avgDailySales: 45
}))

const stockAlerts = computed(() => [
  { id: 1, drugName: 'Aspirin 81mg', currentStock: 3, threshold: 10 },
  { id: 2, drugName: 'Omeprazole 20mg', currentStock: 5, threshold: 15 },
  { id: 3, drugName: 'Levothyroxine 50mcg', currentStock: 2, threshold: 8 }
])

const recentMovements = computed(() => [
  { id: 1, drugName: 'Paracetamol 500mg', type: 'sale', quantity: -10, newStock: 140, date: '2024-01-15' },
  { id: 2, drugName: 'Amoxicillin 250mg', type: 'purchase', quantity: 50, newStock: 189, date: '2024-01-14' },
  { id: 3, drugName: 'Vitamin C 1000mg', type: 'sale', quantity: -5, newStock: 62, date: '2024-01-14' },
  { id: 4, drugName: 'Ibuprofen 400mg', type: 'return', quantity: 2, newStock: 56, date: '2024-01-13' }
])

const performanceMetrics = computed(() => [
  { name: 'Sales Growth', description: 'Compared to last month', value: '+15%', trend: 15 },
  { name: 'Inventory Turnover', description: 'Items sold vs stocked', value: '2.8x', trend: 8 },
  { name: 'Customer Retention', description: 'Repeat customers', value: '78%', trend: 5 },
  { name: 'Profit Margin', description: 'Net profit percentage', value: '32%', trend: 3 }
])

const categorySales = computed(() => [
  { name: 'Pain Relief', amount: 450.25, percentage: 36, color: '#3B82F6' },
  { name: 'Antibiotics', amount: 320.50, percentage: 26, color: '#10B981' },
  { name: 'Supplements', amount: 280.75, percentage: 22, color: '#F59E0B' },
  { name: 'Other', amount: 199.25, percentage: 16, color: '#8B5CF6' }
])

const availableReports = computed(() => [
  {
    id: 1,
    title: 'Sales Report',
    description: 'Detailed sales analysis by product and category',
    icon: 'point_of_sale',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    lastGenerated: '2 days ago'
  },
  {
    id: 2,
    title: 'Inventory Report',
    description: 'Current stock levels and movement analysis',
    icon: 'inventory',
    iconBg: 'bg-green-500',
    iconColor: 'text-white',
    lastGenerated: '1 day ago'
  },
  {
    id: 3,
    title: 'Profit & Loss',
    description: 'Revenue, costs and profitability analysis',
    icon: 'trending_up',
    iconBg: 'bg-purple-500',
    iconColor: 'text-white',
    lastGenerated: '3 days ago'
  }
])

// Methods
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

function applyFilters() {
  console.log('Filters applied:', { dateRange: dateRange.value, transactionType: transactionType.value })
}

function resetFilters() {
  dateRange.value = 'month'
  transactionType.value = 'all'
  searchQuery.value = ''
  customStartDate.value = ''
  customEndDate.value = ''
}

onMounted(() => {
  console.log('Drug Movement Summary page loaded')
})
</script>

<style scoped>
.container {
  max-width: 100%;
}
</style>