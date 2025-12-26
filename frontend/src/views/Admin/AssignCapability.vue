<template>
  <div class="page-container dark:bg-slate-900 dark:text-white">
    <div class="header-actions">
      <h2 class="page-header">Assign Capability</h2>
      <!-- Theme controls removed; use main navbar theme toggle -->
    </div>
    
    <div class="form-container">
      <!-- Success and Error Messages -->
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="alert alert-info">
        Loading...
      </div>
      
      <!-- User Selection -->
      <div class="form-group">
        <label class="form-label">Select User <span class="text-red-500">*</span></label>
        <select 
          class="form-input" 
          v-model="assignForm.selectedUser" 
          :class="{ 'border-red-500': formErrors.selectedUser }"
          :disabled="isLoading"
          required
        >
          <option value="">Select a user</option>
          <option v-for="user in userList" :key="user._id || user.id" :value="String(user._id || user.id)">
            {{ user.name }} - {{ user.role }}
          </option>
        </select>
        <span v-if="formErrors.selectedUser" class="text-red-500 text-sm">{{ formErrors.selectedUser }}</span>
      </div>
      
      <!-- Capabilities -->
      <div class="form-group">
        <label class="form-label">
          Assign Capabilities <span class="text-red-500">*</span>
        </label>
        <span v-if="formErrors.capabilities" class="text-red-500 text-sm block mb-2">{{ formErrors.capabilities }}</span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          
          <!-- Items Module -->
          <div class="capability-module">
            <label class="module-header">
              <span>Items Module</span>
            </label>
            <div class="space-y-2 mt-2">
              <label class="capability-item">
                <input 
                  type="checkbox" 
                  v-model="assignForm.capabilities" 
                  value="item-sales" 
                  class="checkbox-input" 
                  :disabled="isLoading"
                />
                <span>Item Sales</span>
              </label>
              <label class="capability-item">
                <input 
                  type="checkbox" 
                  v-model="assignForm.capabilities" 
                  value="item-details" 
                  class="checkbox-input" 
                  :disabled="isLoading"
                />
                <span>Item Details</span>
              </label>
              <label class="capability-item">
                <input 
                  type="checkbox" 
                  v-model="assignForm.capabilities" 
                  value="stock-update" 
                  class="checkbox-input" 
                  :disabled="isLoading"
                />
                <span>Stock Update</span>
              </label>
            </div>
          </div>

          <!-- Suppliers Module -->
          <div class="capability-module">
            <label class="module-header">
              <span>Suppliers Module</span>
            </label>
            <div class="space-y-2 mt-2">
              <label class="capability-item">
                <input 
                  type="checkbox" 
                  v-model="assignForm.capabilities" 
                  value="supplier-details" 
                  class="checkbox-input" 
                  :disabled="isLoading"
                />
                <span>Supplier Details</span>
              </label>
              <label class="capability-item">
                <input 
                  type="checkbox" 
                  v-model="assignForm.capabilities" 
                  value="supply-invoice" 
                  class="checkbox-input" 
                  :disabled="isLoading"
                />
                <span>Supply Invoice</span>
              </label>
            </div>
          </div>

          <!-- Sales Module -->
          <div class="capability-module">
            <label class="module-header">
              <span>Sales Module</span>
            </label>
            <div class="space-y-2 mt-2">
              <label class="capability-item">
                <input 
                  type="checkbox" 
                  v-model="assignForm.capabilities" 
                  value="customer-return-refund" 
                  class="checkbox-input" 
                  :disabled="isLoading"
                />
                <span>Customer Return / Refund</span>
              </label>
              <label class="capability-item">
                <input 
                  type="checkbox" 
                  v-model="assignForm.capabilities" 
                  value="creditors" 
                  class="checkbox-input" 
                  :disabled="isLoading"
                />
                <span>Creditors</span>
              </label>
            </div>
          </div>

          <!-- Reports Module -->
          <div class="capability-module">
            <label class="module-header">
              <span>Reports Module</span>
            </label>
            <div class="space-y-2 mt-2">
              <label class="capability-item">
                <input 
                  type="checkbox" 
                  v-model="assignForm.capabilities" 
                  value="drug-movement" 
                  class="checkbox-input" 
                  :disabled="isLoading"
                />
                <span>Drug Movement</span>
              </label>
              <label class="capability-item">
                <input 
                  type="checkbox" 
                  v-model="assignForm.capabilities" 
                  value="inventory-summary" 
                  class="checkbox-input" 
                  :disabled="isLoading"
                />
                <span>Inventory Summary</span>
              </label>
            </div>
          </div>

          <!-- Expenses Module -->
          <div class="capability-module">
            <label class="module-header">
              <span>Expenses Module</span>
            </label>
            <div class="space-y-2 mt-2">
              <label class="capability-item">
                <input
                  type="checkbox"
                  v-model="assignForm.capabilities"
                  value="view-expenses"
                  class="checkbox-input"
                  :disabled="isLoading"
                />
                <span>View Expenses</span>
              </label>
            </div>
          </div>

        </div>
      </div>
      
      <!-- Duration and scheduling removed per UI change -->
      
      <!-- Reason -->
      <div class="form-group">
        <label class="form-label">Reason for Assignment <span class="text-red-500">*</span></label>
        <textarea 
          class="form-input" 
          :class="{ 'border-red-500': formErrors.reason }"
          v-model="assignForm.reason" 
          :disabled="isLoading"
          required
          placeholder="Explain why capabilities are being assigned..."
          rows="3"
        ></textarea>
        <span v-if="formErrors.reason" class="text-red-500 text-sm">{{ formErrors.reason }}</span>
      </div>
      
      <!-- Permission level removed per UI change -->
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
        <button 
          type="button" 
          class="btn btn-secondary order-2 sm:order-1" 
          @click="goBack"
          :disabled="isLoading"
        >
          Cancel
        </button>
        <button 
          type="button" 
          class="btn btn-primary order-1 sm:order-2" 
          @click="assignCapabilities"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Assigning...</span>
          <span v-else>Assign Capabilities</span>
        </button>
      </div>
      
      <!-- Active Assignments -->
      <div v-if="activeAssignments.length > 0" class="mt-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="section-title">Active Capability Assignments</h3>
          <button 
            @click="fetchActiveAssignments" 
            class="btn btn-secondary text-sm py-2 px-4"
            :disabled="isLoading"
          >
            Refresh
          </button>
        </div>
        <div class="assignments-container">
          <div v-for="assignment in activeAssignments" :key="assignment._id || assignment.id" class="assignment-card">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div class="flex-1">
                <p class="assignment-user">User: {{ assignment.name || assignment.user_name }}</p>
                <p v-if="assignment.role || assignment.user_role" class="assignment-detail text-sm text-gray-500">
                  <span class="detail-label">Assigned role:</span>
                  {{ assignment.role || assignment.user_role }}
                </p>
                <p class="assignment-detail">
                  <span class="detail-label">Capabilities:</span> 
                  {{ displayCapabilities(assignment) }}
                </p>
                
                <p v-if="assignment.created_at" class="assignment-detail">
                  <span class="detail-label">Assigned:</span> 
                  {{ formatDate(assignment.created_at) }}
                </p>
                <p v-if="assignment.end_time" class="assignment-detail">
                  <span class="detail-label">Expires:</span> 
                  {{ formatDate(assignment.end_time) }}
                </p>
                <p class="assignment-detail">
                  <span class="detail-label">Reason:</span> 
                  {{ assignment.reason }}
                </p>
                <!-- Status removed per request -->
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-4">
                <div v-if="!isAdminAssignment(assignment)" class="flex flex-col space-y-2">
                  <button 
                    @click="removeAssignment(assignment._id || assignment.id)"
                    class="btn btn-danger text-sm py-2 px-4"
                    :disabled="isLoading"
                  >
                    Remove Assignment
                  </button>
                  <form @submit.prevent="deleteUser(assignment._id || assignment.id)">
                    <button type="submit" class="btn btn-secondary text-sm py-2 px-4" :disabled="isLoading">
                      Delete User
                    </button>
                  </form>
                </div>
                <!-- admin: no actions shown -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Active Assignments -->
      <div v-else class="mt-8 text-center py-8 no-assignments">
        <p>No active capability assignments</p>
        <button 
          @click="fetchActiveAssignments" 
          class="btn btn-secondary mt-4"
          :disabled="isLoading"
        >
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';

