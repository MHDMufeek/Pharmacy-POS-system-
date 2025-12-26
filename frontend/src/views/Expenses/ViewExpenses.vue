<template>
  <div class="p-6 bg-gray-50 min-h-screen dark:bg-slate-900 dark:text-white">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-blue-900 dark:text-blue-200">View Expenses</h1>
        <p class="text-gray-600 dark:text-gray-300">Manage and track your business expenses</p>
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
      <div class="bg-white p-4 rounded-lg shadow border dark:bg-slate-800 dark:border-slate-700 dark:text-white">
        <div class="flex items-center">
          <div class="bg-blue-100 p-3 rounded-lg mr-4 dark:bg-blue-900/20">
            <span class="material-icons text-blue-600">receipt</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ expenses.length }}</p>
            <p class="text-gray-600 dark:text-gray-300">Total Expenses</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow border dark:bg-slate-800 dark:border-slate-700 dark:text-white">
        <div class="flex items-center">
          <div class="bg-green-100 p-3 rounded-lg mr-4 dark:bg-green-900/20">
            <span class="material-icons text-green-600">payments</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">Rs. {{ totalAmount.toLocaleString() }}</p>
            <p class="text-gray-600 dark:text-gray-300">Total Amount</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow border dark:bg-slate-800 dark:border-slate-700 dark:text-white">
        <div class="flex items-center">
          <div class="bg-purple-100 p-3 rounded-lg mr-4 dark:bg-purple-900/20">
            <span class="material-icons text-purple-600">category</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ categories.length }}</p>
            <p class="text-gray-600 dark:text-gray-300">Categories</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow border mb-6 dark:bg-slate-800 dark:border-slate-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Category</label>
          <select v-model="filters.category" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">From Date</label>
          <input type="date" v-model="filters.startDate" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">To Date</label>
          <input type="date" v-model="filters.endDate" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Search</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Search expenses..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
        </div>
      </div>
      
      <div class="flex justify-end mt-4">
        <button 
          @click="clearFilters"
          class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:bg-gray-600"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Expenses Table -->
    <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Expense Records</h2>
        <div class="flex gap-2">
          <button 
            @click="refreshData"
            class="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 flex items-center dark:bg-slate-700 dark:text-white"
          >
            <span class="material-icons text-sm mr-1">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-blue-500 text-left text-white dark:bg-blue-700">
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
            class="hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <td class="p-3 border-b">{{ index + 1 }}</td>
            <td class="p-3 border-b">
              <div>
                <p class="font-medium dark:text-white">{{ expense.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-300" v-if="expense.description">{{ expense.description }}</p>
              </div>
            </td>
            <td class="p-3 border-b">
              <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-200">
                {{ expense.category }}
              </span>
            </td>
            <td class="p-3 border-b text-green-700 dark:text-green-400 font-semibold">
              Rs. {{ expense.amount.toLocaleString() }}
            </td>
            <td class="p-3 border-b text-slate-800 dark:text-white">
              {{ formatDate(expense.date) }}
            </td>
            <td class="p-3 border-b">
              <div class="flex gap-2">
                <button 
                  @click="editExpense(expense)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                  title="Edit"
                >
                  <span class="material-icons text-sm">edit</span>
                </button>
                <button 
                  @click="deleteExpense(expense.id)"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete"
                >
                  <span class="material-icons text-sm">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>

        <tfoot v-if="filteredExpenses.length">
          <tr class="bg-blue-50 font-semibold dark:bg-slate-900 dark:text-white">
            <td colspan="3" class="p-3 border-t text-right text-black dark:text-white">Total:</td>
            <td class="p-3 border-t text-green-700 dark:text-green-400 font-bold">
              Rs. {{ totalAmount.toLocaleString() }}
            </td>
            <td colspan="2" class="p-3 border-t"></td>
          </tr>
        </tfoot>
      </table>

      <div v-if="!filteredExpenses.length" class="text-center py-8">
        <span class="material-icons text-4xl text-gray-400 dark:text-gray-400 mb-2">receipt</span>
        <p class="text-gray-500 dark:text-gray-300">No expenses found.</p>
        <p class="text-gray-400 dark:text-gray-400 text-sm mt-1">Try adjusting your filters or add a new expense</p>
        <button 
          @click="showAddForm = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Add New Expense
        </button>
      </div>
    </div>

    <!-- Add/Edit Expense Modal -->
    <div v-if="showAddForm || editingExpense" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full dark:bg-slate-800 dark:text-white">
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 class="text-lg font-semibold">
            {{ editingExpense ? 'Edit Expense' : 'Add New Expense' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <form @submit.prevent="saveExpense" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Expense Name *</label>
            <input 
              type="text" 
              v-model="expenseForm.name" 
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              placeholder="Enter expense name"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Category *</label>
            <select v-model="expenseForm.category" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Amount (Rs.) *</label>
            <input 
              type="number" 
              v-model="expenseForm.amount" 
              required
              min="0"
              step="0.01"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              placeholder="0.00"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Date *</label>
            <input 
              type="date" 
              v-model="expenseForm.date" 
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Description</label>
            <textarea 
              v-model="expenseForm.description" 
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              placeholder="Add any additional details..."
            ></textarea>
          </div>
          
          <div class="flex gap-3 justify-end pt-4">
            <button 
              type="button" 
              @click="closeModal"
              class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
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

    // API base
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

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

    async function deleteExpense(id) {
      if (!confirm('Are you sure you want to delete this expense?')) return
      const token = localStorage.getItem('token')
      try {
        const res = await fetch(`${API_BASE}/expenses/${id}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (!res.ok) throw new Error('Delete failed')
        await loadExpenses()
      } catch (err) {
        console.error(err)
        // fallback to local
        expenses.value = expenses.value.filter(expense => (expense._id || expense.id) !== id)
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

    async function saveExpense() {
      const token = localStorage.getItem('token')
      try {
        const payload = {
          name: expenseForm.value.name,
          category: expenseForm.value.category,
          amount: parseFloat(expenseForm.value.amount),
          date: expenseForm.value.date,
          description: expenseForm.value.description
        }

        if (editingExpense.value) {
          const id = editingExpense.value._id || editingExpense.value.id
          const res = await fetch(`${API_BASE}/expenses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify(payload)
          })
          if (!res.ok) throw new Error('Update failed')
        } else {
          const res = await fetch(`${API_BASE}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify(payload)
          })
          if (!res.ok) throw new Error('Create failed')
        }

        await loadExpenses()
        closeModal()
      } catch (err) {
        console.error(err)
        // fallback to local
        if (editingExpense.value) {
          const index = expenses.value.findIndex(e => (e._id || e.id) === (editingExpense.value._id || editingExpense.value.id))
          if (index !== -1) {
            expenses.value[index] = { ...expenseForm.value, id: editingExpense.value.id || editingExpense.value._id, amount: parseFloat(expenseForm.value.amount) }
          }
        } else {
          const newExpense = { ...expenseForm.value, id: Date.now(), amount: parseFloat(expenseForm.value.amount) }
          expenses.value.unshift(newExpense)
        }
        saveToLocalStorage()
        closeModal()
      }
    }

    async function loadExpenses() {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API_BASE}/expenses`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (!res.ok) {
          // fallback to local
          const saved = localStorage.getItem('expenses')
          if (saved) {
            expenses.value = JSON.parse(saved)
            return
          }
          expenses.value = []
          return
        }

        const body = await res.json()
        expenses.value = (body && body.data) ? body.data.map(e => ({ ...e, date: e.date })) : []
      } catch (err) {
        console.error(err)
        const saved = localStorage.getItem('expenses')
        if (saved) expenses.value = JSON.parse(saved)
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