<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900">Creditors Management</h1>
      <button
        @click="showForm = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
      >
        <span class="material-icons mr-2">add</span>
        Add Creditor
      </button>
    </div>

    <!-- ✅ Form Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          class="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          @click="showForm = false"
        >
          <span class="material-icons">close</span>
        </button>

        <h2 class="text-xl font-bold mb-4">Add Creditor</h2>

        <form @submit.prevent="addCreditor">
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="newCreditor.name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border rounded-lg outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700">Contact</label>
            <input
              v-model="newCreditor.contact"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border rounded-lg outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700">Amount Owed</label>
            <input
              v-model.number="newCreditor.amount"
              type="number"
              required
              class="mt-1 block w-full px-3 py-2 border rounded-lg outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              v-model="newCreditor.dueDate"
              type="date"
              required
              class="mt-1 block w-full px-3 py-2 border rounded-lg outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="newCreditor.status"
              class="mt-1 block w-full px-3 py-2 border rounded-lg outline-none focus:ring focus:ring-blue-400"
            >
              <option>Active</option>
              <option>Overdue</option>
              <option>Paid</option>
            </select>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </div>
    </div>

    <!-- ✅ Table (same as before) -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creditor</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Owed</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(creditor, index) in creditors" :key="index">
            <td class="px-6 py-4">{{ creditor.name }} <br/><span class="text-sm text-gray-500">{{ creditor.contact }}</span></td>
            <td class="px-6 py-4">${{ creditor.amount }}</td>
            <td class="px-6 py-4">{{ creditor.dueDate }}</td>
            <td class="px-6 py-4">{{ creditor.status }}</td>
            <td class="px-6 py-4">
              <button class="text-blue-600 hover:text-blue-900">
                <span class="material-icons">visibility</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showForm = ref(false);

const creditors = ref([
  { name: "MedSupply Co.", contact: "John Smith", amount: 2500, dueDate: "2023-06-15", status: "Active" },
  { name: "Pharma Distributors", contact: "Sarah Johnson", amount: 4200, dueDate: "2023-05-20", status: "Overdue" }
]);

const newCreditor = ref({
  name: "",
  contact: "",
  amount: 0,
  dueDate: "",
  status: "Active"
});

function addCreditor() {
  creditors.value.push({ ...newCreditor.value });
  // reset form
  newCreditor.value = { name: "", contact: "", amount: 0, dueDate: "", status: "Active" };
  showForm.value = false;
}
</script>
