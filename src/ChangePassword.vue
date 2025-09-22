<template>
  <div :class="['page-container', theme]">
    <!-- Theme Toggle Button -->
    <div class="theme-toggle" @click="toggleTheme">
      <div :class="['icon', theme]">
        <div class="sun-rays"></div>
        <div class="moon"></div>
      </div>
    </div>

    <div class="form-card">
      <h2 class="page-header">Change Password</h2>

      <!-- Success / Error -->
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <form @submit.prevent="changePassword">
        <!-- Current Password -->
        <div class="form-group">
          <label class="form-label">Current Password</label>
          <div class="password-input-container">
            <input
              :type="showCurrentPassword ? 'text' : 'password'"
              class="form-input"
              v-model="passwordForm.currentPassword"
              placeholder="••••••••"
              required
            />
            <button type="button" class="password-toggle" @click="showCurrentPassword = !showCurrentPassword">
              {{ showCurrentPassword ? '🙈' : '👁️' }}
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
              placeholder="••••••••"
              required
            />
            <button type="button" class="password-toggle" @click="showNewPassword = !showNewPassword">
              {{ showNewPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <p class="helper-text">Minimum 8 characters, include letters, numbers & symbols</p>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label class="form-label">Confirm New Password</label>
          <div class="password-input-container">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              v-model="passwordForm.confirmPassword"
              placeholder="••••••••"
              required
            />
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              {{ showConfirmPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Role Selection -->
        <div class="form-group">
          <label class="form-label">Choose Role</label>
          <select v-model="selectedRole" class="form-input" required>
            <option value="" disabled>Select Role</option>
            <option value="admin">Admin</option>
            <option value="editor">Pharmacist</option>
            <option value="user">Store Manager</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="button-group">
          <button type="button" class="btn btn-secondary" @click="goBack">Cancel</button>
          <button type="submit" class="btn btn-primary">Update Password</button>
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
const theme = ref('dark') // default dark

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function changePassword() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!selectedRole.value) { errorMessage.value = 'Please select a role'; return }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) { errorMessage.value = "New passwords don't match"; return }
  if (passwordForm.value.newPassword.length < 8) { errorMessage.value = 'Password must be at least 8 characters long'; return }

  setTimeout(() => {
    successMessage.value = `Password changed successfully! Role set to "${selectedRole.value}".`
    resetForm()
  }, 1000)
}

function resetForm() {
  passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  transition: background 0.3s ease;
  position: relative;
}

/* Theme toggle */
.theme-toggle {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #facc15;
  position: relative;
  transition: all 0.5s ease;
}
.icon.dark { background: #fbbf24; }
.icon .sun-rays {
  position: absolute;
  width: 150%;
  height: 150%;
  top: -25%;
  left: -25%;
  border-radius: 50%;
  box-shadow: 0 -12px #fbbf24, 0 12px #fbbf24, 12px 0 #fbbf24, -12px 0 #fbbf24,
              8px 8px #fbbf24, -8px 8px #fbbf24, 8px -8px #fbbf24, -8px -8px #fbbf24;
  opacity: 1;
  transition: opacity 0.5s ease;
}
.icon.dark .sun-rays { opacity: 0; }
.icon .moon {
  position: absolute;
  width: 50%;
  height: 50%;
  top: 25%;
  left: 25%;
  background: #1f2937;
  border-radius: 50%;
  transform: rotate(45deg);
  transition: all 0.5s ease;
}
.icon.light .moon { background: transparent; }

/* Form card */
.form-card {
  width: 100%;
  max-width: 480px;
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 15px 40px rgba(0,0,0,0.5);
}

/* Dark & Light Themes */
.dark { background: #1f2937; color: #f9fafb; }
.dark .form-card { background: #111827; }
.light { background: #f3f4f6; color: #111827; }
.light .form-card { background: #ffffff; }

/* Form styles */
.form-label { margin-bottom: 0.5rem; font-weight: 600; display: block; }
.form-input { width: 100%; padding: 0.85rem; border-radius: 0.75rem; border: none; margin-bottom: 0.25rem; }
.password-input-container { position: relative; }
.password-toggle { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; }
.button-group { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
.btn { padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; border: none; }
.btn-primary { background: #3b82f6; color: white; }
.btn-primary:hover { background: #2563eb; }
.btn-secondary { background: #6b7280; color: white; }
.btn-secondary:hover { background: #4b5563; }
.alert { padding: 0.9rem 1rem; border-radius: 0.75rem; font-weight: 500; margin-bottom: 1.5rem; text-align: center; }
.alert-success { background: #047857; color: #d1fae5; }
.alert-error { background: #991b1b; color: #fee2e2; }
</style>
