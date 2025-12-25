<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900">Stock Update</h1>
      <div class="flex gap-2">
        <button 
          @click="showAddItemModal = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <span class="material-icons text-sm mr-1">add</span>
          Add New Item
        </button>
        
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase">Item</th>
            <th class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase">Category</th>
            <th class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase">Stock</th>
            <th class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase">Min Level</th>
            <th class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in paginatedItems" :key="item.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.category }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ item.currentStock }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.minLevel }}</td>
            <td class="px-6 py-4">
              <span 
                :class="[
                  'px-2 py-1 text-xs rounded-full font-medium',
                  getStockStatus(item) === 'Low' ? 'bg-red-100 text-red-700' :
                  getStockStatus(item) === 'Adequate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                ]"
              >
                {{ getStockStatus(item) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <button 
                class="text-yellow-600 hover:text-yellow-800 mr-3"
                @click="adjustStock(item)"
                title="Adjust Stock"
              >
                <span class="material-icons text-sm">swap_vert</span>
              </button>
              <button 
                class="text-purple-600 hover:text-purple-800"
                @click="showItemHistory(item)"
                title="View History"
              >
                <span class="material-icons text-sm">visibility</span>
              </button>
              <button 
                class="text-red-600 hover:text-red-800 ml-3"
                @click="confirmDeleteItem(item)"
                title="Delete Item"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="stockItems.length === 0" class="text-center py-12">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span class="material-icons text-gray-400 text-2xl">inventory_2</span>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No items found</h3>
        <p class="text-gray-500 mb-4">Add your first item to get started</p>
        <button 
          @click="showAddItemModal = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
        >
          <span class="material-icons text-sm mr-1">add</span>
          Add First Item
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="stockItems.length > itemsPerPage" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:justify-end items-center">
          <div class="sm:block hidden">
            <p class="text-sm text-gray-700">
              Showing 
              <span class="font-medium">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> 
              to 
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, stockItems.length) }}</span> 
              of
              <span class="font-medium">{{ stockItems.length }}</span> 
              results
            </p>
          </div>
          <div class="ml-4">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="prevPage"
                :disabled="currentPage === 1"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium',
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">Previous</span>
                <span class="material-icons text-base">chevron_left</span>
              </button>
              
              <!-- Page numbers -->
              <button 
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium',
                  page === currentPage 
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium',
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">Next</span>
                <span class="material-icons text-base">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Item Modal -->
    <div v-if="showAddItemModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Add New Inventory Item</h2>
            <p class="text-sm text-gray-600 mt-1">Complete all required fields</p>
          </div>
          <button 
            @click="showAddItemModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <form @submit.prevent="addNewItem" class="p-6 space-y-6">
          <!-- Basic Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Item Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newItem.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Paracetamol 500mg"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Category <span class="text-red-500">*</span>
                </label>
                <div class="flex items-center gap-2">
                  <select
                    v-model="newItem.category"
                    required
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                    @click="showAddCategory = !showAddCategory"
                  >
                    + Add
                  </button>
                </div>

                <div v-if="showAddCategory" class="mt-2 flex gap-2">
                  <input
                    v-model="newCategory"
                    type="text"
                    placeholder="New category"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button type="button" class="px-3 py-2 bg-green-600 text-white rounded-lg" @click="addCategory">
                    Save
                  </button>
                  <button type="button" class="px-3 py-2 bg-gray-200 rounded-lg" @click="cancelAddCategory">
                    Cancel
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  v-model="newItem.manufacturer"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., PharmaCorp"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Generic Name
                </label>
                <input
                  v-model="newItem.genericName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Paracetamol"
                >
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Image (PNG/JPEG/WebP)
                </label>
                <div class="flex items-start sm:items-center gap-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*,image/webp"
                        @change="handleImageChange"
                        class="block"
                      />
                      <input
                        v-model="imageUrl"
                        @input="onImageUrlInput"
                        type="url"
                        placeholder="Or enter image URL (optional)"
                        class="px-3 py-2 border border-gray-300 rounded-lg flex-1"
                      />
                    </div>
                    <div v-if="imageUrlError" class="text-red-600 text-sm mt-2">{{ imageUrlError }}</div>
                  </div>
                  <div class="w-20 h-20 bg-gray-50 rounded overflow-hidden border flex-shrink-0">
                    <img v-if="imagePreview" :src="imagePreview" alt="preview" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-300">No image</div>
                  </div>
                </div>
              </div>

              <!-- Item code is assigned automatically; hidden from the form -->
            </div>
          </div>

          <!-- Stock & Pricing -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Stock & Pricing</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Initial Stock <span class="text-red-500">*</span>
                  </label>
                  <div class="flex items-center">
                    <input
                      v-model.number="newItem.currentStock"
                      type="number"
                      min="0"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    >
                    <span class="ml-2 text-gray-600">units</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Level <span class="text-red-500">*</span>
                  </label>
                  <div class="flex items-center">
                    <input
                      v-model.number="newItem.minLevel"
                      type="number"
                      min="1"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                    >
                    <span class="ml-2 text-gray-600">units</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Level
                  </label>
                  <div class="flex items-center">
                    <input
                      v-model.number="newItem.maxLevel"
                      type="number"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1000"
                    >
                    <span class="ml-2 text-gray-600">units</span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Cost Price <span class="text-red-500">*</span>
                  </label>
                  <div class="flex items-center">
                    <span class="mr-2">Rs.</span>
                    <input
                      v-model.number="newItem.costPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price <span class="text-red-500">*</span>
                  </label>
                  <div class="flex items-center">
                    <span class="mr-2">Rs.</span>
                    <input
                      v-model.number="newItem.sellingPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    >
                  </div>
                </div>

                <div v-if="newItem.costPrice > 0 && newItem.sellingPrice > 0" class="bg-green-50 p-3 rounded-lg">
                  <div class="flex justify-between text-sm">
                    <span>Profit per unit:</span>
                    <span class="font-medium text-green-600">
                      Rs.{{ (newItem.sellingPrice - newItem.costPrice).toFixed(2) }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm mt-1">
                    <span>Profit margin:</span>
                    <span class="font-medium" :class="profitMargin >= 30 ? 'text-green-600' : 'text-yellow-600'">
                      {{ profitMargin.toFixed(1) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Supplier Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Supplier Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <select
                  v-model="newItem.supplier"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Supplier</option>
                  <option v-for="supplier in suppliers" :key="supplier._id || supplier.id" :value="supplier._id || supplier.id">
                    {{ supplier.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  v-model="newItem.expiryDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              @click="showAddItemModal = false"
              class="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
            >
              <span class="material-icons text-sm mr-2">save</span>
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Update Stock Modal -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">Update Stock</h3>
        <p class="mb-2 text-sm text-gray-700">Item: {{ selectedItem.name }}</p>
        <label class="block text-sm text-gray-700 mb-1">Adjustment Type</label>
        <select v-model="adjustmentType" class="w-full border rounded-lg px-3 py-2 text-sm mb-3">
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="set">Set Value</option>
        </select>
        <label class="block text-sm text-gray-700 mb-1">Quantity</label>
        <input 
          type="number"
          v-model="adjustmentQuantity"
          class="w-full border rounded-lg px-3 py-2 text-sm mb-4"
        />
        <div class="flex justify-end gap-2">
          <button class="px-4 py-2 bg-gray-200 rounded-lg" @click="showUpdateModal = false">Cancel</button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="updateStock">Save</button>
        </div>
      </div>
    </div>

    <!-- Item History Modal -->
    <div v-if="showHistoryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div class="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Stock History</h2>
            <p class="text-sm text-gray-600 mt-1">{{ selectedItem.name }} ({{ selectedItem.category }})</p>
            <p class="text-xs text-gray-500 mt-1">Current Stock: {{ selectedItem.currentStock }} units</p>
          </div>
          <button 
            @click="showHistoryModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="p-6">
          <!-- History Summary -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="bg-blue-100 p-2 rounded-lg mr-3">
                  <span class="material-icons text-blue-600">trending_up</span>
                </div>
                <div>
                  <p class="text-gray-500 text-xs">Total Added</p>
                  <p class="text-lg font-bold text-blue-600">{{ getTotalAdded }} units</p>
                </div>
              </div>
            </div>
            <div class="bg-red-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="bg-red-100 p-2 rounded-lg mr-3">
                  <span class="material-icons text-red-600">trending_down</span>
                </div>
                <div>
                  <p class="text-gray-500 text-xs">Total Used</p>
                  <p class="text-lg font-bold text-red-600">{{ getTotalUsed }} units</p>
                </div>
              </div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="bg-green-100 p-2 rounded-lg mr-3">
                  <span class="material-icons text-green-600">history</span>
                </div>
                <div>
                  <p class="text-gray-500 text-xs">Total Transactions</p>
                  <p class="text-lg font-bold text-green-600">{{ itemHistory.length }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- History Table -->
          <div class="overflow-y-auto max-h-[40vh]">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Stock</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Stock</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(history, index) in itemHistory" :key="index">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ formatDate(history.date) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 text-xs rounded-full font-medium',
                      history.type === 'Added' ? 'bg-green-100 text-green-800' :
                      history.type === 'Restocked' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    ]">
                      {{ history.type }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <span :class="history.quantity > 0 ? 'text-green-600' : 'text-red-600'">
                      {{ history.quantity > 0 ? '+' + history.quantity : history.quantity }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ history.previousStock }}</td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ history.newStock }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ history.performedBy }}</td>
                </tr>
              </tbody>
            </table>
            
            <!-- Empty History State -->
            <div v-if="itemHistory.length === 0" class="text-center py-8">
              <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <span class="material-icons text-gray-400">history</span>
              </div>
              <h3 class="text-md font-medium text-gray-900 mb-1">No history available</h3>
              <p class="text-gray-500 text-sm">No stock updates have been recorded for this item yet.</p>
            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t">
          <div class="flex justify-end">
            <button
              @click="showHistoryModal = false"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});

