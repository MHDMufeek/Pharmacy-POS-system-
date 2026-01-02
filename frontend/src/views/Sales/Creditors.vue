<template>
  <div class="p-6 dark:bg-slate-900 dark:text-white">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900 dark:text-blue-300">Creditors Management</h1>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center dark:bg-blue-500 dark:hover:bg-blue-600"
        @click="openAddCreditorForm"
      >
        <span class="material-icons mr-2">add</span>
        Add Creditor
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white p-4 rounded-lg shadow mb-6 dark:bg-slate-800 dark:border dark:border-slate-700 dark:text-white">
      <div class="flex flex-col md:flex-row gap-4">
        <div
          class="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2 dark:bg-slate-700"
        >
          <span class="material-icons text-gray-400 mr-2 dark:text-gray-300">search</span>
          <input
            type="text"
            placeholder="Search creditors..."
            class="bg-transparent outline-none w-full text-sm dark:text-white"
            v-model="searchQuery"
          />
        </div>
        <div class="w-full md:w-48">
          <select
            class="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none dark:bg-slate-700 dark:text-white"
            v-model="statusFilter"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Overdue">Overdue</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Creditors Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-slate-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Creditor
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount Owed
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Due Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
          <tr
            v-for="(creditor, index) in paginatedCreditors"
            :key="creditor._id || creditor.id || index"
            class="hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 dark:bg-blue-900/20"
                >
                  
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ creditor.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-300">
                    {{ creditor.contact }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-gray-900 dark:text-gray-200">
                Rs.{{ creditor.amount.toLocaleString() }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-gray-900 dark:text-gray-200">
                {{ formatDate(creditor.dueDate) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 py-1 text-xs rounded-full': true,
                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300': creditor.status === 'Paid',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-300': creditor.status === 'Active',
                  'bg-red-100 text-red-800 dark:bg-red-900/10 dark:text-red-300': creditor.status === 'Overdue'
                }"
              >
                {{ creditor.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <!-- 👁️ View Details -->
              <button
                class="text-blue-600 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100 mr-3"
                @click="openCreditorDetails(creditor)"
                title="View Creditor Details"
              >
                   <span class="text-lg">{{ showPassword ? '🙈' : '👁️' }}</span>
              </button>
              
              <!-- 💰 Make Payment -->
              <button 
                class="text-green-600 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100 mr-3"
                title="Make Payment"
                @click="openPaymentModal(creditor)"
              >
                <span class="material-icons">payment</span>
              </button>
              
              <!-- Delete -->
              <button 
                class="text-red-600 hover:text-red-900 dark:text-red-300 dark:hover:text-red-600"
                title="Delete Creditor"
                @click="deleteCreditor(creditor)"
              >
                <span class="material-icons">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination (visible only when items exceed page size) -->
    <div
      v-if="totalCreditors > pageSize"
      class="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow dark:bg-slate-800 dark:text-gray-300 dark:border dark:border-slate-700"
    >
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing <span class="font-medium">{{ displayedFrom }}</span> to
        <span class="font-medium">{{ displayedTo }}</span> of
        <span class="font-medium">{{ totalCreditors }}</span> results
      </div>
      <div class="flex space-x-2">
        <button
          @click.prevent="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-transparent dark:text-gray-300 dark:hover:bg-slate-700"
        >
            <span class="sr-only">previous</span>
                  <span class="material-icons">chevron_left</span>
        </button>

        <button
          v-for="p in pageNumbers"
          :key="p"
          @click.prevent="changePage(p)"
          :class="['px-3 py-1 rounded-md text-sm', p === currentPage ? 'bg-blue-600 text-white dark:bg-blue-900/20 dark:text-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-transparent dark:text-gray-300 dark:hover:bg-slate-700']"
        >
          {{ p }}
        </button>

        <button
          @click.prevent="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-transparent dark:text-gray-300 dark:hover:bg-slate-700"
        >
            <span class="sr-only">next</span>
                  <span class="material-icons">chevron_right</span>
        </button>
      </div>
    </div>

    <!-- 🔹 Add Creditor Modal -->
    <div
      v-if="showAddCreditorModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-2xl font-bold text-gray-800">
            Add New Creditor
          </h2>
          <button
            class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            @click="closeAddCreditorForm"
          >
            <span class="material-icons text-2xl">close</span>
          </button>
        </div>

        <!-- Add Creditor Form -->
        <div class="p-6">
          <form @submit.prevent="submitCreditorForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Creditor Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Creditor Information</h3>
                
                <div class="form-group">
                  <label class="form-label">Creditor Name <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    v-model="newCreditor.name"
                    required
                    placeholder="Enter creditor name"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Contact Person <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    v-model="newCreditor.contact"
                    required
                    placeholder="Enter contact person"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input
                    type="email"
                    v-model="newCreditor.email"
                    placeholder="Enter email address"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Phone Number</label>
                  <input
                    type="tel"
                    v-model="newCreditor.phone"
                    placeholder="Enter phone number"
                    class="form-input"
                  >
                </div>
              </div>

              <!-- Financial Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
                
                <div class="form-group">
                  <label class="form-label">Amount Owed <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      v-model="newCreditor.amount"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      class="form-input pl-8"
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Due Date <span class="text-red-500">*</span></label>
                  <input
                    type="date"
                    v-model="newCreditor.dueDate"
                    required
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Status <span class="text-red-500">*</span></label>
                  <select v-model="newCreditor.status" required class="form-input">
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Account Number</label>
                  <input
                    type="text"
                    v-model="newCreditor.accountNumber"
                    placeholder="Enter account number"
                    class="form-input"
                  >
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="mt-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label class="form-label">Credit Limit</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      v-model="newCreditor.creditLimit"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      class="form-input pl-8"
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Payment Terms</label>
                  <select v-model="newCreditor.terms" class="form-input">
                    <option value="">Select Terms</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
              </div>

              <div class="form-group mt-4">
                <label class="form-label">Notes</label>
                <textarea
                  v-model="newCreditor.notes"
                  rows="3"
                  placeholder="Add any additional notes..."
                  class="form-input"
                ></textarea>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 mt-8 pt-6 border-t">
              <button
                type="button"
                @click="closeAddCreditorForm"
                class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <span class="material-icons mr-2">save</span>
                Save Creditor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 🔹 Creditor Details Modal -->
    <div
      v-if="showCreditorDetails"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
            Creditor Details - {{ selectedCreditor?.name }}
          </h2>
          <button
            class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            @click="showCreditorDetails = false"
          >
            <span class="material-icons text-2xl">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Creditor Name:</span>
                  <span class="font-medium text-black">{{ selectedCreditor?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Contact Person:</span>
                  <span class="font-medium text-black">{{ selectedCreditor?.contact }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Email:</span>
                  <span class="font-medium text-black">{{ selectedCreditor?.email || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Phone:</span>
                  <span class="font-medium text-black">{{ selectedCreditor?.phone || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600 text-black">Amount Owed:</span>
                  <span class="font-medium text-red-600">Rs.{{ selectedCreditor?.amount?.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 ">Due Date:</span>
                  <span class="font-medium">{{ formatDate(selectedCreditor?.dueDate) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span
                    :class="{
                      'px-2 py-1 text-xs rounded-full font-medium': true,
                      'bg-green-100 text-green-800': selectedCreditor?.status === 'Paid',
                      'bg-yellow-100 text-yellow-800': selectedCreditor?.status === 'Active',
                      'bg-red-100 text-red-800': selectedCreditor?.status === 'Overdue'
                    }"
                  >
                    {{ selectedCreditor?.status }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Account Number:</span>
                  <span class="font-medium">{{ selectedCreditor?.accountNumber || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Details -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
            <div class="space-y-3">
              <div>
                <span class="text-gray-600 block mb-1">Notes:</span>
                <p class="text-gray-800 bg-white p-3 rounded border min-h-[60px] dark:bg-slate-900 dark:text-gray-200 dark:border dark:border-slate-700">
                  {{ selectedCreditor?.notes || 'No additional notes available.' }}
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Credit Limit:</span>
                  <span class="font-medium">Rs.{{ (selectedCreditor?.creditLimit || 0).toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Terms:</span>
                  <span class="font-medium">{{ selectedCreditor?.terms || 'Net 30' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment History -->
          <div class="bg-white border rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 p-4 border-b">Payment History</h3>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(history, index) in selectedCreditor?.history || []"
                    :key="index"
                  >
                    <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(history.date) }}</td>
                    <td class="px-4 py-3 text-sm font-medium">Rs.{{ history.amount.toLocaleString() }}</td>
                    <td class="px-4 py-3 text-sm">
                      <span
                        :class="{
                          'px-2 py-1 text-xs rounded-full': true,
                          'bg-green-100 text-green-800': history.status === 'Paid',
                          'bg-yellow-100 text-yellow-800': history.status === 'Pending',
                          'bg-red-100 text-red-800': history.status === 'Overdue'
                        }"
                      >
                        {{ history.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-500">{{ history.reference || 'N/A' }}</td>
                  </tr>
                  <tr v-if="!selectedCreditor?.history?.length">
                    <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                      No payment history available.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            @click="showCreditorDetails = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            @click="openPaymentModal(selectedCreditor)"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <span class="material-icons mr-2">payment</span>
            Make Payment
          </button>
        </div>
      </div>
    </div>

    <!-- 🔹 Payment Modal -->
    <div
      v-if="showPaymentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
        <button
          class="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          @click="showPaymentModal = false"
        >
          <span class="material-icons">close</span>
        </button>

        <h2 class="text-xl font-bold mb-4">Make Payment - {{ selectedCreditor?.name }}</h2>

        <form @submit.prevent="submitPayment">
          <div class="space-y-4">
            <div>
              <label class="form-label">Amount <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute left-3 top-3 text-gray-500">Rs.</span>
                <input type="number" step="0.01" min="0" v-model.number="paymentAmount" required class="form-input pl-8" />
              </div>
            </div>

            <div>
              <label class="form-label">Payment Method</label>
              <select v-model="paymentMethod" class="form-input">
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label class="form-label">Reference</label>
              <input type="text" v-model="paymentReference" placeholder="Optional reference" class="form-input" />
            </div>

          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showPaymentModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Submit Payment</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 🔹 History Modal -->
    <div
      v-if="showHistory"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-1/2 p-6 relative dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700">
        <button
          class="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          @click="showHistory = false"
        >
          <span class="material-icons">close</span>
        </button>

        <h2 class="text-xl font-bold mb-4">
          {{ selectedCreditor?.name }} - History
        </h2>

        <table class="w-full border rounded">
          <thead class="bg-black">
            <tr>
              <th class="px-4 py-2 text-left text-white">Date</th>
              <th class="px-4 py-2 text-left text-white">Amount</th>
              <th class="px-4 py-2 text-left text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(h, i) in selectedCreditor?.history"
              :key="i"
              class="border-t"
            >
              <td class="px-4 py-2">{{ formatDate(h.date) }}</td>
              <td class="px-4 py-2">Rs.{{ h.amount.toLocaleString() }}</td>
              <td class="px-4 py-2">{{ h.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});

const searchQuery = ref("");
const statusFilter = ref("");
const showHistory = ref(false);
const showCreditorDetails = ref(false);
const showAddCreditorModal = ref(false);
const selectedCreditor = ref(null);
const showPassword = ref(false);

// Payment modal state
const showPaymentModal = ref(false);
const paymentAmount = ref(0);
const paymentMethod = ref('cash');
const paymentReference = ref('');

function openPaymentModal(creditor) {
  selectedCreditor.value = creditor || selectedCreditor.value;
  // default to the creditor's outstanding amount
  paymentAmount.value = (selectedCreditor.value && (selectedCreditor.value.amount || 0)) || 0;
  paymentMethod.value = 'cash';
  paymentReference.value = '';
  showPaymentModal.value = true;
}

async function submitPayment() {
  if (!selectedCreditor.value) return alert('No creditor selected');
  const amt = Number(paymentAmount.value || 0);
  if (isNaN(amt) || amt <= 0) return alert('Enter a valid payment amount');
  const owed = Number(selectedCreditor.value.amount || 0);
  if (amt > owed) {
    if (!confirm(`Payment exceeds amount owed (Rs.${owed}). Proceed and set remaining to 0?`)) return;
  }

  // Compose payment entry
  const payment = {
    date: new Date().toISOString(),
    amount: amt,
    status: 'Paid',
    reference: paymentReference.value || ''
  };

  // Update local selected creditor
  selectedCreditor.value.history = selectedCreditor.value.history || [];
  selectedCreditor.value.history.unshift(payment);
  const remaining = Math.max(0, owed - amt);
  selectedCreditor.value.amount = remaining;
  selectedCreditor.value.status = remaining <= 0 ? 'Paid' : 'Active';

  // Update the creditors list (UI)
  const idx = creditors.value.findIndex(c => (c._id || c.id) === (selectedCreditor.value._id || selectedCreditor.value.id));
  if (idx !== -1) {
    creditors.value[idx] = { ...creditors.value[idx], ...selectedCreditor.value };
  }

  // Try to persist the change to the backend via PUT (if creditor has an id)
  try {
    const id = selectedCreditor.value._id || selectedCreditor.value.id;
    if (id) {
      await api.put(`/creditors/${id}`, { amount: selectedCreditor.value.amount, status: selectedCreditor.value.status, history: selectedCreditor.value.history });
    }
    alert('Payment recorded successfully');
  } catch (err) {
    console.error('Failed to persist payment', err);
    alert('Payment recorded locally (failed to persist to server)');
  }

  // Close modal and reset
  showPaymentModal.value = false;
  paymentAmount.value = 0;
  paymentMethod.value = 'cash';
  paymentReference.value = '';
}

// New creditor form data
const newCreditor = ref({
  name: "",
  contact: "",
  email: "",
  phone: "",
  amount: 0,
  dueDate: "",
  status: "",
  accountNumber: "",
  creditLimit: 0,
  terms: "",
  notes: ""
});

// Data comes from backend
const creditors = ref([]);

const filteredCreditors = computed(() => {
  let filtered = creditors.value;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c => (c.name || '').toLowerCase().includes(q) || (c.contact || '').toLowerCase().includes(q) || (c.status || '').toLowerCase().includes(q));
  }
  if (statusFilter.value) filtered = filtered.filter(c => c.status === statusFilter.value);
  return filtered;
});

// Pagination: show 5 rows per page so pagination appears when there are more than 5 items
const totalCreditors = computed(() => filteredCreditors.value.length);
const pageSize = ref(5);
const currentPage = ref(1);
const totalPages = computed(() => Math.max(1, Math.ceil(totalCreditors.value / pageSize.value)));
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));
const paginatedCreditors = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredCreditors.value.slice(start, start + pageSize.value);
});
const displayedFrom = computed(() => totalCreditors.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1);
const displayedTo = computed(() => Math.min(currentPage.value * pageSize.value, totalCreditors.value));

watch([searchQuery, statusFilter], () => { currentPage.value = 1; });
watch(totalCreditors, () => { if (currentPage.value > totalPages.value) currentPage.value = totalPages.value; });

function changePage(n) {
  if (n < 1 || n > totalPages.value) return;
  currentPage.value = n;
} 

function formatDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

async function loadCreditors() {
  try {
    const res = await api.get('/creditors');
    creditors.value = res.data && res.data.data ? res.data.data : res.data || [];
  } catch (err) {
    console.error('Failed to load creditors', err);
    creditors.value = [];
  }
}

async function openCreditorDetails(creditor) {
  try {
    if (creditor._id || creditor.id) {
      const id = creditor._id || creditor.id;
      const res = await api.get(`/creditors/${id}`);
      selectedCreditor.value = res.data || res.data.data || res.data;
    } else {
      selectedCreditor.value = creditor;
    }
    showCreditorDetails.value = true;
  } catch (err) {
    console.error('Failed to fetch creditor', err);
    selectedCreditor.value = creditor;
    showCreditorDetails.value = true;
  }
}

function openHistory(creditor) {
  selectedCreditor.value = creditor;
  showHistory.value = true;
}

function openAddCreditorForm() {
  newCreditor.value = { name: '', contact: '', email: '', phone: '', amount: 0, dueDate: '', status: '', accountNumber: '', creditLimit: 0, terms: '', notes: '' };
  showAddCreditorModal.value = true;
}

function closeAddCreditorForm() { showAddCreditorModal.value = false; }

async function submitCreditorForm() {
  try {
    const res = await api.post('/creditors', newCreditor.value);
    const created = res.data || res.data.data || res.data;
    if (created) creditors.value.push(created);
    showAddCreditorModal.value = false;
    newCreditor.value = { name: '', contact: '', email: '', phone: '', amount: 0, dueDate: '', status: '', accountNumber: '', creditLimit: 0, terms: '', notes: '' };
    alert('Creditor added successfully');
  } catch (err) {
    console.error('Create creditor failed', err);
    // Fallback: add locally so UI still works when backend is unavailable
    const newId = (creditors.value.length ? Math.max(...creditors.value.map(c => c.id || 0)) : 0) + 1;
    const local = { id: newId, ...newCreditor.value, history: [] };
    creditors.value.push(local);
    showAddCreditorModal.value = false;
    newCreditor.value = { name: '', contact: '', email: '', phone: '', amount: 0, dueDate: '', status: '', accountNumber: '', creditLimit: 0, terms: '', notes: '' };
    alert('Creditor added locally (backend unavailable)');
  }
}

async function deleteCreditor(creditor) {
  if (!confirm(`Delete creditor ${creditor.name}?`)) return;
  try {
    const id = creditor._id || creditor.id;
    if (!id) {
      creditors.value = creditors.value.filter(c => c !== creditor);
      return;
    }
    await api.delete(`/creditors/${id}`);
    creditors.value = creditors.value.filter(c => (c._id || c.id) !== id);
    alert('Deleted');
  } catch (err) {
    console.error('Delete failed', err);
    alert('Failed to delete creditor');
  }
}

onMounted(() => {
  loadCreditors();
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.15s ease;
  background-color: #f9fafb;
  color: #111827;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background-color: #ffffff;
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.text-red-500 {
  color: #ef4444;
}

/* Dark mode overrides */
.dark .form-label { color: #cbd5e1; }
.dark .form-input { background-color: #0f172a; color: #e2e8f0; border-color: #334155; }
.dark .form-input:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12); border-color: #1d4ed8; }
</style>