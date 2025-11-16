<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900">Stock Update</h1>
      <button 
        @click="$emit('go-back')" 
        class="flex items-center text-blue-600 hover:text-blue-800"
      >
        <span class="material-icons mr-1">arrow_back</span> Back
      </button>
    </div>

   <!-- Filters --> 
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Item</label>
          <input 
            type="text"
            v-model="filters.item"
            class="w-full border rounded-lg px-3 py-2 text-sm outline-none"
            placeholder="Search by name..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            v-model="filters.category"
            class="w-full border rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat">{{ cat }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
          <select 
            v-model="filters.status"
            class="w-full border rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="">All</option>
            <option value="low">Low Stock</option>
            <option value="adequate">Adequate</option>
            <option value="good">Good</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            class="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
            @click="applyFilters"
          >
            Apply
          </button>
          <button 
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
            @click="resetFilters"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Level</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                class="text-blue-600 hover:text-blue-800 mr-3"
                @click="editStock(item)"
              >
                <span class="material-icons text-sm">edit</span>
              </button>
              <button 
                class="text-green-600 hover:text-green-800"
                @click="restockItem(item)"
              >
                <span class="material-icons text-sm">add</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="flex justify-between items-center p-4 bg-gray-50 border-t">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
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
          <button class="px-4 py-2 bg-gray-200 rounded-lg" @click="showModal = false">Cancel</button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="updateStock">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const stockItems = ref([
  { id: 1, name: "Paracetamol 500mg", category: "Pain Relief", currentStock: 150, minLevel: 50 },
  { id: 2, name: "Amoxicillin 250mg", category: "Antibiotics", currentStock: 75, minLevel: 30 },
  { id: 3, name: "Vitamin C 1000mg", category: "Supplements", currentStock: 20, minLevel: 40 },
  { id: 4, name: "Ibuprofen 400mg", category: "Pain Relief", currentStock: 15, minLevel: 25 },
  { id: 5, name: "Metformin 500mg", category: "Diabetes", currentStock: 120, minLevel: 35 },
  { id: 6, name: "Azithromycin 500mg", category: "Antibiotics", currentStock: 80, minLevel: 40 },
  { id: 7, name: "Cetrizine 10mg", category: "Allergy", currentStock: 55, minLevel: 20 },
  { id: 8, name: "Loratadine 10mg", category: "Allergy", currentStock: 35, minLevel: 15 },
  { id: 9, name: "Prednisolone 5mg", category: "Steroids", currentStock: 45, minLevel: 30 },
  { id: 10, name: "Omeprazole 20mg", category: "Acidity", currentStock: 25, minLevel: 10 },
]);

const categories = ref(["Pain Relief", "Antibiotics", "Supplements", "Diabetes", "Allergy", "Steroids", "Acidity"]);

const filters = ref({ item: "", category: "", status: "" });

// Pagination
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredItems = computed(() => {
  return stockItems.value.filter(item => {
    const matchesName = filters.value.item 
      ? item.name.toLowerCase().includes(filters.value.item.toLowerCase())
      : true;
    const matchesCategory = filters.value.category 
      ? item.category === filters.value.category
      : true;
    const matchesStatus = filters.value.status
      ? getStockStatus(item).toLowerCase() === filters.value.status
      : true;
    return matchesName && matchesCategory && matchesStatus;
  });
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredItems.value.slice(start, start + itemsPerPage);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function getStockStatus(item) {
  if (item.currentStock <= item.minLevel) return "Low";
  if (item.currentStock <= item.minLevel * 2) return "Adequate";
  return "Good";
}

function applyFilters() {
  currentPage.value = 1;
}
function resetFilters() {
  filters.value = { item: "", category: "", status: "" };
  currentPage.value = 1;
}

const showModal = ref(false);
const selectedItem = ref({});
const adjustmentType = ref("add");
const adjustmentQuantity = ref(0);

function editStock(item) {
  selectedItem.value = { ...item };
  showModal.value = true;
}

function restockItem(item) {
  selectedItem.value = { ...item };
  adjustmentType.value = "add";
  adjustmentQuantity.value = 10;
  showModal.value = true;
}

function updateStock() {
  const index = stockItems.value.findIndex(i => i.id === selectedItem.value.id);
  if (index === -1) return;

  let quantity = Number(adjustmentQuantity.value);
  if (adjustmentType.value === "add") stockItems.value[index].currentStock += quantity;
  if (adjustmentType.value === "subtract") stockItems.value[index].currentStock -= quantity;
  if (adjustmentType.value === "set") stockItems.value[index].currentStock = quantity;

  showModal.value = false;
  adjustmentQuantity.value = 0;
}
</script>

<style scoped>
.container {
  max-width: 100%;
}
</style>
