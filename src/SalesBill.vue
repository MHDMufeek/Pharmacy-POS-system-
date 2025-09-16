<template>
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Sales Bill</h1>
        <button 
          @click="$emit('go-back')" 
          class="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span class="material-icons mr-1">arrow_back</span>
          Back
        </button>
      </div>
  
      <!-- Sales Bill Form -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
            <input 
              type="text" 
              v-model="salesBill.billNumber" 
              class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
              disabled
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bill Date</label>
            <input 
              type="date" 
              v-model="salesBill.billDate" 
              class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input 
              type="text" 
              v-model="salesBill.customerName" 
              class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="Enter customer name"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
            <input 
              type="tel" 
              v-model="salesBill.customerPhone" 
              class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="Enter phone number"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select v-model="salesBill.paymentMethod" class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none">
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="credit">Credit</option>
            </select>
          </div>
          <div v-if="salesBill.paymentMethod === 'credit'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Credit Days</label>
            <input 
              type="number" 
              v-model="salesBill.creditDays" 
              class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="Number of days"
              min="1"
            >
          </div>
        </div>
  
        <!-- Items Section -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-700">Items</h3>
            <button 
              type="button" 
              @click="addItem" 
              class="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center text-sm"
            >
              <span class="material-icons text-sm mr-1">add</span>
              Add Item
            </button>
          </div>
  
          <div v-for="(item, index) in salesBill.items" :key="index" class="grid grid-cols-12 gap-2 mb-3 items-center">
            <div class="col-span-4">
              <select 
                v-model="item.productId" 
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                @change="updateItemDetails(item)"
              >
                <option value="">Select Product</option>
                <option v-for="product in products" :key="product.id" :value="product.id" :disabled="product.stock === 0">
                  {{ product.name }} - Stock: {{ product.stock }}
                </option>
              </select>
            </div>
            <div class="col-span-2">
              <input 
                type="number" 
                v-model="item.quantity" 
                placeholder="Qty"
                min="1"
                :max="getMaxQuantity(item)"
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                @input="calculateItemTotal(item)"
              >
            </div>
            <div class="col-span-2">
              <input 
                type="number" 
                v-model="item.unitPrice" 
                placeholder="Price"
                min="0"
                step="0.01"
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                @input="calculateItemTotal(item)"
              >
            </div>
            <div class="col-span-2">
              <input 
                type="text" 
                :value="'$' + (item.total || 0).toFixed(2)" 
                disabled
                class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
              >
            </div>
            <div class="col-span-1">
              <button 
                type="button" 
                @click="removeItem(index)" 
                class="text-red-600 hover:text-red-800"
                :disabled="salesBill.items.length === 1"
              >
                <span class="material-icons">delete</span>
              </button>
            </div>
            <div class="col-span-12 text-xs text-red-600" v-if="item.quantity > getMaxQuantity(item)">
              Only {{ getMaxQuantity(item) }} available in stock
            </div>
          </div>
        </div>
  
        <!-- Totals Section -->
        <div class="border-t pt-4">
          <div class="flex justify-end">
            <div class="w-80">
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-600">Subtotal:</span>
                <span class="font-medium">${{ salesBill.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-600">Discount:</span>
                <div class="flex items-center">
                  <input 
                    type="number" 
                    v-model="salesBill.discount" 
                    min="0"
                    :max="salesBill.subtotal"
                    class="w-20 bg-gray-100 rounded-lg px-2 py-1 text-sm outline-none mr-2"
                    @input="calculateTotals"
                  >
                  <span class="font-medium">-${{ salesBill.discount.toFixed(2) }}</span>
                </div>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-600">Tax ({{ salesBill.taxRate }}%):</span>
                <span class="font-medium">${{ salesBill.tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between border-t pt-2">
                <span class="text-lg font-bold text-gray-800">Total Amount:</span>
                <span class="text-lg font-bold text-blue-600">${{ salesBill.totalAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-6">
          <button 
            @click="resetForm" 
            class="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg flex items-center"
          >
            <span class="material-icons text-sm mr-1">refresh</span>
            Reset
          </button>
          <button 
            @click="saveAsDraft" 
            class="px-6 py-2 text-blue-700 bg-blue-100 rounded-lg flex items-center"
          >
            <span class="material-icons text-sm mr-1">save</span>
            Save Draft
          </button>
          <button 
            @click="processPayment" 
            class="px-6 py-2 text-white bg-blue-600 rounded-lg flex items-center"
            :disabled="!isFormValid"
          >
            <span class="material-icons text-sm mr-1">payments</span>
            Process Payment
          </button>
          <button 
            @click="printBill" 
            class="px-6 py-2 text-green-700 bg-green-100 rounded-lg flex items-center"
            :disabled="!salesBill.billNumber"
          >
            <span class="material-icons text-sm mr-1">print</span>
            Print Bill
          </button>
        </div>
      </div>
  
      <!-- Recent Bills -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Sales Bills</h3>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill #</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="bill in recentBills" :key="bill.billNumber">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {{ bill.billNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(bill.billDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ bill.customerName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ bill.items.length }} items
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ bill.totalAmount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="['px-2 py-1 text-xs font-semibold rounded-full', 
                               bill.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                               bill.paymentMethod === 'credit' ? 'bg-yellow-100 text-yellow-800' :
                               'bg-blue-100 text-blue-800']">
                    {{ bill.paymentMethod }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-2" @click="viewBill(bill)">
                    <span class="material-icons text-sm">visibility</span>
                  </button>
                  <button class="text-green-600 hover:text-green-900" @click="reprintBill(bill)">
                    <span class="material-icons text-sm">print</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div v-if="recentBills.length === 0" class="text-center py-8 text-gray-500">
          No recent bills found
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  const salesBill = ref({
    billNumber: '',
    billDate: new Date().toISOString().split('T')[0],
    customerName: '',
    customerPhone: '',
    paymentMethod: 'cash',
    creditDays: 0,
    items: [
      { productId: '', quantity: 1, unitPrice: 0, total: 0 }
    ],
    subtotal: 0,
    discount: 0,
    taxRate: 10,
    tax: 0,
    totalAmount: 0
  })
  
  // Sample data - in a real application, this would come from an API
  const products = ref([
    { id: 'P001', name: 'Paracetamol 500mg', stock: 150, price: 5.99 },
    { id: 'P002', name: 'Amoxicillin 250mg', stock: 75, price: 12.50 },
    { id: 'P003', name: 'Vitamin C 1000mg', stock: 200, price: 8.75 },
    { id: 'P004', name: 'Ibuprofen 400mg', stock: 8, price: 6.25 },
    { id: 'P005', name: 'Metformin 500mg', stock: 120, price: 15.30 }
  ])
  
  const recentBills = ref([
    { 
      billNumber: 'SB-001', 
      billDate: '2023-10-25', 
      customerName: 'John Doe', 
      customerPhone: '+1 555-0123',
      paymentMethod: 'cash',
      items: [
        { productId: 'P001', quantity: 2, unitPrice: 5.99, total: 11.98 }
      ],
      subtotal: 11.98,
      discount: 0,
      tax: 1.20,
      totalAmount: 13.18
    },
    { 
      billNumber: 'SB-002', 
      billDate: '2023-10-24', 
      customerName: 'Jane Smith', 
      customerPhone: '+1 555-0456',
      paymentMethod: 'card',
      items: [
        { productId: 'P002', quantity: 1, unitPrice: 12.50, total: 12.50 },
        { productId: 'P003', quantity: 3, unitPrice: 8.75, total: 26.25 }
      ],
      subtotal: 38.75,
      discount: 2.00,
      tax: 3.68,
      totalAmount: 40.43
    }
  ])
  
  onMounted(() => {
    generateBillNumber()
  })
  
  const isFormValid = computed(() => {
    return salesBill.value.customerName && 
           salesBill.value.items.every(item => item.productId && item.quantity > 0 && item.unitPrice > 0) &&
           salesBill.value.totalAmount > 0
  })
  
  function generateBillNumber() {
    const nextNumber = recentBills.value.length + 1
    salesBill.value.billNumber = `SB-${String(nextNumber).padStart(3, '0')}`
  }
  
  function addItem() {
    salesBill.value.items.push({ productId: '', quantity: 1, unitPrice: 0, total: 0 })
  }
  
  function removeItem(index) {
    if (salesBill.value.items.length > 1) {
      salesBill.value.items.splice(index, 1)
      calculateTotals()
    }
  }
  
  function updateItemDetails(item) {
    const product = products.value.find(p => p.id === item.productId)
    if (product) {
      item.unitPrice = product.price
      calculateItemTotal(item)
    }
  }
  
  function calculateItemTotal(item) {
    item.total = (item.quantity || 0) * (item.unitPrice || 0)
    calculateTotals()
  }
  
  function calculateTotals() {
    salesBill.value.subtotal = salesBill.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
    salesBill.value.tax = (salesBill.value.subtotal - salesBill.value.discount) * (salesBill.value.taxRate / 100)
    salesBill.value.totalAmount = salesBill.value.subtotal - salesBill.value.discount + salesBill.value.tax
  }
  
  function getMaxQuantity(item) {
    if (!item.productId) return 0
    const product = products.value.find(p => p.id === item.productId)
    return product ? product.stock : 0
  }
  
  function resetForm() {
    salesBill.value = {
      billNumber: '',
      billDate: new Date().toISOString().split('T')[0],
      customerName: '',
      customerPhone: '',
      paymentMethod: 'cash',
      creditDays: 0,
      items: [
        { productId: '', quantity: 1, unitPrice: 0, total: 0 }
      ],
      subtotal: 0,
      discount: 0,
      taxRate: 10,
      tax: 0,
      totalAmount: 0
    }
    generateBillNumber()
  }
  
  function saveAsDraft() {
    // In a real application, this would save to a database
    alert('Bill saved as draft successfully!')
  }
  
  function processPayment() {
    if (!isFormValid.value) {
      alert('Please fill in all required fields correctly.')
      return
    }
  
    // Update stock levels
    salesBill.value.items.forEach(item => {
      const product = products.value.find(p => p.id === item.productId)
      if (product) {
        product.stock -= item.quantity
      }
    })
  
    // Add to recent bills
    recentBills.value.unshift({ ...salesBill.value })
    
    alert(`Payment processed successfully! Total: $${salesBill.value.totalAmount.toFixed(2)}`)
    resetForm()
  }
  
  function printBill() {
    // In a real application, this would generate a printable bill
    alert('Printing bill...')
  }
  
  function viewBill(bill) {
    alert(`Viewing bill ${bill.billNumber} for ${bill.customerName}`)
  }
  
  function reprintBill(bill) {
    alert(`Reprinting bill ${bill.billNumber}`)
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString()
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 100%;
  }
  </style>