const emit = defineEmits(['go-back']);

const successMessage = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const formErrors = reactive({});

// Data from backend
const userList = ref([]);
const activeAssignments = ref([]);

const assignForm = reactive({
  selectedUser: '',
  capabilities: [],
  reason: ''
});


// API base URL
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

// Theme is managed by the main navbar; local theme functions removed

// API Methods
async function fetchUsers() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      errorMessage.value = 'No authentication token found';
      return;
    }

    const response = await fetch(`${API_BASE}/capabilities/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      userList.value = await response.json();
    } else if (response.status === 401) {
      errorMessage.value = 'Authentication failed. Please login again.';
      // Redirect to login or handle authentication failure
    } else {
      errorMessage.value = 'Failed to fetch users';
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    errorMessage.value = 'Network error. Please check if server is running.';
  }
}

async function fetchActiveAssignments() {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      errorMessage.value = 'No authentication token found';
      return;
    }

    const response = await fetch(`${API_BASE}/capabilities/assignments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      activeAssignments.value = await response.json();
    } else if (response.status === 401) {
      errorMessage.value = 'Authentication failed. Please login again.';
    } else {
      errorMessage.value = 'Failed to fetch assignments';
    }
  } catch (error) {
    console.error('Error fetching assignments:', error);
    errorMessage.value = 'Network error. Please check if server is running.';
  } finally {
    isLoading.value = false;
  }
}

