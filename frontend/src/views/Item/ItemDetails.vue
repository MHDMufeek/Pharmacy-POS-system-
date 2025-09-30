<template>
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Item Details</h1>
        <button 
          @click="$router.back()" 
          class="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span class="material-icons mr-1">arrow_back</span>
          
        </button>
      </div>
  
      <!-- Search and Filter Section -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <span class="material-icons text-gray-400 mr-2">search</span>
              <input
                type="text"
                placeholder="Search items..."
                class="bg-transparent outline-none w-full text-sm"
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="flex gap-2">
            <select class="bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none">
              <option>All Categories</option>
              <option v-for="category in categories" :key="category">{{ category }}</option>
            </select>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
              <span class="material-icons text-sm mr-1">filter</span>
              
            </button>
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex justify-between mb-6">
        <div class="flex gap-2">
          <button 
            @click="showAddItemModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <span class="material-icons text-sm mr-1">add</span>
            New Item
          </button>
          <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
            <span class="material-icons text-sm mr-1">file_download</span>
            Download
          </button>
        </div>
        <div>
          <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors">
            <span class="material-icons text-sm mr-1">settings</span>
            
          </button>
        </div>
      </div>
  
      <!-- Items Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" class="rounded text-blue-600">
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
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
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="rounded text-blue-600">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span class="material-icons text-blue-600"></span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ item.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span :class="{'text-red-600 font-bold': item.stock < 10, 'text-green-600': item.stock >= 10}">
                  {{ item.stock }} units
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ item.price.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', 
                             item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3">
                  <span class="material-icons text-sm">edit</span>
                </button>
                <button class="text-red-600 hover:text-red-900">
                  <span class="material-icons text-sm">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of
                <span class="font-medium">97</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">previous</span>
                    <span class="material-icons">chevron_left</span>
                </a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">1</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">2</a>
                <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">3</a>
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">next</span>
                  <span class="material-icons">chevron_right</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Item Modal -->
      <div v-if="showAddItemModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b">
            <h2 class="text-xl font-bold text-gray-900">Add New Medicine</h2>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span class="material-icons">close</span>
            </button>
          </div>

          <!-- Modal Form -->
          <form @submit.prevent="submitForm" class="p-6 space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Item Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newItem.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter medicine name"
                >
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Category <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="newItem.category"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Category</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <!-- Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Price (Rs.) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="newItem.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                >
              </div>

              <!-- Stock Quantity -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="newItem.stock"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0"
                >
              </div>

              <!-- Supplier -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Supplier <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="newItem.supplier"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Supplier</option>
                  <option v-for="supplier in suppliers" :key="supplier" :value="supplier">
                    {{ supplier }}
                  </option>
                </select>
              </div>

              <!-- Expiry Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  v-model="newItem.expiryDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description / Notes
              </label>
              <textarea
                v-model="newItem.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter medicine description, usage instructions, or notes..."
              ></textarea>
            </div>

            <!-- Additional Information -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Dosage -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  v-model="newItem.dosage"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., 500mg"
                >
              </div>

              <!-- Manufacturer -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  v-model="newItem.manufacturer"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Manufacturer name"
                >
              </div>

              <!-- Batch Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Batch Number
                </label>
                <input
                  v-model="newItem.batchNumber"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Batch number"
                >
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div class="flex gap-4">
                <label class="inline-flex items-center">
                  <input
                    v-model="newItem.status"
                    type="radio"
                    value="Active"
                    class="text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    v-model="newItem.status"
                    type="radio"
                    value="Inactive"
                    class="text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Medicine Image
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <span class="material-icons text-gray-400 text-3xl mb-2">cloud_upload</span>
                    <p class="text-sm text-gray-500">
                      <span class="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p class="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input type="file" class="hidden" @change="handleImageUpload" accept="image/*">
                </label>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              >
                <span class="material-icons text-sm mr-2">save</span>
                Save Medicine
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  const searchQuery = ref('')
  const showAddItemModal = ref(false)
  
  // New item form data
  const newItem = ref({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    supplier: '',
    expiryDate: '',
    description: '',
    dosage: '',
    manufacturer: '',
    batchNumber: '',
    status: 'Active',
    image: null
  })
  
  // Sample data - in a real application, this would come from an API
  const items = ref([
    { id: 'MED001', name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 150, price: 5.99, status: 'Active' },
    { id: 'MED002', name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 75, price: 12.50, status: 'Active' },
    { id: 'MED003', name: 'Vitamin C 1000mg', category: 'Supplements', stock: 200, price: 8.75, status: 'Active' },
    { id: 'MED004', name: 'Ibuprofen 400mg', category: 'Pain Relief', stock: 8, price: 6.25, status: 'Active' },
    { id: 'MED005', name: 'Metformin 500mg', category: 'Diabetes', stock: 120, price: 15.30, status: 'Active' },
    { id: 'MED006', name: 'Atorvastatin 20mg', category: 'Cholesterol', stock: 95, price: 22.40, status: 'Active' },
    { id: 'MED007', name: 'Aspirin 81mg', category: 'Cardiac', stock: 0, price: 4.15, status: 'Inactive' },
    { id: 'MED008', name: 'Omeprazole 20mg', category: 'GI', stock: 60, price: 18.75, status: 'Active' },
    { id: 'MED009', name: 'Levothyroxine 50mcg', category: 'Hormones', stock: 45, price: 13.20, status: 'Active' },
    { id: 'MED010', name: 'Albuterol Inhaler', category: 'Respiratory', stock: 25, price: 28.50, status: 'Active' }
  ])
  
  const categories = ref(['Pain Relief', 'Antibiotics', 'Supplements', 'Diabetes', 'Cholesterol', 'Cardiac', 'GI', 'Hormones', 'Respiratory'])
  const suppliers = ref(['HealthCorp', 'MediLife', 'PharmaPlus', 'NutriHealth', 'Global Pharma', 'BioMed Solutions'])
  
  const filteredItems = computed(() => {
    if (!searchQuery.value) return items.value
    const query = searchQuery.value.toLowerCase()
    return items.value.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    )
  })
  
  // Generate unique ID for new items
  function generateItemId() {
    const lastId = items.value.length > 0 
      ? parseInt(items.value[items.value.length - 1].id.replace('MED', '')) 
      : 0
    return `MED${String(lastId + 1).padStart(3, '0')}`
  }
  
  // Handle form submission
  function submitForm() {
    // Create new item object
    const itemToAdd = {
      id: generateItemId(),
      ...newItem.value
    }
    
    // Add to items array
    items.value.push(itemToAdd)
    
    // Show success message
    alert('Medicine added successfully!')
    
    // Reset form and close modal
    resetForm()
    closeModal()
  }
  
  // Reset form data
  function resetForm() {
    newItem.value = {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      supplier: '',
      expiryDate: '',
      description: '',
      dosage: '',
      manufacturer: '',
      batchNumber: '',
      status: 'Active',
      image: null
    }
  }
  
  // Close modal
  function closeModal() {
    showAddItemModal.value = false
    resetForm()
  }
  
  // Handle image upload
  function handleImageUpload(event) {
    const file = event.target.files[0]
    if (file) {
      // In a real application, you would upload the file to a server
      // For now, we'll just store the file object
      newItem.value.image = file
      
      // You can also create a preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        // You can use this URL for preview
        console.log('Image preview URL:', e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Close modal on ESC key
  onMounted(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && showAddItemModal.value) {
        closeModal()
      }
    })
  })
  </script>
  
  <style scoped>
  .container {
    max-width: 100%;
  }
  </style>