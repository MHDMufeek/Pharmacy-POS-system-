<template>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Item Category Management</h1>
        <button 
          @click="showAddForm = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <span class="material-icons">add</span>
          Add Category
        </button>
      </div>
  
      <!-- Search and Filter -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <span class="material-icons text-gray-400 mr-2">search</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search categories..."
                class="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>
          <div class="w-full md:w-48">
            <select v-model="statusFilter" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Categories Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-blue-50">
            <tr>
              <th class="py-3 px-4 text-left text-blue-900 font-semibold">Category Name</th>
              <th class="py-3 px-4 text-left text-blue-900 font-semibold">Description</th>
              <th class="py-3 px-4 text-left text-blue-900 font-semibold">Items Count</th>
              <th class="py-3 px-4 text-left text-blue-900 font-semibold">Status</th>
              <th class="py-3 px-4 text-left text-blue-900 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="category in filteredCategories" :key="category.id">
              <td class="py-3 px-4">{{ category.name }}</td>
              <td class="py-3 px-4">{{ category.description }}</td>
              <td class="py-3 px-4">{{ category.itemsCount }}</td>
              <td class="py-3 px-4">
                <span 
                  :class="{
                    'bg-green-100 text-green-800': category.status === 'active',
                    'bg-red-100 text-red-800': category.status === 'inactive'
                  }" 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ category.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="editCategory(category)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    <span class="material-icons text-sm">edit</span>
                  </button>
                  <button 
                    @click="deleteCategory(category.id)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <span class="material-icons text-sm">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredCategories.length === 0">
              <td colspan="5" class="py-6 px-4 text-center text-gray-500">
                No categories found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Add/Edit Category Modal -->
      <div v-if="showAddForm || editingCategory" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
          <div class="p-6 border-b">
            <h2 class="text-xl font-semibold text-blue-900">
              {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
            </h2>
          </div>
          <div class="p-6">
            <form @submit.prevent="saveCategory">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  v-model="currentCategory.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  v-model="currentCategory.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  v-model="currentCategory.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div class="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {{ editingCategory ? 'Update' : 'Save' }}
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
  
  // Sample data for demonstration
  const sampleCategories = [
    { id: 1, name: 'Medicines', description: 'All types of medicines', itemsCount: 125, status: 'active' },
    { id: 2, name: 'Medical Equipment', description: 'Surgical and diagnostic equipment', itemsCount: 78, status: 'active' },
    { id: 3, name: 'Supplements', description: 'Vitamins and dietary supplements', itemsCount: 92, status: 'active' },
    { id: 4, name: 'Discontinued', description: 'Items no longer in use', itemsCount: 15, status: 'inactive' }
  ]
  
  const categories = ref([])
  const searchQuery = ref('')
  const statusFilter = ref('all')
  const showAddForm = ref(false)
  const editingCategory = ref(null)
  
  const currentCategory = ref({
    id: null,
    name: '',
    description: '',
    status: 'active'
  })
  
  // Filter categories based on search and status
  const filteredCategories = computed(() => {
    return categories.value.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                           category.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesStatus = statusFilter.value === 'all' || category.status === statusFilter.value
      return matchesSearch && matchesStatus
    })
  })
  
  // Load categories (in a real app, this would be an API call)
  onMounted(() => {
    categories.value = [...sampleCategories]
  })
  
  // Add or update a category
  function saveCategory() {
    if (editingCategory.value) {
      // Update existing category
      const index = categories.value.findIndex(c => c.id === currentCategory.value.id)
      if (index !== -1) {
        categories.value[index] = { ...currentCategory.value }
      }
    } else {
      // Add new category
      const newCategory = {
        ...currentCategory.value,
        id: Math.max(...categories.value.map(c => c.id), 0) + 1,
        itemsCount: 0
      }
      categories.value.push(newCategory)
    }
    
    closeModal()
  }
  
  // Edit a category
  function editCategory(category) {
    currentCategory.value = { ...category }
    editingCategory.value = true
  }
  
  // Delete a category
  function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
      categories.value = categories.value.filter(c => c.id !== id)
    }
  }
  
  // Close the modal and reset form
  function closeModal() {
    showAddForm.value = false
    editingCategory.value = null
    currentCategory.value = {
      id: null,
      name: '',
      description: '',
      status: 'active'
    }
  }
  </script>