async function assignCapabilities() {
  successMessage.value = '';
  errorMessage.value = '';
  // Clear reactive formErrors object without reassigning
  Object.keys(formErrors).forEach(key => delete formErrors[key]);

  if (!validateForm()) {
    errorMessage.value = "Please fix the errors in the form";
    return;
  }

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      errorMessage.value = 'No authentication token found';
      return;
    }

    // Backend expects individual assignment calls with { userId, capability }
    const failures = [];
    for (const cap of assignForm.capabilities) {
      try {
        const resp = await fetch(`${API_BASE}/capabilities/assign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId: assignForm.selectedUser, capability: cap })
        });

        const respData = await resp.json();
        if (!resp.ok) {
          failures.push(respData.message || respData.error || `Failed to assign ${cap}`);
        }
        else {
          // If we're assigning to the currently logged-in user, update stored user object
          try {
            const raw = localStorage.getItem('user');
            if (raw && respData.user && (respData.user.id || respData.user._id)) {
              const me = JSON.parse(raw);
              const currentId = me.id || me._id;
              const updatedId = respData.user.id || respData.user._id || String(assignForm.selectedUser);
              if (String(currentId) === String(updatedId)) {
                // merge capabilities
                me.capabilities = Array.from(new Set([...(me.capabilities || []), ...(respData.user.capabilities || [])]));
                localStorage.setItem('user', JSON.stringify(me));
              }
            }
          } catch (e) {
            // ignore localStorage merge errors
          }
        }
      } catch (err) {
        console.error('Error assigning capability:', err);
        failures.push(`Network error assigning ${cap}`);
      }
    }

    if (failures.length > 0) {
      errorMessage.value = failures.join('; ');
    } else {
      successMessage.value = 'Capabilities assigned successfully';
      await fetchActiveAssignments(); // Refresh the list
      resetForm();
      // Auto-hide success message after 5 seconds
      setTimeout(() => { successMessage.value = ''; }, 5000);
    }
  } catch (error) {
    console.error('Error assigning capabilities:', error);
    errorMessage.value = "Network error. Please try again.";
  } finally {
    isLoading.value = false;
  }
}

async function removeAssignment(assignmentId) {
  if (!confirm('Are you sure you want to remove this assignment?')) {
    return;
  }

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      errorMessage.value = 'No authentication token found';
      return;
    }

    const response = await fetch(`${API_BASE}/capabilities/assignments/${assignmentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      successMessage.value = "Assignment removed successfully";
      await fetchActiveAssignments(); // Refresh the list
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } else {
      const data = await response.json();
      errorMessage.value = data.error || "Failed to remove assignment";
    }
  } catch (error) {
    console.error('Error removing assignment:', error);
    errorMessage.value = "Error removing assignment";
  } finally {
    isLoading.value = false;
  }
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      errorMessage.value = 'No authentication token found';
      return;
    }

    const resp = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (resp.ok) {
      successMessage.value = 'User deleted successfully';
      await fetchUsers();
      await fetchActiveAssignments();
      setTimeout(() => { successMessage.value = ''; }, 3000);
    } else {
      const d = await resp.json().catch(() => ({}));
      errorMessage.value = d.message || d.error || 'Failed to delete user';
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    errorMessage.value = 'Network error. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function validateForm() {
  // Clear previous errors
  Object.keys(formErrors).forEach(key => delete formErrors[key]);
  
  let isValid = true;

  if (!assignForm.selectedUser) {
    formErrors.selectedUser = "Please select a user";
    isValid = false;
  }

  if (assignForm.capabilities.length === 0) {
    formErrors.capabilities = "Please select at least one capability";
    isValid = false;
  }

  if (!assignForm.reason.trim()) {
    formErrors.reason = "Please provide a reason for assignment";
    isValid = false;
  }

  return isValid;
}

function resetForm() {
  assignForm.selectedUser = '';
  assignForm.capabilities = [];
  assignForm.reason = '';
  // Clear form errors
  Object.keys(formErrors).forEach(key => delete formErrors[key]);
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCapabilities(capabilities) {
  if (typeof capabilities === 'string') {
    try {
      capabilities = JSON.parse(capabilities);
    } catch (e) {
      console.error('Error parsing capabilities:', e);
      return capabilities;
    }
  }

  const capabilityLabels = {
    'item-sales': 'Item Sales',
    'item-details': 'Item Details',
    'stock-update': 'Stock Update',
    'supplier-details': 'Supplier Details',
    'supply-invoice': 'Supply Invoice',
    'customer-return-refund': 'Customer Return/Refund',
    'creditors': 'Creditors',
    'drug-movement': 'Drug Movement',
    'inventory-summary': 'Inventory Summary',
    'view-expenses': 'View Expenses'
  };
  
  return capabilities.map(cap => capabilityLabels[cap] || cap).join(', ');
}

function displayCapabilities(assignment) {
  if (!assignment) return '';
  const role = (assignment.role || '').toString().toLowerCase();
  if (role.includes('admin') || role.includes('administrator')) return 'Full Access';
  const caps = assignment.capabilities || [];
  // If core admin-like capabilities present, show full access label
  if (caps.includes('manage_users') && caps.includes('manage_items')) return 'Full Access';
  return formatCapabilities(caps);
}

function isAdminAssignment(assignment) {
  if (!assignment) return false;
  const role = (assignment.role || '').toString().toLowerCase();
  if (role.includes('admin') || role.includes('administrator')) return true;
  const caps = assignment.capabilities || [];
  if (caps.includes('manage_users') && caps.includes('manage_items')) return true;
  return false;
}

function assignedLabel(assignment) {
  // kept for backward compatibility but now simply return the stored role or 'N/A'
  if (!assignment) return 'N/A';
  return assignment.role || assignment.user_role || 'N/A';
}

function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'text-green-600 font-semibold';
    case 'inactive':
      return 'text-red-600 font-semibold';
    case 'expired':
      return 'text-orange-600 font-semibold';
    default:
      return 'text-gray-600';
  }
}

