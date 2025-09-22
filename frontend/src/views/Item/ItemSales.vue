<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Left: Item Grid -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Medicines</h1>

        <!-- Search + Category -->
        <div class="flex items-center gap-4">
          <!-- Search -->
          <div class="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-72">
            <span class="material-icons text-gray-400 mr-2">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, category, note or price..."
              class="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <!-- Category Dropdown -->
          <select 
            v-model="selectedCategory"
            class="border rounded-lg px-3 py-2 text-sm text-gray-600"
          >
            <option value="">All Categories</option>
            <option 
              v-for="cat in categories" 
              :key="cat" 
              :value="cat"
            >
              {{ cat }}
            </option>
          </select>
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
            alt="medicine"
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
    <div class="w-80 bg-white shadow-lg border-l flex flex-col">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold text-blue-900">Current Sale</h2>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cart.length > 0">
          <div 
            v-for="cartItem in cart" 
            :key="cartItem.id" 
            class="flex justify-between items-center mb-3"
          >
            <div>
              <p class="font-medium text-red-600">{{ cartItem.name }}</p>
              <p class="text-sm text-red-500">Rs. {{ cartItem.price }} × {{ cartItem.qty }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="updateQty(cartItem, -1)"
                class="px-2 py-1 border rounded hover:bg-gray-100"
              >-</button>
              <span class="text-red-600 font-semibold">{{ cartItem.qty }}</span>
              <button 
                @click="updateQty(cartItem, 1)"
                class="px-2 py-1 border rounded hover:bg-gray-100"
              >+</button>
              <button 
                @click="removeFromCart(cartItem.id)"
                class="text-red-600 hover:text-red-800"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center">No items selected</p>
      </div>
      <div class="p-4 border-t">
        <div class="flex justify-between mb-3">
          <span class="font-medium">Total:</span>
          <span class="font-bold text-red-600">Rs. {{ totalAmount }}</span>
        </div>
        <button 
          class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
          :disabled="cart.length === 0"
        >
          Print Bill
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, name: 'Adhesive Bandages', category: 'First Aid', price: 300, stock: 73, note: 'Flexible bandages for cuts and scrapes.', image: 'https://via.placeholder.com/100x80?text=Bandage' },
  { id: 2, name: 'Allergy Relief Tabs', category: 'Allergy', price: 899, stock: 25, note: 'Relief from allergy symptoms like sneezing.', image: 'https://via.placeholder.com/100x80?text=Allergy' },
  { id: 3, name: 'Amoxicillin 250mg', category: 'Antibiotics', price: 1200, stock: 19, note: 'Antibiotic for bacterial infections.', image: 'https://via.placeholder.com/100x80?text=Amoxicillin' },
  { id: 4, name: 'Vitamin C', category: 'Vitamins', price: 500, stock: 40, note: 'Boosts immune system and energy.', image: 'https://via.placeholder.com/100x80?text=Vitamin+C' },
  { id: 5, name: 'Paracetamol', category: 'Pain Relief', price: 150, stock: 60, note: 'Reduces fever and relieves pain.', image: 'https://via.placeholder.com/100x80?text=Paracetamol' }
])

const searchQuery = ref('')
const selectedCategory = ref('')
const cart = ref([])

const categories = computed(() => {
  return [...new Set(items.value.map(i => i.category))]
})

const filteredItems = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase()

  return items.value.filter(i => {
    // safe field extraction
    const name = (i.name || '').toLowerCase()
    const note = (i.note || '').toLowerCase()
    const category = (i.category || '').toLowerCase()
    const priceStr = String(i.price || '')

    // search matches if q is empty OR any field contains q
    const matchesSearch =
      q === '' ||
      name.includes(q) ||
      note.includes(q) ||
      category.includes(q) ||
      priceStr.includes(q)

    // category filter (keeps dropdown separate)
    const matchesCategory =
      !selectedCategory.value || selectedCategory.value === '' || i.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

function addToCart(item) {
  const existing = cart.value.find(c => c.id === item.id)
  if (existing) {
    existing.qty += 1
  } else {
    cart.value.push({ ...item, qty: 1 })
  }
}

function updateQty(cartItem, change) {
  cartItem.qty += change
  if (cartItem.qty <= 0) {
    removeFromCart(cartItem.id)
  }
}

function removeFromCart(id) {
  cart.value = cart.value.filter(c => c.id !== id)
}

const totalAmount = computed(() => {
  return cart.value.reduce((sum, i) => sum + i.price * i.qty, 0)
})
</script>