const stockItems = ref([]);

const categories = ref(["Pain Relief", "Antibiotics", "Supplements", "Diabetes", "Allergy", "Steroids", "Acidity", "Cold & Cough"]);
const suppliers = ref([]);

// Add New Item Modal
const showAddItemModal = ref(false);
const newItem = ref({
  name: "",
  category: "",
  manufacturer: "",
  code: "",
    image: "",
    genericName: "",
  currentStock: 0,
  minLevel: 10,
  maxLevel: "",
  costPrice: 0,
  sellingPrice: 0,
  supplier: "",
  expiryDate: ""
});

// Add category helper state
const showAddCategory = ref(false);
const newCategory = ref('');

function addCategory() {
  const name = (newCategory.value || '').trim();
  if (!name) {
    alert('Please enter a category name');
    return;
  }
  if (categories.value.includes(name)) {
    // select existing
    newItem.value.category = name;
    showAddCategory.value = false;
    newCategory.value = '';
    return;
  }
  categories.value.push(name);
  newItem.value.category = name;
  newCategory.value = '';
  showAddCategory.value = false;
}

function cancelAddCategory() {
  newCategory.value = '';
  showAddCategory.value = false;
}

// image file and preview for Add Item form
const imageFile = ref(null);
const imagePreview = ref("");
const imageUrl = ref("");
const imageUrlValid = ref(false);
const imageUrlError = ref("");