function goBack() {
  emit('go-back');
}

onMounted(() => {
  // Fetch initial data
  fetchUsers();
  fetchActiveAssignments();
});
</script>

<style scoped>
/* Add loading state styles */
.alert-info {
  background-color: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}

.dark .alert-info {
  background-color: #1e3a8a;
  color: #dbeafe;
  border-color: #3b82f6;
}

/* Disabled state styles */
button:disabled,
select:disabled,
input:disabled,
textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Status badges */
.text-green-600 {
  color: #059669;
}

.text-red-600 {
  color: #dc2626;
}

.text-orange-600 {
  color: #ea580c;
}

.dark .text-green-600 {
  color: #34d399;
}

.dark .text-red-600 {
  color: #f87171;
}

.dark .text-orange-600 {
  color: #fb923c;
}

/* Keep all your existing styles below */
/* Header Actions */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.theme-toggle-container {
  display: flex;
  gap: 0.25rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
}

.theme-btn:hover {
  background: #e5e7eb;
}

.theme-btn.active {
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 1.5;
}

.light-btn .theme-icon {
  color: #f59e0b;
}

.dark-btn .theme-icon {
  color: #4b5563;
}

.auto-btn .theme-icon {
  color: #6b7280;
}

.theme-btn.active .theme-icon {
  color: #1e40af;
}

/* Light Mode (Default) */
.page-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.page-header {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
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
  background-color: white;
  color: #111827;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.form-input::placeholder {
  color: #9ca3af;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  width: 100%;
}

@media (min-width: 640px) {
  .btn {
    width: auto;
  }
}

.btn-primary {
  background-color: #1e40af;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1e3a8a;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
  transform: translateY(-1px);
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}

