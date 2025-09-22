<template>
  <div class="page-container">
    <h2 class="page-header">Change Password</h2>

    <div class="form-container">
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="changePassword">
        <!-- Current Password -->
        <div class="form-group">
          <label class="form-label">Current Password</label>
          <div class="password-input-container">
            <input
              :type="showCurrentPassword ? 'text' : 'password'"
              class="form-input"
              v-model="passwordForm.currentPassword"
              required
            >
            <button
              type="button"
              class="password-toggle"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              <span class="material-icons">
                {{ showCurrentPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div class="form-group">
          <label class="form-label">New Password</label>
          <div class="password-input-container">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              class="form-input"
              v-model="passwordForm.newPassword"
              required
            >
            <button
              type="button"
              class="password-toggle"
              @click="showNewPassword = !showNewPassword"
            >
              <span class="material-icons">
                {{ showNewPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
          <p class="helper-text">
            Must be at least 8 characters with a mix of letters, numbers, and symbols
          </p>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label class="form-label">Confirm New Password</label>
          <div class="password-input-container">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              v-model="passwordForm.confirmPassword"
              required
            >
            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <span class="material-icons">
                {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Role Selection -->
        <div class="form-group">
          <label class="form-label">Choose Role</label>
          <select v-model="selectedRole" class="form-input" required>
            <option value="admin">Admin</option>
            <option value="editor">Pharmacist</option>
            <option value="user">Store Manager</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end">
          <button
            type="button"
            class="btn btn-secondary"
            @click="goBack"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Update Password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['go-back'])

const successMessage = ref('')
const errorMessage = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const selectedRole = ref('')

function changePassword() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!selectedRole.value) {
    errorMessage.value = 'Please select a role'
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errorMessage.value = "New passwords don't match"
    return
  }

  if (passwordForm.value.newPassword.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long'
    return
  }

  console.log('Changing password:', passwordForm.value)
  console.log('Selected role:', selectedRole.value)

  setTimeout(() => {
    successMessage.value = `Password changed successfully! Role set to "${selectedRole.value}".`
    resetForm()
  }, 1000)
}

function resetForm() {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  selectedRole.value = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

function goBack() {
  emit('go-back')
}
</script>

<style scoped>
.page-container {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-top: 1.5rem;
}

.page-header {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-container {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #ffffff;
  color: #111827;
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.helper-text {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(90deg, #2563eb, #1e40af);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #1d4ed8, #1e3a8a);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #9ca3af;
  color: white;
  margin-right: 0.75rem;
}

.btn-secondary:hover {
  background-color: #6b7280;
  transform: translateY(-1px);
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.alert-success {
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.password-input-container {
  position: relative;
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
  font-size: 1.25rem;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #2563eb;
}

@media (max-width: 768px) {
  .form-container {
    padding: 0 1rem;
  }
}
</style>