// Update Stock Modal
const showUpdateModal = ref(false);
const selectedItem = ref({});
const adjustmentType = ref("add");
const adjustmentQuantity = ref(0);

// History Modal
const showHistoryModal = ref(false);
const itemHistory = ref([]);

// Sample history data for demonstration
const stockHistory = ref({
  1: [
    { date: new Date('2024-01-15'), type: 'Added', quantity: 100, previousStock: 50, newStock: 150, performedBy: 'Admin' },
    { date: new Date('2024-01-10'), type: 'Used', quantity: -20, previousStock: 170, newStock: 150, performedBy: 'Nurse Sarah' },
    { date: new Date('2024-01-05'), type: 'Restocked', quantity: 50, previousStock: 120, newStock: 170, performedBy: 'Manager' },
    { date: new Date('2023-12-28'), type: 'Added', quantity: 70, previousStock: 50, newStock: 120, performedBy: 'Admin' },
  ],
  2: [
    { date: new Date('2024-01-14'), type: 'Restocked', quantity: 30, previousStock: 45, newStock: 75, performedBy: 'Manager' },
    { date: new Date('2024-01-08'), type: 'Used', quantity: -15, previousStock: 60, newStock: 45, performedBy: 'Doctor John' },
  ],
  3: [
    { date: new Date('2024-01-12'), type: 'Added', quantity: 50, previousStock: 0, newStock: 50, performedBy: 'Admin' },
    { date: new Date('2024-01-05'), type: 'Used', quantity: -30, previousStock: 50, newStock: 20, performedBy: 'Nurse Lisa' },
  ]
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => Math.ceil(stockItems.value.length / itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return stockItems.value.slice(start, start + itemsPerPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 3;
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let start = Math.max(1, currentPage.value - 1);
    let end = Math.min(totalPages.value, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

const profitMargin = computed(() => {
  if (newItem.value.costPrice <= 0) return 0;
  return ((newItem.value.sellingPrice - newItem.value.costPrice) / newItem.value.costPrice) * 100;
});

const getTotalAdded = computed(() => {
  return itemHistory.value
    .filter(h => h.quantity > 0)
    .reduce((sum, h) => sum + h.quantity, 0);
});

const getTotalUsed = computed(() => {
  return Math.abs(itemHistory.value
    .filter(h => h.quantity < 0)
    .reduce((sum, h) => sum + h.quantity, 0));
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function getStockStatus(item) {
  if (item.currentStock <= item.minLevel) return "Low";
  if (item.currentStock <= item.minLevel * 2) return "Adequate";
  return "Good";
}

// Item codes are now generated on the backend. No client-side generator required.

function handleImageChange(e) {
  const f = e.target.files && e.target.files[0];
  if (!f) {
    imageFile.value = null;
    // if user cleared file input, keep URL preview if provided
    imagePreview.value = imageUrl.value || "";
    return;
  }
  // accept common image types incl. webp
  if (!f.type.startsWith('image/')) {
    alert('Please select a valid image file');
    e.target.value = null;
    return;
  }
  imageFile.value = f;
  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.value = reader.result;
  };
  reader.readAsDataURL(f);
}

function onImageUrlInput() {
  // show URL preview only when no file selected
  if (!imageFile.value) {
    imagePreview.value = imageUrl.value || "";
  }
  imageUrlError.value = "";
  imageUrlValid.value = false;
  const url = (imageUrl.value || "").trim();
  if (!url) return;

  // Quick check: must look like an image URL or data URL
  if (!/^data:image\//.test(url) && !/\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url)) {
    // still try loading since some CDNs omit extension
  }

  // Attempt to load image to validate (works cross-origin for display)
  const img = new Image();
  img.onload = () => {
    imageUrlValid.value = true;
    imageUrlError.value = "";
    // only set preview if no file selected
    if (!imageFile.value) imagePreview.value = url;
  };
  img.onerror = () => {
    imageUrlValid.value = false;
    imageUrlError.value = 'Cannot load image from this URL. Use a direct image link (jpg/png/webp) or upload a file.';
    // clear preview if invalid
    if (!imageFile.value) imagePreview.value = "";
  };
  // start load
  img.src = url;
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function addNewItem() {
  if (!newItem.value.name || !newItem.value.category) {
    alert("Please fill in all required fields");
    return;
  }
  // send to backend
  (async () => {
    try {
      const payload = {
        name: newItem.value.name,
        category: newItem.value.category,
        genericName: newItem.value.genericName || undefined,
        price: newItem.value.sellingPrice || 0,
        cost: newItem.value.costPrice || 0,
        stock: Number(newItem.value.currentStock) || 0,
        supplier: newItem.value.supplier || undefined,
        metadata: { minLevel: Number(newItem.value.minLevel) || 10 }
      };
          // include image if provided (base64)
          // if a URL was entered ensure it was validated by loading
          if (!imageFile.value && imageUrl.value && !imageUrlValid.value) {
            alert('The provided image URL could not be loaded. Please provide a direct image URL or upload a file.');
            return;
          }
          if (imageFile.value) {
        try {
          const b64 = await toBase64(imageFile.value);
          if (b64) payload.image = b64;
        } catch (e) {
          console.warn('Failed to convert image to base64', e);
        }
      } else if (imageUrl.value) {
        // allow passing a remote image URL
        payload.image = imageUrl.value;
      }
      const res = await api.post('/items', payload);
      const created = res.data;
      // normalize for local view
      const display = {
        id: created._id,
        _id: created._id,
        name: created.name,
        category: created.category,
        currentStock: created.stock ?? created.currentStock ?? 0,
        minLevel: (created.metadata && created.metadata.minLevel) || created.minLevel || 0,
        ...created
      };
      stockItems.value.unshift(display);
      stockHistory.value[display.id] = [{ date: new Date(), type: 'Added', quantity: display.currentStock, previousStock: 0, newStock: display.currentStock, performedBy: 'You' }];
      newItem.value = { name: "", category: "", manufacturer: "", code: "", image: "", currentStock: 0, minLevel: 10, maxLevel: "", costPrice: 0, sellingPrice: 0, supplier: "", expiryDate: "" };
      imageFile.value = null;
      imagePreview.value = "";
      imageUrl.value = "";
      showAddItemModal.value = false;
      alert('Item added to database');
    } catch (e) {
      console.error('Create item failed', e);
      alert(e.response?.data?.message || 'Failed to create item');
    }
  })();
}

async function loadItems() {
  try {
    const res = await api.get('/items');
    const items = (res.data && res.data.data) || [];
    stockItems.value = items.map(it => ({
      id: it._id,
      _id: it._id,
      name: it.name,
      category: it.category,
      currentStock: it.stock ?? it.currentStock ?? 0,
      minLevel: (it.metadata && it.metadata.minLevel) || it.minLevel || 0,
      ...it
    }));
  } catch (e) {
    console.error('Failed to load items', e);
  }
}

// fetch suppliers from backend for the Add Item form
async function fetchSuppliers() {
  try {
    const res = await api.get('/suppliers');
    const list = (res.data && res.data.data) || [];
    suppliers.value = list;
    // set default supplier if not selected
    if (!newItem.value.supplier && suppliers.value.length > 0) {
      newItem.value.supplier = suppliers.value[0]._id || suppliers.value[0].id;
    }
  } catch (err) {
    console.error('Failed to load suppliers', err);
    // fallback to empty list
    suppliers.value = [];
  }
}

onMounted(loadItems);
onMounted(fetchSuppliers);

function adjustStock(item) {
  selectedItem.value = { ...item };
  adjustmentType.value = "add";
  adjustmentQuantity.value = 0;
  showUpdateModal.value = true;
}

function confirmDeleteItem(item) {
  selectedItem.value = { ...item };
  if (confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
    deleteItem();
  }
}

async function deleteItem() {
  const id = selectedItem.value._id || selectedItem.value.id;
  if (!id) return;
  try {
    await api.delete(`/items/${id}`);
    const index = stockItems.value.findIndex(i => (i._id || i.id) === id);
    if (index !== -1) stockItems.value.splice(index, 1);

    // Also remove from history cache
    if (stockHistory.value[id]) delete stockHistory.value[id];

    // Reset pagination if needed
    if (paginatedItems.value.length === 0 && currentPage.value > 1) currentPage.value--;

    alert('Item deleted successfully');
  } catch (e) {
    console.error('Delete failed', e);
    alert(e.response?.data?.message || 'Failed to delete item (check auth)');
  }
}

function showItemHistory(item) {
  selectedItem.value = { ...item };
  itemHistory.value = stockHistory.value[item.id] || [];
  showHistoryModal.value = true;
}

async function updateStock() {
  const index = stockItems.value.findIndex(i => i.id === selectedItem.value.id);
  if (index === -1) return;

  let quantity = Number(adjustmentQuantity.value);
  const previousStock = stockItems.value[index].currentStock;
  let newStock = previousStock;
  
  if (adjustmentType.value === "add") {
    newStock = stockItems.value[index].currentStock + quantity;
  } else if (adjustmentType.value === "subtract") {
    newStock = stockItems.value[index].currentStock - quantity;
    newStock = Math.max(0, newStock);
  } else if (adjustmentType.value === "set") {
    newStock = Math.max(0, quantity);
  }

  const id = stockItems.value[index]._id || stockItems.value[index].id;
  try {
    const res = await api.put(`/items/${id}`, { stock: newStock });
    // update local stock from server response when available
    const updated = res.data || {};
    stockItems.value[index].currentStock = updated.stock ?? updated.currentStock ?? newStock;

    // Add to history
    const historyEntry = {
      date: new Date(),
      type: adjustmentType.value === 'add' ? 'Restocked' : (adjustmentType.value === 'set' ? 'Set' : 'Used'),
      quantity: adjustmentType.value === 'add' ? quantity : (adjustmentType.value === 'set' ? newStock - previousStock : -quantity),
      previousStock: previousStock,
      newStock: stockItems.value[index].currentStock,
      performedBy: 'Admin'
    };

    if (!stockHistory.value[selectedItem.value.id]) {
      stockHistory.value[selectedItem.value.id] = [];
    }
    stockHistory.value[selectedItem.value.id].unshift(historyEntry);

    // Notify navbar and other listeners to refresh low-stock alerts
    try { window.dispatchEvent(new CustomEvent('low-stock-updated', { detail: { id, newStock: stockItems.value[index].currentStock } })); } catch(e) {}

    showUpdateModal.value = false;
    adjustmentQuantity.value = 0;
  } catch (e) {
    console.error('Failed to persist stock update', e);
    alert(e.response?.data?.message || 'Failed to update stock (check auth)');
    // reload items to restore consistent state
    await loadItems();
  }
}
</script>

<style scoped>
.container {
  max-width: 100%;
}
</style>