.alert-success {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert-error {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.text-red-500 {
  color: #ef4444;
}

.border-red-500 {
  border-color: #ef4444;
}

.capability-module {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
}

.module-header {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #111827;
}

.capability-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-radius: 0.25rem;
  padding-left: 0.5rem;
  color: #374151;
}

.capability-item:hover {
  background-color: #f1f5f9;
}

.checkbox-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  background-color: white;
}

.radio-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  background-color: white;
}

.duration-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease;
  color: #374151;
}

.duration-option:hover {
  background-color: #f1f5f9;
}

.permission-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.assignments-container {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.assignment-card {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 0.75rem;
  transition: box-shadow 0.15s ease;
}

.assignment-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.assignment-user {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.assignment-detail {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.detail-label {
  font-weight: 500;
  color: #374151;
}

.no-assignments {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  color: #6b7280;
}

/* Dark Mode */
.dark .page-container {
  background: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Also support Tailwind 'dark' class on document root */
.dark .page-container {
  background: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark .page-header {
  color: #60a5fa;
}

.dark .page-header {
  color: #60a5fa;
}

.dark .header-actions {
  border-bottom-color: #374151;
}

.dark .theme-toggle-container {
  background: #374151;
  border-color: #4b5563;
}

.dark .theme-btn:hover {
  background: #4b5563;
}

.dark .theme-btn.active {
  background: #6b7280;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.dark .theme-btn.active .theme-icon {
  color: #60a5fa;
}

.dark .form-label {
  color: #d1d5db;
}

.dark .form-input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.dark .form-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

.dark .form-input::placeholder {
  color: #9ca3af;
}

.dark select.form-input {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
}

.dark .btn-primary { background-color: #2563eb; }
.dark .btn-primary:hover:not(:disabled) { background-color: #1d4ed8; }

.dark .btn-secondary { background-color: #4b5563; }
.dark .btn-secondary:hover:not(:disabled) { background-color: #374151; }

.dark .btn-danger { background-color: #dc2626; }
.dark .btn-danger:hover:not(:disabled) { background-color: #b91c1c; }

.dark .alert-success { background-color: #064e3b; color: #a7f3d0; border-color: #047857; }
.dark .alert-error { background-color: #7f1d1d; color: #fecaca; border-color: #b91c1c; }

.dark .capability-module { background-color: #374151; border-color: #4b5563; }
.dark .module-header { color: #f9fafb; }
.dark .capability-item { color: #d1d5db; }
.dark .capability-item:hover { background-color: #4b5563; }
.dark .checkbox-input, .dark .radio-input { background-color: #4b5563; border-color: #6b7280; }
.dark .duration-option { color: #d1d5db; }
.dark .duration-option:hover { background-color: #4b5563; }
.dark .permission-hint { color: #9ca3af; }
.dark .section-title { color: #f9fafb; }
.dark .assignments-container { background-color: #374151; border-color: #4b5563; }
.dark .assignment-card { background-color: #4b5563; border-color: #6b7280; }
.dark .assignment-user { color: #f9fafb; }
.dark .assignment-detail { color: #d1d5db; }
.dark .detail-label { color: #e5e7eb; }
.dark .no-assignments { background-color: #374151; color: #9ca3af; }

/* Alert info */
.dark .alert-info { background-color: #1e3a8a; color: #dbeafe; border-color: #3b82f6; }

.dark .header-actions {
  border-bottom-color: #374151;
}

.dark .theme-toggle-container {
  background: #374151;
  border-color: #4b5563;
}

.dark .theme-btn:hover {
  background: #4b5563;
}

.dark .theme-btn.active {
  background: #6b7280;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.dark .theme-btn.active .theme-icon {
  color: #60a5fa;
}

.dark .form-label {
  color: #d1d5db;
}

.dark .form-input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.dark .form-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

.dark .form-input::placeholder {
  color: #9ca3af;
}

.dark select.form-input {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
}

.dark .btn-primary {
  background-color: #2563eb;
}

.dark .btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.dark .btn-secondary {
  background-color: #4b5563;
}

.dark .btn-secondary:hover:not(:disabled) {
  background-color: #374151;
}

.dark .btn-danger {
  background-color: #dc2626;
}

.dark .btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
}

.dark .alert-success {
  background-color: #064e3b;
  color: #a7f3d0;
  border-color: #047857;
}

.dark .alert-error {
  background-color: #7f1d1d;
  color: #fecaca;
  border-color: #b91c1c;
}

.dark .capability-module {
  background-color: #374151;
  border-color: #4b5563;
}

.dark .module-header {
  color: #f9fafb;
}

.dark .capability-item {
  color: #d1d5db;
}

.dark .capability-item:hover {
  background-color: #4b5563;
}

.dark .checkbox-input,
.dark .radio-input {
  background-color: #4b5563;
  border-color: #6b7280;
}

.dark .duration-option {
  color: #d1d5db;
}

.dark .duration-option:hover {
  background-color: #4b5563;
}

.dark .permission-hint {
  color: #9ca3af;
}

.dark .section-title {
  color: #f9fafb;
}

.dark .assignments-container {
  background-color: #374151;
  border-color: #4b5563;
}

.dark .assignment-card {
  background-color: #4b5563;
  border-color: #6b7280;
}

.dark .assignment-user {
  color: #f9fafb;
}

.dark .assignment-detail {
  color: #d1d5db;
}

.dark .detail-label {
  color: #e5e7eb;
}

.dark .no-assignments {
  background-color: #374151;
  color: #9ca3af;
}


@media (prefers-color-scheme: dark) {
  .auto-theme .page-container {
    background: #1f2937;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .auto-theme .page-header {
    color: #60a5fa;
  }

  .auto-theme .header-actions {
    border-bottom-color: #374151;
  }

  .auto-theme .theme-toggle-container {
    background: #374151;
    border-color: #4b5563;
  }

  .auto-theme .theme-btn:hover {
    background: #4b5563;
  }

  .auto-theme .theme-btn.active {
    background: #6b7280;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .auto-theme .theme-btn.active .theme-icon {
    color: #60a5fa;
  }

  .auto-theme .form-label {
    color: #d1d5db;
  }

  .auto-theme .form-input {
    background-color: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .auto-theme .form-input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
  }

  .auto-theme .form-input::placeholder {
    color: #9ca3af;
  }

  .auto-theme select.form-input {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  }

  .auto-theme .btn-primary {
    background-color: #2563eb;
  }

  .auto-theme .btn-primary:hover:not(:disabled) {
    background-color: #1d4ed8;
  }

  .auto-theme .btn-secondary {
    background-color: #4b5563;
  }

  .auto-theme .btn-secondary:hover:not(:disabled) {
    background-color: #374151;
  }

  .auto-theme .btn-danger {
    background-color: #dc2626;
  }

  .auto-theme .btn-danger:hover:not(:disabled) {
    background-color: #b91c1c;
  }

  .auto-theme .alert-success {
    background-color: #064e3b;
    color: #a7f3d0;
    border-color: #047857;
  }

  .auto-theme .alert-error {
    background-color: #7f1d1d;
    color: #fecaca;
    border-color: #b91c1c;
  }

  .auto-theme .capability-module {
    background-color: #374151;
    border-color: #4b5563;
  }

  .auto-theme .module-header {
    color: #f9fafb;
  }

  .auto-theme .capability-item {
    color: #d1d5db;
  }

  .auto-theme .capability-item:hover {
    background-color: #4b5563;
  }

  .auto-theme .checkbox-input,
  .auto-theme .radio-input {
    background-color: #4b5563;
    border-color: #6b7280;
  }

  .auto-theme .duration-option {
    color: #d1d5db;
  }

  .auto-theme .duration-option:hover {
    background-color: #4b5563;
  }

  .auto-theme .permission-hint {
    color: #9ca3af;
  }

  .auto-theme .section-title {
    color: #f9fafb;
  }

  .auto-theme .assignments-container {
    background-color: #374151;
    border-color: #4b5563;
  }

  .auto-theme .assignment-card {
    background-color: #4b5563;
    border-color: #6b7280;
  }

  .auto-theme .assignment-user {
    color: #f9fafb;
  }

  .auto-theme .assignment-detail {
    color: #d1d5db;
  }

  .auto-theme .detail-label {
    color: #e5e7eb;
  }

  .auto-theme .no-assignments {
    background-color: #374151;
    color: #9ca3af;
  }
}

@media (max-width: 768px) {
  .form-container {
    padding: 0 0.5rem;
  }
  
  .page-container {
    padding: 1rem;
    margin-top: 1rem;
  }

  .header-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .theme-toggle-container {
    align-self: stretch;
    justify-content: center;
  }
}
</style>