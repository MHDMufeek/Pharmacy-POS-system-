<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">🚫 No Access</h1>
      <p class="mb-6">You don’t have permission to view this page.</p>
      <router-link
        to="/dashboard"
        class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Go to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoAccess",
};
</script>
