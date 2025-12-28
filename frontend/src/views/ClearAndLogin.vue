<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">🔄 Refreshing Session</h1>
      <p class="text-gray-600">Clearing old tokens and redirecting to login...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClearAndLogin',
  mounted() {
    // Clear all token-related storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✓ Cleared localStorage');
    try { window.dispatchEvent(new Event('authChanged')); } catch(e) {}
    
    // Redirect to login after 1 second
    setTimeout(() => {
      this.$router.push('/login');
    }, 1000);
  }
};
</script>
