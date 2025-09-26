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
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
        >
          <!-- Medicine Image -->
          <img
            :src="item.image"
            :alt="item.name"
            class="w-full h-28 object-contain mb-3"
          />

          <!-- Medicine Info -->
          <div>
            <h3 class="font-semibold text-red-600">{{ item.name }}</h3>
            <p class="text-sm text-gray-500">{{ item.note }}</p>
            <p class="text-xs text-gray-400 mt-1">
              Category: <span class="font-medium">{{ item.category }}</span>
            </p>
            <p class="text-xs text-gray-400">
              Supplier: <span class="font-medium">{{ item.supplier }}</span>
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
          <span class="material-icons text-blue-600 flex item-center"> Current Sale</span>
         
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

      <!-- Overall Totals -->
      <div class="p-4 border-t bg-gradient-to-r from-blue-50 to-blue-100 space-y-2">
        <div class="flex justify-between">
          <span class="font-medium text-gray-700">Total Items:</span>
          <span class="font-bold text-gray-900">{{ totalItems }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium text-gray-700">Total Amount:</span>
          <span class="font-bold text-green-700 text-lg">Rs. {{ totalAmount }}</span>
        </div>
         <!-- Supplier Selection -->
<div class="flex justify-between items-center mb-3">
  <label class="font-medium text-gray-700">Creditor:</label>
  <select 
    v-model="selectedSupplier" 
    class="border rounded px-2 py-1 text-gray-700"
  >
    <option 
      v-for="supplier in suppliers" 
      :key="supplier" 
      :value="supplier"
    >
      {{ supplier }}
    </option>
  </select>
</div> 
       <button
          class="w-full bg-gray-200 hover:bg-gray-200 text-white py-2 rounded-lg shadow-md transition"
          :disabled="cart.length === 2"
        >
         <span class="text-black">CASH</span>
         
        </button>
      

        <button
          class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow-md transition"
          :disabled="cart.length === 0"
        >
          🧾 Print Bill
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, name: 'Adhesive Bandages', category: 'First Aid', price: 300, stock: 73, supplier: 'HealthCorp', note: 'Flexible bandages for cuts and scrapes.', image: 'https://via.placeholder.com/100x80?text=Bandage' },
  { id: 2, name: 'Allergy Relief Tabs', category: 'Allergy', price: 899, stock: 25, supplier: 'MediLife', note: 'Relief from allergy symptoms like sneezing.', image: 'https://via.placeholder.com/100x80?text=Allergy' },
  { id: 3, name: 'Amoxicillin 250mg', category: 'Antibiotics', price: 1200, stock: 19, supplier: 'PharmaPlus', note: 'Antibiotic for bacterial infections.', image: 'https://via.placeholder.com/100x80?text=Amoxicillin' },
  { id: 4, name: 'Vitamin C', category: 'Vitamins', price: 500, stock: 40, supplier: 'NutriHealth', note: 'Boosts immune system and energy.', image: 'https://via.placeholder.com/100x80?text=Vitamin+C' },
  { id: 5, name: 'Paracetamol', category: 'Pain Relief', price: 150, stock: 60, supplier: 'MediLife', note: 'Reduces fever and relieves pain.', image: 'https://via.placeholder.com/100x80?text=Paracetamol' }
])

const searchQuery = ref('')
const selectedCategory = ref('')
const cart = ref([])

// Categories
const categories = computed(() => [...new Set(items.value.map(i => i.category))])

// Filtered Items
const filteredItems = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase()
  return items.value.filter(i => {
    const name = i.name.toLowerCase()
    const note = i.note.toLowerCase()
    const category = i.category.toLowerCase()
    const supplier = i.supplier.toLowerCase()
    const priceStr = String(i.price)
    const matchesSearch = !q || name.includes(q) || note.includes(q) || category.includes(q) || supplier.includes(q) || priceStr.includes(q)
    const matchesCategory = !selectedCategory.value || selectedCategory.value === '' || i.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Add to cart
function addToCart(item) {
  const existing = cart.value.find(c => c.id === item.id)
  if (existing) existing.qty += 1
  else cart.value.push({ ...item, qty: 1 })
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
</script>
