<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Left: Item Grid -->
    <div class="flex-1 p-6 overflow-y-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-blue-900 mb-2">Waiting List</h1>
        <h1 class="text-2xl font-bold text-blue-900 mb-4">Medicines</h1>

        <!-- Search + Category Filter -->
        <div class="flex flex-col gap-3">
          <!-- Search -->
          <div class="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-72">
            <span class="material-icons text-gray-400 mr-2">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, category, note, supplier or price..."
              class="bg-transparent outline-none w-full text-sm"
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

      <!-- Medicines Grid -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500">Loading items...</div>
      </div>
      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-500">{{ error }}</div>
        <button @click="fetchItems" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Retry</button>
      </div>
      <div v-else-if="filteredItems.length === 0" class="text-center py-8">
        <div class="text-gray-500">No items found</div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="item in filteredItems"
          :key="item._id"
          class="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
        >
          <!-- Medicine Image -->
          <img
            :src="item.image || 'https://via.placeholder.com/100x80?text=No+Image'"
            :alt="item.name"
            class="w-full h-28 object-contain mb-3"
          />

          <!-- Medicine Info -->
          <div>
            <h3 class="font-semibold text-red-600">{{ item.name }}</h3>
            <p v-if="item.genericName" class="text-sm text-gray-500">Generic: <span class="font-medium">{{ item.genericName }}</span></p>
            <p v-if="item.description" class="text-sm text-gray-500">{{ item.description }}</p>
            <p class="text-xs text-gray-400 mt-1">
              Category: <span class="font-medium">{{ item.category || 'N/A' }}</span>
            </p>
            <p class="text-xs text-gray-400">
              Stock: <span class="font-medium">{{ item.stock }}</span>
            </p>
          </div>

          <!-- Price + Add Button -->
          <div class="flex justify-between items-center mt-4">
            <p class="text-red-600 font-bold">Rs. {{ item.price }}</p>
            <button 
              @click="addToCart(item)"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Cart / Selected Items -->
    <div class="w-80 bg-white shadow-xl border-l flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b bg-blue-50">
        <h2 class="text-lg font-bold text-blue-900 flex items-center gap-2">
          <span class="material-icons text-blue-600">shopping_cart</span>
          Current Sale
        </h2>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-if="cart.length > 0">
          <div
            v-for="cartItem in cart"
            :key="cartItem.id"
            class="bg-gray-50 border rounded-lg p-3 flex flex-col shadow-sm"
          >
            <!-- Item Info -->
            <div class="flex justify-between items-center">
              <div>
                <p class="font-semibold text-gray-800">{{ cartItem.name }}</p>
                <p class="text-sm text-gray-500">Rs. {{ cartItem.price }} × {{ cartItem.qty }}</p>
                <p class="text-xs text-gray-400">Supplier: <span class="font-medium">{{ cartItem.supplier }}</span></p>
              </div>

              <!-- Controls -->
              <div class="flex items-center gap-1">
                <button
                  @click="updateQty(cartItem, -1)"
                  class="bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200"
                >-</button>
                <span class="font-bold text-gray-700 w-6 text-center">{{ cartItem.qty }}</span>
                <button
                  @click="updateQty(cartItem, 1)"
                  class="bg-green-100 text-green-600 px-2 py-1 rounded-md hover:bg-green-200"
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
        <p v-else class="text-gray-500 text-center italic">🛒 No Items Selected</p>
      </div>

      <!-- Category Summary -->
      <div v-if="cart.length > 0" class="p-4 border-t bg-gray-50">
        <h3 class="text-sm font-semibold text-blue-900 mb-2">Category Summary</h3>
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
      <div v-if="cart.length > 0" class="p-4 border-t bg-white">
        <h3 class="text-sm font-semibold text-blue-900 mb-3">Payment Method</h3>
        
        <!-- Payment Method Selection -->
        <div class="grid grid-cols-2 gap-2 mb-4">
          <button
            @click="selectedPaymentMethod = 'cash'"
            :class="paymentMethodClass('cash')"
          >
            💵 Cash
          </button>
          <button
            @click="selectedPaymentMethod = 'card'"
            :class="paymentMethodClass('card')"
          >
            💳 Card
          </button>
          <button
            @click="selectedPaymentMethod = 'credit'"
            :class="paymentMethodClass('credit')"
          >
            📝 Credit
          </button>
          <button
            @click="selectedPaymentMethod = 'upi'"
            :class="paymentMethodClass('upi')"
          >
            📱 UPI
          </button>
        </div>

        <!-- Payment Details based on selected method -->
        <div v-if="selectedPaymentMethod === 'cash'" class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Amount Paid:</span>
            <input
              v-model.number="amountPaid"
              type="number"
              min="0"
              :max="totalAmount"
              class="w-24 border rounded px-2 py-1 text-sm text-right"
              placeholder="0.00"
            />
          </div>
          <div v-if="amountPaid > 0" class="flex justify-between items-center text-sm">
            <span class="font-medium text-gray-700">Change:</span>
            <span class="font-bold text-green-600">Rs. {{ (amountPaid - totalAmount).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Card Payment Details -->
        <div v-if="selectedPaymentMethod === 'card'" class="space-y-3">
          <div>
            <label class="text-xs text-gray-600">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              class="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs text-gray-600">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                class="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="text-xs text-gray-600">CVV</label>
              <input
                type="text"
                placeholder="123"
                class="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Credit Payment Details -->
        <div v-if="selectedPaymentMethod === 'credit'" class="space-y-3">
          <div class="flex justify-between items-center mb-3">
            <label class="text-sm font-medium text-gray-700">Creditor:</label>
             <option value="">Select Creditor</option>
            <select 
              v-model="selectedSupplier" 
              class="border rounded px-2 py-1 text-sm text-black bg-white"
            >
             
              <option v-for="c in creditors" :key="c._id" :value="c.name">{{ c.name }}</option>
            </select>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p class="text-xs text-yellow-800 text-center">
              💡 This sale will be recorded as credit
            </p>
          </div>
        </div>

        <!-- UPI Payment Details -->
        <div v-if="selectedPaymentMethod === 'upi'" class="space-y-3">
          <div>
            <label class="text-xs text-gray-600">UPI ID</label>
            <input
              type="text"
              placeholder="username@upi"
              class="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded p-3">
            <p class="text-xs text-blue-800 text-center">
              📱 Scan QR code or enter UPI ID
            </p>
          </div>
        </div>
      </div>

      <!-- Overall Totals -->
      <div class="p-4 border-t bg-gradient-to-r from-blue-50 to-blue-100 space-y-3">
        <div class="flex justify-between">
          <span class="font-medium text-gray-700">Total Items:</span>
          <span class="font-bold text-gray-900">{{ totalItems }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium text-gray-700">Total Amount:</span>
          <span class="font-bold text-green-700 text-lg">Rs. {{ totalAmount }}</span>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 pt-2">
          <button
            @click="processPayment"
            :disabled="cart.length === 0 || (selectedPaymentMethod === 'cash' && amountPaid < totalAmount)"
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
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'
const token = localStorage.getItem('token')

const items = ref([])
const loading = ref(false)
const error = ref('')

const searchQuery = ref('')
const selectedCategory = ref('')
const cart = ref([])
const selectedPaymentMethod = ref('cash')
const amountPaid = ref(0)
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
  if (existing) {
    existing.qty += 1
  } else {
    const cartItem = { ...item, qty: 1, id: itemId }
    cart.value.push(cartItem)
  }
}

// Update quantity
function updateQty(cartItem, change) {
  cartItem.qty += change
  if (cartItem.qty <= 0) removeFromCart(cartItem.id)
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
    card: 'bg-blue-600 text-white hover:bg-blue-700',
    credit: 'bg-orange-600 text-white hover:bg-orange-700',
    upi: 'bg-purple-600 text-white hover:bg-purple-700'
  }
  return classes[method] || 'bg-blue-600 text-white'
}

function getPaymentButtonClass() {
  const classes = {
    cash: 'bg-green-600 hover:bg-green-700 text-white',
    card: 'bg-blue-600 hover:bg-blue-700 text-white',
    credit: 'bg-orange-600 hover:bg-orange-700 text-white',
    upi: 'bg-purple-600 hover:bg-purple-700 text-white'
  }
  return classes[selectedPaymentMethod.value] || 'bg-green-600 hover:bg-green-700 text-white'
}

function getPaymentButtonText() {
  const texts = {
    cash: `💵 Pay Rs. ${totalAmount.value}`,
    card: `💳 Pay with Card`,
    credit: `📝 Confirm Credit Sale`,
    upi: `📱 Pay with UPI`
  }
  return texts[selectedPaymentMethod.value] || `Pay Rs. ${totalAmount.value}`
}
</script>