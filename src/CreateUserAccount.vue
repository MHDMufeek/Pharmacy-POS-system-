<template>
  <div class="page-container">
    <h2 class="page-header">Create User Account</h2>
    
    <div class="form-container">
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="createUser">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- First Name -->
          <div class="form-group">
            <label class="form-label">First Name <span class="text-red-500">*</span></label>
            <input 
              type="text" 
              v-model="userForm.firstName" 
              required
              placeholder="Enter first name"
              class="form-input"
            >
          </div>
          
          <!-- Last Name -->
          <div class="form-group">
            <label class="form-label">Last Name <span class="text-red-500">*</span></label>
            <input 
              type="text" 
              v-model="userForm.lastName" 
              required
              placeholder="Enter last name"
              class="form-input"
            >
          </div>
        </div>
        
        <!-- Email -->
        <div class="form-group">
          <label class="form-label">Email Address <span class="text-red-500">*</span></label>
          <input 
            type="email" 
            v-model="userForm.email" 
            required
            placeholder="user@example.com"
            class="form-input"
          >
        </div>
        
        <!-- Username -->
        <div class="form-group">
          <label class="form-label">Username <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            v-model="userForm.username" 
            required
            placeholder="Choose a username"
            class="form-input"
          >
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Password -->
          <div class="form-group">
            <label class="form-label">Password <span class="text-red-500">*</span></label>
            <div class="password-input-container">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="userForm.password" 
                required
                placeholder="Enter password"
                class="form-input"
              >
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Must be at least 8 characters with a mix of letters, numbers and symbols</p>
          </div>
          
          <!-- Confirm Password -->
          <div class="form-group">
            <label class="form-label">Confirm Password <span class="text-red-500">*</span></label>
            <div class="password-input-container">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                v-model="userForm.confirmPassword" 
                required
                placeholder="Confirm password"
                class="form-input"
              >
              <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                <span class="material-icons">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Role -->
        <div class="form-group">
          <label class="form-label">Position/Role <span class="text-red-500">*</span></label>
          <select v-model="userForm.role" required class="form-input">
            <option value="">Select a role</option>
            <option value="administrator">Administrator</option>
            <option value="manager">Manager</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="assistant">Assistant</option>
            <option value="cashier">Cashier</option>
          </select>
        </div>
        
        <!-- Permissions -->
        <div class="form-group">
          <label class="form-label">Permissions</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 ">
            <label class="flex items-center">
              <input type="checkbox" v-model="userForm.permissions" value="inventory" class="mr-2">
              <span class="font-serif text-black">Inventory Management</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="userForm.permissions" value="sales" class="mr-2">
              <span class="font-serif text-black">Sales Management</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="userForm.permissions" value="reports" class="mr-2">
              <span class="font-serif text-black">View Reports</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="userForm.permissions" value="users" class="mr-2">
              <span class="font-serif text-black ">User Management</span>
            </label>
          </div>
        </div>
        
        <!-- Status -->
        <div class="form-group">
          <label class="form-label">Status</label>
          <div class="flex items-center justify-center space-x-4 mt-2">
            <label class="flex items-center">
              <input type="radio" v-model="userForm.status" value="active" class="mr-2">
              <span class="text-black">Active</span>
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="userForm.status" value="inactive" class="mr-2">
              <span class="text-black">Inactive</span>
            </label>
          </div>
        </div>
        
        <!-- Buttons -->
        <div class="flex justify-end mt-6">
          <button type="button" class="btn btn-secondary" @click="goBack">Cancel</button>
          <button type="submit" class="btn btn-primary">Create User</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['go-back']);

const successMessage = ref('');
const errorMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const userForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  role: '',
  permissions: [],
  status: 'active'
});

function createUser() {
  successMessage.value = '';
  errorMessage.value = '';

  if (userForm.value.password !== userForm.value.confirmPassword) {
    errorMessage.value = "Passwords don't match";
    return;
  }

  if (userForm.value.password.length < 8) {
    errorMessage.value = "Password must be at least 8 characters long";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userForm.value.email)) {
    errorMessage.value = "Please enter a valid email address";
    return;
  }

  console.log("Creating user:", userForm.value);

  setTimeout(() => {
    successMessage.value = "User account created successfully!";
    resetForm();
  }, 1000);
}

function resetForm() {
  userForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    permissions: [],
    status: 'active'
  };
  showPassword.value = false;
  showConfirmPassword.value = false;
}

function goBack() {
  emit('go-back');
}
</script>

<style scoped>
.page-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(234, 223, 223, 0.1);
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.page-header {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-container {
  max-width: 700px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #011338;
  margin-bottom: 0.5rem;
}

/* 🔹 Updated input box styles */
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.15s ease;
  background-color: #f9fafb; /* light gray */
  color: #111827;            /* dark text */
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background-color: #ffffff; /* white when typing */
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
}

.btn-primary {
  background-color: #1e40af;
  color: white;
}
.btn-primary:hover {
  background-color: #1e3a8a;
}
.btn-secondary {
  background-color: #9ca3af;
  color: white;
  margin-right: 0.75rem;
}
.btn-secondary:hover {
  background-color: #6b7280;
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

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
}

.password-input-container {
  position: relative;
}

.text-red-500 {
  color: #ef4444;
}
</style>

