<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header class="bg-gray-800 text-white p-4">
      Header
    </header>

    <!-- Scrollable Content -->
    <main class="flex-1 overflow-y-auto p-4 bg-gray-100">
      <!-- Long content here -->
      <div class="h-[2000px] bg-white rounded shadow p-4">
        Scrollable Content
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white p-4">
      Footer
    </footer>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
