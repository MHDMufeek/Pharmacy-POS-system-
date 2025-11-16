<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-blue-900">View Expenses</h1>
        <p class="text-gray-600">Manage and track your business expenses</p>
      </div>
      <button 
        @click="showAddForm = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
      >
        <span class="material-icons mr-2">add</span>
        Add Expense
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="bg-blue-100 p-3 rounded-lg mr-4">
            <span class="material-icons text-blue-600">receipt</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ expenses.length }}</p>
            <p class="text-gray-600">Total Expenses</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="bg-green-100 p-3 rounded-lg mr-4">
            <span class="material-icons text-green-600">payments</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">Rs. {{ totalAmount.toLocaleString() }}</p>
            <p class="text-gray-600">Total Amount</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="bg-purple-100 p-3 rounded-lg mr-4">
            <span class="material-icons text-purple-600">category</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ categories.length }}</p>
            <p class="text-gray-600">Categories</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow border mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select v-model="filters.category" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input type="date" v-model="filters.startDate" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input type="date" v-model="filters.endDate" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Search expenses..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
      </div>
      
      <div class="flex justify-end mt-4">
        <button 
          @click="clearFilters"
          class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Expenses Table -->
    <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800 ">Expense Records</h2>
        <div class="flex gap-2">
          <button 
            @click="refreshData"
            class="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 flex items-center"
          >
            <span class="material-icons text-sm mr-1">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-blue-500 text-left">
            <th class="p-3 border-b">#</th>
            <th class="p-3 border-b">Expense Name</th>
            <th class="p-3 border-b">Category</th>
            <th class="p-3 border-b">Amount (Rs.)</th>
            <th class="p-3 border-b">Date</th>
            <th class="p-3 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(expense, index) in filteredExpenses"
            :key="expense.id"
            class="hover:bg-gray-50"
          >
            <td class="p-3 border-b">{{ index + 1 }}</td>
            <td class="p-3 border-b">
              <div>
                <p class="font-medium">{{ expense.name }}</p>
                <p class="text-sm text-gray-500" v-if="expense.description">{{ expense.description }}</p>
              </div>
            </td>
            <td class="p-3 border-b">
              <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {{ expense.category }}
              </span>
            </td>
            <td class="p-3 border-b text-green-700 font-semibold">
              Rs. {{ expense.amount.toLocaleString() }}
            </td>
            <td class="p-3 border-b text-black">
              {{ formatDate(expense.date) }}
            </td>
            <td class="p-3 border-b">
              <div class="flex gap-2">
                <button 
                  @click="editExpense(expense)"
                  class="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <span class="material-icons text-sm">edit</span>
                </button>
                <button 
                  @click="deleteExpense(expense.id)"
                  class="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <span class="material-icons text-sm">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>

        <tfoot v-if="filteredExpenses.length">
          <tr class="bg-blue-50 font-semibold">
            <td colspan="3" class="p-3 border-t text-right text-black">Total:</td>
            <td class="p-3 border-t text-green-700 font-bold">
              Rs. {{ totalAmount.toLocaleString() }}
            </td>
            <td colspan="2" class="p-3 border-t"></td>
          </tr>
        </tfoot>
      </table>

      <div v-if="!filteredExpenses.length" class="text-center py-8">
        <span class="material-icons text-4xl text-gray-400 mb-2">receipt</span>
        <p class="text-gray-500">No expenses found.</p>
        <p class="text-gray-400 text-sm mt-1">Try adjusting your filters or add a new expense</p>
        <button 
          @click="showAddForm = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4"
        >
          Add New Expense
        </button>
      </div>
    </div>

    <!-- Add/Edit Expense Modal -->
    <div v-if="showAddForm || editingExpense" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-lg font-semibold">
            {{ editingExpense ? 'Edit Expense' : 'Add New Expense' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <form @submit.prevent="saveExpense" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Expense Name *</label>
            <input 
              type="text" 
              v-model="expenseForm.name" 
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter expense name"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select v-model="expenseForm.category" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.) *</label>
            <input 
              type="number" 
              v-model="expenseForm.amount" 
              required
              min="0"
              step="0.01"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input 
              type="date" 
              v-model="expenseForm.date" 
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="expenseForm.description" 
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional details..."
            ></textarea>
          </div>
          
          <div class="flex gap-3 justify-end pt-4">
            <button 
              type="button" 
              @click="closeModal"
              class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {{ editingExpense ? 'Update Expense' : 'Add Expense' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ViewExpenses',
  setup() {
    // State
    const expenses = ref([])
    const showAddForm = ref(false)
    const editingExpense = ref(null)

    // Filters
    const filters = ref({
      category: '',
      startDate: '',
      endDate: '',
      search: ''
    })

    // Expense Form
    const expenseForm = ref({
      name: '',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })

    // Categories
    const categories = ref([
      'Utilities',
      'Rent',
      'Salaries',
      'Supplies',
      'Marketing',
      'Travel',
      'Equipment',
      'Maintenance',
      'Other'
    ])

    // Computed Properties
    const filteredExpenses = computed(() => {
      let filtered = expenses.value

      // Filter by category
      if (filters.value.category) {
        filtered = filtered.filter(expense => expense.category === filters.value.category)
      }

      // Filter by date range
      if (filters.value.startDate) {
        const startDate = new Date(filters.value.startDate)
        filtered = filtered.filter(expense => new Date(expense.date) >= startDate)
      }

      if (filters.value.endDate) {
        const endDate = new Date(filters.value.endDate)
        endDate.setHours(23, 59, 59, 999)
        filtered = filtered.filter(expense => new Date(expense.date) <= endDate)
      }

      // Filter by search term
      if (filters.value.search) {
        const searchTerm = filters.value.search.toLowerCase()
        filtered = filtered.filter(expense => 
          expense.name.toLowerCase().includes(searchTerm) ||
          expense.category.toLowerCase().includes(searchTerm) ||
          (expense.description && expense.description.toLowerCase().includes(searchTerm))
        )
      }

      return filtered
    })

    const totalAmount = computed(() => 
      filteredExpenses.value.reduce((sum, expense) => sum + expense.amount, 0)
    )

    // Methods
    function formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    function clearFilters() {
      filters.value = {
        category: '',
        startDate: '',
        endDate: '',
        search: ''
      }
    }

    function refreshData() {
      loadExpenses()
    }

    function editExpense(expense) {
      editingExpense.value = expense
      expenseForm.value = { ...expense }
      if (expenseForm.value.date) {
        expenseForm.value.date = new Date(expense.date).toISOString().split('T')[0]
      }
      showAddForm.value = true
    }

    function deleteExpense(id) {
      if (confirm('Are you sure you want to delete this expense?')) {
        expenses.value = expenses.value.filter(expense => expense.id !== id)
        saveToLocalStorage()
      }
    }

    function closeModal() {
      showAddForm.value = false
      editingExpense.value = null
      expenseForm.value = {
        name: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      }
    }

    function saveExpense() {
      if (editingExpense.value) {
        // Update existing expense
        const index = expenses.value.findIndex(e => e.id === editingExpense.value.id)
        if (index !== -1) {
          expenses.value[index] = {
            ...expenseForm.value,
            id: editingExpense.value.id,
            amount: parseFloat(expenseForm.value.amount)
          }
        }
      } else {
        // Add new expense
        const newExpense = {
          ...expenseForm.value,
          id: Date.now(),
          amount: parseFloat(expenseForm.value.amount)
        }
        expenses.value.unshift(newExpense)
      }
      
      saveToLocalStorage()
      closeModal()
    }

    function loadExpenses() {
      // Load from localStorage or use sample data
      const saved = localStorage.getItem('expenses')
      if (saved) {
        expenses.value = JSON.parse(saved)
      } else {
        // Sample data
        expenses.value = [
          {
            id: 1,
            name: 'Electricity Bill',
            category: 'Utilities',
            amount: 8500,
            date: new Date('2024-01-15').toISOString(),
            description: 'Monthly electricity bill for main store'
          },
          {
            id: 2,
            name: 'Shop Rent',
            category: 'Rent',
            amount: 20000,
            date: new Date('2024-01-10').toISOString(),
            description: 'Monthly rental payment'
          },
          {
            id: 3,
            name: 'Employee Salaries',
            category: 'Salaries',
            amount: 45000,
            date: new Date('2024-01-01').toISOString(),
            description: 'January salaries for staff'
          },
          {
            id: 4,
            name: 'Medical Supplies',
            category: 'Supplies',
            amount: 15000,
            date: new Date('2024-01-20').toISOString(),
            description: 'Purchase of medical consumables'
          }
        ]
        saveToLocalStorage()
      }
    }

    function saveToLocalStorage() {
      localStorage.setItem('expenses', JSON.stringify(expenses.value))
    }

    // Lifecycle
    onMounted(() => {
      loadExpenses()
    })

    return {
      expenses,
      showAddForm,
      editingExpense,
      filters,
      expenseForm,
      categories,
      filteredExpenses,
      totalAmount,
      formatDate,
      clearFilters,
      refreshData,
      editExpense,
      deleteExpense,
      closeModal,
      saveExpense
    }
  }
}
</script>

<style scoped>
.material-icons {
  font-size: 18px;
  vertical-align: middle;
}
</style>