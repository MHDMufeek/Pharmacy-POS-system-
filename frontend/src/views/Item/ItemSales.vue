<template>
  <div class="flex h-screen bg-gray-50 dark:bg-slate-900 dark:text-white">
    <!-- Left: Item Grid -->
    <div class="flex-1 p-6 overflow-y-auto">
      <!-- Notifications -->
      <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <div v-for="n in notifications" :key="n.id" class="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 px-4 py-2 rounded shadow-sm max-w-sm dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300">
          {{ n.message }}
        </div>
      </div>
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-blue-900 mb-2 dark:text-blue-300">Waiting List</h1>
        <h1 class="text-2xl font-bold text-blue-900 mb-4 dark:text-blue-300">Medicines</h1>

        <!-- Search + Category Filter -->
        <div class="flex flex-col gap-3">
          <!-- Search -->
          <div class="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-72 dark:bg-slate-700 dark:text-gray-200">
            <span class="material-icons text-gray-400 mr-2 dark:text-gray-300">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, category, note, supplier or price..."
              class="bg-transparent outline-none w-full text-sm dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>

          <!-- Category Buttons -->
          <div class="flex flex-wrap gap-2">
            <!-- "All" button -->
            <button
              @click="selectedCategory = ''"
              :class="buttonClass('')"
            >
              All
            </button>

            <!-- Each category -->
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              :class="buttonClass(cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>

    <!-- Item Details Modal: minimal stable version (reverted) -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 text-white dark:bg-black/60">
      <div class="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-y-auto dark:bg-slate-800 dark:text-white">
        <h3 class="text-lg font-semibold mb-4 dark:text-white">Product Details</h3>
        <div class="space-y-3 text-sm text-gray-700 dark:text-gray-200">
          <div>
            <span class="text-gray-600 dark:text-gray-300">Name:</span>
            <div class="font-medium dark:text-white">{{ selectedItem.name }}</div>
          </div>
          <div v-if="selectedItem.genericName">
            <span class="text-gray-600 dark:text-gray-300">Generic Name:</span>
            <div class="font-medium dark:text-white">{{ selectedItem.genericName }}</div>
          </div>
          <div v-if="selectedItem.manufacturer">
            <span class="text-gray-600">Brand Name:</span>
            <div class="font-medium">{{ selectedItem.manufacturer }}</div>
          </div>
          <div>
            <span class="text-gray-600">Category:</span>
            <div class="font-medium">{{ selectedItem.category }}</div>
          </div>
          <div>
            <span class="text-gray-600">Code:</span>
            <div class="font-medium">{{ selectedItem.code || selectedItem.sku || selectedItem.id || selectedItem._id || '—' }}</div>
          </div>
          <div>
            <span class="text-gray-600">Stock:</span>
            <div class="font-medium">{{ formatStockDisplay(selectedItem.stock ?? selectedItem.currentStock ?? selectedItem.quantity) }}</div>
          </div>
          <div v-if="selectedItem.metadata?.dose || selectedItem.dose">
            <span class="text-gray-600">Dose Form:</span>
            <div class="font-medium">{{ selectedItem.metadata?.dose || selectedItem.dose }}</div>
          </div>
          <div v-if="selectedItem.metadata?.packageSize || selectedItem.packageSize">
            <span class="text-gray-600">Package Size:</span>
            <div class="font-medium">{{ selectedItem.metadata?.packageSize || selectedItem.packageSize }}</div>
          </div>
          <div v-if="selectedItem.expiryDate || selectedItem.expiry">
            <span class="text-gray-600">Expiry:</span>
            <div class="font-medium">{{ selectedItem.expiryDate || selectedItem.expiry }}</div>
          </div>
          <div v-if="selectedItem.supplier">
            <span class="text-gray-600">Supplier:</span>
            <div class="font-medium">{{ resolveSupplier(selectedItem.supplier) }}</div>
          </div>
          <div v-if="selectedItem.description">
            <span class="text-gray-600">Description:</span>
            <div class="font-medium">{{ selectedItem.description }}</div>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="showDetailsModal = false">Close</button>
        </div>
      </div>
    </div>

      <!-- Medicines Grid -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-300">Loading items...</div>
      </div>
      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-500 dark:text-red-300">{{ error }}</div>
        <button @click="fetchItems" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Retry</button>
      </div>
      <div v-else-if="filteredItems.length === 0" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-400">No items found</div>
      </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="item in filteredItems"
          :key="item._id"
          class="bg-white rounded-lg shadow p-4 flex flex-col justify-between cursor-pointer h-full text-left dark:bg-slate-800 dark:border dark:border-slate-700 dark:text-white"
          @click="viewItem(item)"
        >
          <!-- Medicine Image -->
          <div class="h-32 w-full bg-gradient-to-br from-gray-50 to-white rounded-md overflow-hidden mb-3 flex items-center justify-center border border-gray-200/50 dark:from-slate-700 dark:to-slate-800 dark:border-slate-700/30">
            <img
              :src="item.image || 'https://via.placeholder.com/160x120?text=No+Image'"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Medicine Info -->
          <div class="flex-1">
            <h3 class="font-bold text-red-600 text-left truncate dark:text-red-400">{{ item.name }}</h3>
            <p v-if="item.genericName" class="text-sm text-gray-500 dark:text-gray-300">Generic: <span class="font-bold">{{ item.genericName }}</span></p>
            <p v-if="item.description" class="text-sm text-gray-500 truncate dark:text-gray-300">{{ item.description }}</p>
            <p class="text-xs text-gray-400 mt-1 dark:text-gray-400">
              Category: <span class="font-bold">{{ item.category || 'N/A' }}</span>
            </p>
            <p v-if="item.supplier" class="text-xs text-gray-400 mt-1 dark:text-gray-400">
              Supplier: <span class="font-bold">{{ resolveSupplier(item.supplier) }}</span>
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-400">
              Stock: <span class="font-bold">{{ formatStockDisplay(item.stock ?? item.currentStock ?? item.quantity) }}</span>
            </p>
          </div>

          <!-- Price + Add Button -->
          <div class="flex justify-between items-center mt-4">
            <p class="text-red-600 font-bold">Rs. {{ item.price }}</p>
            <button 
              @click.stop="addToCart(item)"
              :disabled="(Number(item.stock ?? item.currentStock ?? item.quantity ?? 0) <= 0)"
              :class="[
                (Number(item.stock ?? item.currentStock ?? item.quantity ?? 0) <= 0)
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-slate-700 dark:text-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700',
                'px-3 py-1 rounded-md text-sm'
              ]"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Cart / Selected Items -->
    <div class="w-80 bg-white shadow-xl border-l flex flex-col dark:bg-slate-800 dark:border-slate-700 dark:text-white">
      <!-- Header -->
      <div class="p-4 border-b bg-blue-50 dark:bg-slate-800 dark:border-b dark:border-slate-700">
        <h2 class="text-lg font-bold text-blue-900 flex items-center gap-2 dark:text-blue-300">
          <span class="material-icons text-blue-600 dark:text-blue-300">shopping_cart</span>
          Current Sale
        </h2>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-if="cart.length > 0">
          <div
            v-for="cartItem in cart"
            :key="cartItem.id"
            class="bg-gray-50 border rounded-lg p-3 flex flex-col shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          >
            <!-- Item Info -->
            <div class="flex justify-between items-center">
              <div>
                <p class="font-semibold text-gray-800 dark:text-white">{{ cartItem.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-300">Rs. {{ cartItem.price }} × {{ cartItem.qty }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-400">Supplier: <span class="font-bold">{{ resolveSupplier(cartItem.supplier) }}</span></p>
              </div>

              <!-- Controls -->
              <div class="flex items-center gap-1">
                <button
                  @click="updateQty(cartItem, -1)"
                  class="bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-800/40"
                >-</button>
                <span class="font-bold text-gray-700 dark:text-white w-6 text-center">{{ cartItem.qty }}</span>
                <button
                  @click="updateQty(cartItem, 1)"
                  class="bg-green-100 text-green-600 px-2 py-1 rounded-md hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-800/40"
                >+</button>
                <button
                  @click="removeFromCart(cartItem.id)"
                  class="ml-1 text-gray-400 hover:text-red-600"
                >
                  <span class="material-icons text-base">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center italic dark:text-gray-400">🛒 No Items Selected</p>
      </div>

      <!-- Category Summary -->
      <div v-if="cart.length > 0" class="p-4 border-t bg-gray-50 dark:bg-slate-800">
        <h3 class="text-sm font-semibold text-blue-900 mb-2 dark:text-blue-300">Category Summary</h3>
        <div
          v-for="(cat, name) in categorySummary"
          :key="name"
          class="flex justify-between text-sm mb-1"
        >
          <span class="text-gray-700">{{ name }} ({{ cat.qty }})</span>
          <span class="font-medium text-blue-700">Rs. {{ cat.amount }}</span>
        </div>
      </div>

      <!-- Payment Section -->
      <div v-if="cart.length > 0" class="p-4 border-t bg-white dark:bg-slate-800">
        <h3 class="text-sm font-semibold text-blue-900 mb-3 dark:text-blue-300">Payment Method</h3>
        
        <!-- Payment Method Selection -->
        <div class="grid grid-cols-2 gap-2 mb-4">
          <button
            @click="selectedPaymentMethod = 'cash'"
            :class="paymentMethodClass('cash')"
          >
            💵 Cash
          </button>
          <button
            @click="selectedPaymentMethod = 'credit'"
            :class="paymentMethodClass('credit')"
          >
            📝 Credit
          </button>
        </div>

        <!-- Payment Details based on selected method -->
        <div v-if="selectedPaymentMethod === 'cash'" class="space-y-3">
          <div class="flex flex-col sm:flex-row justify-between items-center">
            <label class="text-sm font-medium text-gray-700 mb-2 sm:mb-0 dark:text-gray-300">Amount Paid:</label>
            <input
              v-model.number="amountPaid"
              type="number"
              min="0"
              step="0.01"
              class="w-full sm:w-40 border rounded px-2 py-1 text-sm text-right dark:bg-slate-700 dark:text-white dark:border-slate-600"
              placeholder="0.00"
            />
          </div>
          <div v-if="Number(amountPaid) > 0" class="flex justify-between items-center text-sm">
            <span class="font-medium text-gray-700">Change:</span>
            <span class="font-bold text-green-600">Rs. {{ (Number(amountPaid) - totalAmount).toFixed(2) }}</span>
          </div>
        </div>

        

        <!-- Credit Payment Details -->
        <div v-if="selectedPaymentMethod === 'credit'" class="space-y-3">
          <div class="flex justify-between items-center mb-3">
            <label class="text-sm font-medium text-gray-700">Creditor:</label>
             <option value="">Select Creditor</option>
            <select 
              v-model="selectedSupplier" 
              class="border rounded px-2 py-1 text-sm bg-white text-black dark:bg-slate-700 dark:text-white dark:border-slate-600"
            >
             
              <option v-for="c in creditors" :key="c._id" :value="c.name">{{ c.name }}</option>
            </select>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded p-3 dark:bg-yellow-900/20 dark:border-yellow-700">
            <p class="text-xs text-yellow-800 text-center dark:text-yellow-200">
              💡 This sale will be recorded as credit
            </p>
          </div>
        </div>

        
      </div>

      <!-- Overall Totals -->
      <div class="p-4 border-t bg-gradient-to-r from-blue-50 to-blue-100 space-y-3 dark:from-slate-900 dark:to-slate-800">
        <div class="flex justify-between">
          <span class="font-medium text-gray-700 dark:text-gray-300">Total Items:</span>
          <span class="font-bold text-gray-900 dark:text-white">{{ totalItems }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium text-gray-700 dark:text-gray-300">Total Amount:</span>
          <span class="font-bold text-green-700 text-lg dark:text-green-400">Rs. {{ totalAmount }}</span>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 pt-2">
          <button
            @click="processPayment"
            :disabled="cart.length === 0 || (selectedPaymentMethod === 'cash' && ((Number(amountPaid) || 0) < totalAmount))"
            :class="[
              'w-full py-2 rounded-lg shadow-md transition font-medium',
              cart.length === 0 || (selectedPaymentMethod === 'cash' && amountPaid < totalAmount)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : getPaymentButtonClass()
            ]"
          >
            {{ getPaymentButtonText() }}
          </button>

          <button
            @click="clearCart"
            v-if="cart.length > 0"
            class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg shadow-md transition"
          >
            🗑️ Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
const token = localStorage.getItem('token')

const items = ref([])
const loading = ref(false)
const error = ref('')

// Supplier name cache (key: id, value: name)
const suppliersMap = ref({})

async function fetchSupplierName(id) {
  if (!id) return null
  try {
    const res = await axios.get(`${API_BASE}/suppliers/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    const name = (res.data && res.data.name) || null
    if (name) suppliersMap.value[id] = name
    return name
  } catch (err) {
    // ignore errors; leave id as fallback
    console.error('Failed to fetch supplier', id, err)
    return null
  }
}

function resolveSupplier(id) {
  if (!id) return ''
  const cached = suppliersMap.value[id]
  if (cached) return cached
  // trigger background fetch (no await) and return id as temporary fallback
  fetchSupplierName(id).catch(() => {})
  return id
}

const searchQuery = ref('')
const selectedCategory = ref('')
  const notifications = ref([])
const cart = ref([])
const router = useRouter()
const selectedPaymentMethod = ref('cash')
const amountPaid = ref(null)
const selectedSupplier = ref('HealthCorp')
const creditors = ref([])

// Fetch items from backend
const fetchItems = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await axios.get(`${API_BASE}/items`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    items.value = response.data.data || []
  } catch (err) {
    error.value = 'Failed to load items'
    console.error('Error fetching items:', err)
  } finally {
    loading.value = false
  }
}

// Load items on component mount
onMounted(() => {
  fetchItems()
  fetchCreditors()
})

// Fetch creditors from backend so the credit selector shows all creditors
async function fetchCreditors() {
  try {
    const res = await axios.get(`${API_BASE}/creditors`, { headers: { Authorization: `Bearer ${token}` } })
    creditors.value = (res.data && res.data.data) || []
    if (!selectedSupplier.value && creditors.value.length > 0) selectedSupplier.value = creditors.value[0].name
  } catch (err) {
    console.error('Failed to load creditors:', err)
  }
}

function formatStockDisplay(val) {
  const n = Number(val ?? 0)
  if (isNaN(n)) return 'N/A'
  return n <= 0 ? 'No stock available' : n
}

// Suppliers list (ensure selected supplier is included so the credit selector shows)
const suppliers = computed(() => {
  const list = items.value.map(i => i.supplier).filter(Boolean)
  const uniq = [...new Set(list)]
  if (selectedSupplier.value && !uniq.includes(selectedSupplier.value)) {
    uniq.unshift(selectedSupplier.value)
  }
  return uniq
})

// Categories
const categories = computed(() => [...new Set(items.value.map(i => i.category))])

// Filtered Items
const filteredItems = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase()
  return items.value.filter(i => {
    const name = (i.name || '').toLowerCase()
    const description = (i.description || '').toLowerCase()
    const category = (i.category || '').toLowerCase()
    const sku = (i.sku || '').toLowerCase()
    const priceStr = String(i.price || 0)
    const matchesSearch = !q || name.includes(q) || description.includes(q) || category.includes(q) || sku.includes(q) || priceStr.includes(q)
    const matchesCategory = !selectedCategory.value || selectedCategory.value === '' || i.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Add to cart
function addToCart(item) {
  const itemId = item._id || item.id
  const existing = cart.value.find(c => c.id === itemId)
  const stock = Number(item.stock ?? item.currentStock ?? item.quantity ?? 0)
  const inCartQty = existing ? existing.qty : 0

  if (isNaN(stock) ? false : stock <= 0) {
    const msg = `${item.name} — No stock available.`
    try { alert(msg) } catch (e) {}
    notifications.value.push({ id: Date.now() + Math.random(), message: msg, type: 'error' })
    setTimeout(() => { notifications.value = notifications.value.filter(n => n.message !== msg) }, 6000)
    return
  }

  if (inCartQty + 1 > stock) {
    const left = Math.max(0, stock - inCartQty)
    const msg = left <= 0 ? `${item.name} — No stock available.` : `${item.name} — only ${left} left in stock.`
    try { alert(msg) } catch (e) {}
    notifications.value.push({ id: Date.now() + Math.random(), message: msg, type: 'warning' })
    setTimeout(() => { notifications.value = notifications.value.filter(n => n.message !== msg) }, 6000)
    return
  }

  if (existing) {
    existing.qty += 1
  } else {
    const cartItem = { ...item, qty: 1, id: itemId }
    cart.value.push(cartItem)
  }
  // Low-stock check: estimate remaining after adding
  try {
    const stock = Number(item.stock ?? item.currentStock ?? item.quantity)
    const minLevel = Number(item.minLevel ?? (item.metadata && item.metadata.minLevel) ?? 0)
    if (!isNaN(stock)) {
      const inCart = cart.value.find(c => c.id === itemId)
      const remaining = stock - (inCart ? inCart.qty : 0)
      if (!isNaN(remaining) && remaining <= minLevel) {
        const msg = `${item.name} is low in stock (${remaining} left).`
        // browser alert
        try { alert(msg) } catch(e){}
        // in-app toast
        notifications.value.push({ id: Date.now() + Math.random(), message: msg, type: 'warning' })
        // auto-dismiss
        setTimeout(() => { notifications.value = notifications.value.filter(n => n.message !== msg) }, 6000)
      }
    }
  } catch (e) {
    // ignore
  }
}

function viewItem(item) {
  const id = item._id || item.id
  if (!id) return
  loadItemDetails(id)
}

const showDetailsModal = ref(false)
const selectedItem = ref({})

async function loadItemDetails(id) {
  showDetailsModal.value = false
  try {
    const res = await axios.get(`${API_BASE}/items/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    const body = res.data || {}
    selectedItem.value = {
      id: body._id || body.id,
      name: body.name,
      category: body.category || body.categoryName || '',
      description: body.description,
      genericName: body.genericName || body.generic || undefined,
      manufacturer: body.manufacturer || body.brand || body.company || undefined,
      supplier: body.supplier || undefined,
      image: body.image || body.imageUrl || undefined,
      stock: body.stock ?? body.currentStock ?? body.quantity,
      code: body.code || body.sku || undefined,
      expiryDate: body.expiryDate || body.expiry || undefined,
      metadata: body.metadata || {},
      price: body.price || body.sellingPrice || undefined,
      cost: body.cost || body.costPrice || undefined
    }
  } catch (err) {
    console.error('Failed to load item details', err)
    selectedItem.value = { name: 'Unknown' }
  } finally {
    showDetailsModal.value = true
  }
}

// Update quantity
function updateQty(cartItem, change) {
  cartItem.qty += change
    const stock = Number(cartItem.stock ?? cartItem.currentStock ?? cartItem.quantity ?? 0)
    const newQty = cartItem.qty + change

    if (change > 0 && !isNaN(stock) && newQty > stock) {
      const msg = stock <= 0 ? `No stock available.` : `Cannot set quantity. Only ${stock} available.`
      try { alert(msg) } catch (e) {}
      notifications.value.push({ id: Date.now() + Math.random(), message: msg, type: 'warning' })
      setTimeout(() => { notifications.value = notifications.value.filter(n => n.message !== msg) }, 6000)
      return
    }

    if (newQty <= 0) {
      cart.value = cart.value.filter(c => c.id !== cartItem.id)
      return
    }
    cartItem.qty = newQty
}

// Remove from cart
function removeFromCart(id) {
  cart.value = cart.value.filter(c => c.id !== id)
}

// Clear cart
function clearCart() {
  cart.value = []
  amountPaid.value = 0
  selectedPaymentMethod.value = 'cash'
}

// Process payment
async function processPayment() {
  if (cart.value.length === 0) return
  
  if (selectedPaymentMethod.value === 'cash' && amountPaid.value < totalAmount.value) {
    alert('Amount paid is less than total amount!')
    return
  }

  try {
    // Prepare sale data for backend
    const saleData = {
      items: cart.value.map(item => ({
        item: item._id || item.id, // Use _id for MongoDB items
        qty: item.qty
      })),
      paymentMethod: selectedPaymentMethod.value,
      customer: selectedPaymentMethod.value === 'credit' ? selectedSupplier.value : undefined
    }

    // Create sale in backend
    const response = await axios.post(`${API_BASE}/sales`, saleData, {
      headers: { Authorization: `Bearer ${token}` }
    })

    // If credit sale, ensure creditor record is created/updated
    if (selectedPaymentMethod.value === 'credit') {
      try {
        const creditorName = selectedSupplier.value
        // Search for existing creditor by name
        const searchRes = await axios.get(`${API_BASE}/creditors?q=${encodeURIComponent(creditorName)}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const matches = (searchRes.data && searchRes.data.data) || []
        const exact = matches.find(m => m.name === creditorName)
        const saleId = response.data && response.data._id
        const historyEntry = { amount: totalAmount.value, status: 'Pending', reference: saleId }

        if (exact) {
          const updated = {
            amount: (exact.amount || 0) + totalAmount.value,
            history: Array.isArray(exact.history) ? [...exact.history, historyEntry] : [historyEntry]
          }
          await axios.put(`${API_BASE}/creditors/${exact._id}`, updated, { headers: { Authorization: `Bearer ${token}` } })
        } else {
          const payload = { name: creditorName, amount: totalAmount.value, history: [historyEntry] }
          await axios.post(`${API_BASE}/creditors`, payload, { headers: { Authorization: `Bearer ${token}` } })
        }
      } catch (err) {
        console.error('Failed to create/update creditor:', err)
      }
    }

    alert(`Payment processed via ${selectedPaymentMethod.value.toUpperCase()}! Total: Rs. ${totalAmount.value}`)
    
    // Clear cart after successful payment
    clearCart()
    
    // Refresh items to show updated stock
    await fetchItems()
    
  } catch (err) {
    console.error('Payment processing failed:', err)
    alert('Payment processing failed. Please try again.')
  }
}

// Computed totals
const totalAmount = computed(() => cart.value.reduce((sum, i) => sum + i.price * i.qty, 0))
const categorySummary = computed(() => {
  const summary = {}
  cart.value.forEach(item => {
    if (!summary[item.category]) summary[item.category] = { qty: 0, amount: 0 }
    summary[item.category].qty += item.qty
    summary[item.category].amount += item.price * item.qty
  })
  return summary
})
const totalItems = computed(() => cart.value.reduce((sum, i) => sum + i.qty, 0))

// Category button classes
function buttonClass(cat) {
  return [
    'px-3 py-1 rounded-full text-sm',
    selectedCategory.value === cat
      ? 'bg-blue-600 text-white'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  ]
}

// Payment method button classes
function paymentMethodClass(method) {
  return [
    'py-2 rounded-lg text-sm font-medium transition-all',
    selectedPaymentMethod.value === method
      ? getPaymentMethodActiveClass(method)
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  ]
}

function getPaymentMethodActiveClass(method) {
  const classes = {
    cash: 'bg-green-600 text-white hover:bg-green-700',
    credit: 'bg-orange-600 text-white hover:bg-orange-700'
  }
  return classes[method] || 'bg-blue-600 text-white'
}

function getPaymentButtonClass() {
  const classes = {
    cash: 'bg-green-600 hover:bg-green-700 text-white',
    credit: 'bg-orange-600 hover:bg-orange-700 text-white'
  }
  return classes[selectedPaymentMethod.value] || 'bg-green-600 hover:bg-green-700 text-white'
}

function getPaymentButtonText() {
  const texts = {
    cash: `💵 Pay Rs. ${totalAmount.value}`,
    credit: `📝 Confirm Credit Sale`
  }
  return texts[selectedPaymentMethod.value] || `Pay Rs. ${totalAmount.value}`
}
</script>