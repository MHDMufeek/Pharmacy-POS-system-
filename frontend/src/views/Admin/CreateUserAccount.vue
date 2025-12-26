<template>
  <div class="page-container dark:bg-slate-900 dark:text-white">
    
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
  <span class="text-lg">{{ showPassword ? '🙈' : '👁️' }}</span>
</button>
            </div>
            
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
  <span class="text-lg">{{ showConfirmPassword ? '🙈' : '👁️' }}</span>
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
import axios from 'axios';

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

// Theme is managed by the main navbar; local theme toggle removed

function createUser() {
  successMessage.value = '';
  errorMessage.value = '';

  if (userForm.value.password !== userForm.value.confirmPassword) {
    errorMessage.value = "Passwords don't match";
    return;
  }

  

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userForm.value.email)) {
    errorMessage.value = "Please enter a valid email address";
    return;
  }

  // prepare payload for backend (backend expects `name`, `email`, `password`)
  const payload = {
    name: `${userForm.value.firstName.trim()} ${userForm.value.lastName.trim()}`.trim(),
    email: String(userForm.value.email).toLowerCase(),
    password: userForm.value.password,
    role: userForm.value.role
  };

  const api = axios.create({ baseURL: 'http://localhost:3000/api' });

  api
    .post('/auth/register', payload)
    .then((res) => {
      successMessage.value = res.data && res.data.name ? `User ${res.data.name} created successfully` : 'User account created successfully!';
      resetForm();
    })
    .catch((err) => {
      // prefer server message when available
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage.value = err.response.data.message;
      } else if (err.response && err.response.data && err.response.data.errors) {
        errorMessage.value = err.response.data.errors.map(e => e.msg || e.message).join('; ');
      } else {
        errorMessage.value = 'Failed to create user. Please try again.';
      }
    });
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
/* Light mode (default) */
.page-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  min-height: 100vh;
}

.page-header {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.3s ease;
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
  color: #374151;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
}

.password-input-container {
  position: relative;
}

.password-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
}

.permission-text, .status-text {
  color: #374151;
  transition: all 0.3s ease;
}

.checkbox-input, .radio-input {
  margin-right: 0.5rem;
}

.theme-toggle-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #374151;
}

.theme-toggle-btn:hover {
  background: #e5e7eb;
}

.theme-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.text-red-500 {
  color: #ef4444;
}

/* Dark mode styles */
.dark .page-container {
  background: #1f2937;
  color: #f9fafb;
}

.dark .page-container .page-header {
  color: #60a5fa;
  border-bottom-color: #374151;
}

.dark .page-container .form-label {
  color: #d1d5db;
}

.dark .page-container .form-input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.dark .page-container .form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  background-color: #4b5563;
}

.dark .page-container select.form-input {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
}

.dark .page-container .btn-secondary {
  background-color: #6b7280;
  color: #f9fafb;
}

.dark .page-container .btn-secondary:hover {
  background-color: #4b5563;
}

.dark .page-container .alert-success {
  background-color: #065f46;
  color: #d1fae5;
  border-color: #047857;
}

.dark .page-container .alert-error {
  background-color: #7f1d1d;
  color: #fecaca;
  border-color: #991b1b;
}

.dark .page-container .password-toggle {
  color: #9ca3af;
}

.dark .page-container .password-hint {
  color: #9ca3af;
}

.dark .page-container .permission-text,
.dark .page-container .status-text {
  color: #d1d5db;
}

.dark .page-container .theme-toggle-btn {
  background: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

.dark .page-container .theme-toggle-btn:hover {
  background: #4b5563;
}

/* Checkbox and Radio styles for dark mode */
.dark .page-container .checkbox-input,
.dark .page-container .radio-input {
  filter: brightness(0.8);
}

/* Placeholder text for dark mode */
.dark .page-container .form-input::placeholder {
  color: #9ca3af;
}

/* Selection styles */
.dark .page-container .form-input option {
  background-color: #374151;
  color: #f9fafb;
}
</style>