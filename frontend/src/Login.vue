<template>
    <div
      class="flex items-center justify-center min-h-screen transition-colors"
      :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'"
    >
      <div
        class="w-full max-w-md p-8 rounded-2xl shadow-lg"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Login</h2>
  
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-full transition"
            :class="isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'"
          >
            <span v-if="isDark">🌙</span>
            <span v-else>☀️</span>
          </button>
        </div>
  
        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 text-sm text-red-500">
          {{ errorMessage }}
        </div>
  
        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 text-sm text-green-500">
          {{ successMessage }}
        </div>
  
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Role Selector -->
          <div>
            <label class="block mb-1 font-medium">Select Role</label>
            <select
              v-model="role"
              class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              :class="isDark ? 'bg-gray-700 border-gray-600 focus:ring-blue-400' : 'bg-gray-100 border-gray-300 focus:ring-blue-600'"
              required
            >
              <option disabled value="">-- Choose Role --</option>
              <option value="admin">Admin</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="store_manager">Store Manager</option>
            </select>
          </div>
  
          <!-- Password -->
          <div>
            <label class="block mb-1 font-medium">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                :class="isDark ? 'bg-gray-700 border-gray-600 focus:ring-blue-400' : 'bg-gray-100 border-gray-300 focus:ring-blue-600'"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-3 top-2 text-sm"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>
  
          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-2 rounded-lg font-semibold transition"
            :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "LoginPage",
    data() {
      return {
        password: "",
        role: "",
        showPassword: false,
        isDark: false,
        errorMessage: "",
        successMessage: "",
      };
    },
    methods: {
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
      toggleTheme() {
        this.isDark = !this.isDark;
      },
      handleLogin() {
        // Dummy validation (replace with API in real case)
        if (
          (this.role === "admin" && this.password === "1234") ||
          (this.role === "pharmacist" && this.password === "1234") ||
          (this.role === "store_manager" && this.password === "1234")
        ) {
          this.successMessage = "Login successful 🎉 Redirecting...";
          this.errorMessage = "";
  
          // Redirect to Dashboard.vue
          setTimeout(() => {
            this.$router.push("/dashboard");
          }, 1000);
        } else {
          this.errorMessage = "Invalid role or password.";
          this.successMessage = "";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  * {
    transition: background-color 0.3s, color 0.3s;
  }
  </style>
  