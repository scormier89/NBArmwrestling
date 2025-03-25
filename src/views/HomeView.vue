<template>
    <section>
      <!-- Hero Image -->
      <div
        class="relative h-[500px] bg-fixed bg-center bg-cover bg-no-repeat"
        :style="{ backgroundImage: `url(${heroImage})` }"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 to-[#f8f5f1]/80"></div>
      </div>
  
      <!-- Main Content Panel -->
      <div class="max-w-3xl mx-auto px-4 py-16 text-center bg-[#f8f5f1] -mt-20 relative z-10 rounded shadow-sm">
        <h2 class="text-4xl font-serif font-bold text-gray-900 tracking-tight">
          Arm Wrestling in New Brunswick
        </h2>
        <p class="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
          Welcome to the home of NB Armwrestling — where strength meets community.
          Whether you're a beginner or a seasoned puller, we’ve got a table for you.
        </p>
  
        <!-- CTA: Join Practice -->
        <div class="mt-8">
          <RouterLink
            to="/teams"
            class="inline-block bg-yellow-700 hover:bg-yellow-800 text-white font-semibold py-2 px-6 rounded shadow transition"
          >
            Join a Local Practice
          </RouterLink>
        </div>
  
        <!-- Next Event -->
        <div v-if="eventStore.upcomingEvent" class="mt-16 text-center">
          <h3 class="text-2xl font-bold font-serif mb-4 text-gray-900">Next Event</h3>
  
          <!-- Lightbox Trigger -->
          <img
            :src="eventStore.upcomingEvent.flyer"
            :alt="eventStore.upcomingEvent.title"
            class="w-full max-w-md mx-auto rounded shadow-lg cursor-pointer transition hover:scale-[1.02]"
            @click="openLightbox(eventStore.upcomingEvent.flyer)"
          />
  
          <p class="mt-4 text-lg font-semibold text-gray-800">
            {{ eventStore.upcomingEvent.title }}
          </p>
  
          <p class="text-sm text-gray-600">
            {{ new Date(eventStore.upcomingEvent.date).toLocaleString() }}
          </p>
  
          <button
            class="mt-1 inline-flex items-center space-x-1 text-sm text-blue-700 underline hover:text-blue-900"
            @click="openInMaps(eventStore.upcomingEvent.location)"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 2a6 6 0 016 6c0 4.418-6 10-6 10S4 12.418 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ eventStore.upcomingEvent.location }}</span>
          </button>
  
          <RouterLink
            to="/schedule"
            class="mt-6 block text-yellow-700 font-semibold hover:underline"
          >
            See All Events
          </RouterLink>
        </div>
  
        <p v-else class="text-gray-600 mt-16">No events yet. Check back soon!</p>
  
        <!-- Embedded YouTube Video -->
        <div class="mt-20 max-w-4xl mx-auto">
          <h4 class="text-xl sm:text-2xl font-bold font-serif text-gray-900 mb-4">
            NB Armwrestling Members at the Superman Tournament in Nova Scotia
          </h4>
          <div class="relative rounded overflow-hidden shadow-lg" style="padding-bottom: 56.25%; height: 0;">
            <iframe
              src="https://www.youtube.com/embed/McgTdXpHI5I"
              title="NB Armwrestling Highlights"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
  
      <!-- Lightbox Modal -->
      <div
        v-if="lightboxImage"
        class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
        @click.self="closeLightbox"
      >
        <img :src="lightboxImage" alt="Event Flyer" class="max-w-full max-h-full rounded shadow-xl" />
      </div>
    </section>
  </template>
  
  <script setup>
  import heroImage from '@/assets/images/armwrestlers.jpg'
  import { onMounted, ref } from 'vue'
  import { useEventStore } from '@/stores/eventStore'
  
  const eventStore = useEventStore()
  const lightboxImage = ref(null)
  
  const openLightbox = (src) => {
    lightboxImage.value = src
  }
  
  const closeLightbox = () => {
    lightboxImage.value = null
  }
  
  const openInMaps = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    window.open(url, '_blank')
  }
  
  onMounted(() => {
    eventStore.fetchEvents()
  })
  </script>
  
  <style scoped>
  h2, p {
    transition: opacity 0.3s ease;
  }
  </style>
  