<template>
  <section class="max-w-3xl mx-auto px-4 py-12 text-center">
    <div class="bg-white/90 border border-gray-100 rounded-xl shadow-sm p-8">
      <h1 class="text-3xl font-serif font-bold mb-4">
        Registration submitted!
      </h1>
      <p class="text-gray-700 mb-6">Check your email for a confirmation.</p>
      <p v-if="athleteName" class="text-lg font-semibold mb-6">
        Thank you, {{ athleteName }}.
      </p>
      <RouterLink
        to="/"
        class="inline-flex items-center justify-center bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition"
      >
        Back to Home
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const athleteName = ref("");
try {
  athleteName.value = localStorage.getItem("nbaw_reg_name") || "";
} catch {
  athleteName.value = "";
}
</script>
