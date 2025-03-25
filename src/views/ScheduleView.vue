<template>
    <section class="max-w-6xl mx-auto px-4 py-12 relative">
      <h1 class="text-2xl font-bold text-center mb-8 sticky top-[80px] bg-white z-10 py-2">Upcoming Events</h1>
  
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <!-- Event List -->
        <div class="flex-1">
          <div v-if="eventStore.events.length === 0" class="text-center text-gray-500">
            No upcoming events.
          </div>
  
          <div v-for="(monthEvents, month) in groupedEvents" :key="month" class="mb-16">
            <div class="mb-16" :ref="el => monthRefs[month] = el" :data-month="month">
              <h2
                class="text-xl font-semibold mb-6 text-gray-800 sticky top-[120px] bg-white z-10 py-2 border-b border-yellow-600"
                :ref="el => monthRefs[month] = el"
                :data-month="month"
              >
                {{ month }}
              </h2>
  
              <EventCard
                v-for="(event, index) in monthEvents"
                :key="event.title"
                :event="event"
                :index="index"
                @lightbox="openLightbox"
                />
            </div>
          </div>
        </div>
  
        <!-- Month Scroller beside cards -->
        <div class="hidden md:flex flex-col sticky top-[250px] min-height[500px] h-fit self-start pt-16">
          <button
            v-for="month in Object.keys(groupedEvents)"
            :key="month"
            @click="scrollToMonth(month)"
            class="transform -rotate-90 origin-left mb-6 text-xs font-semibold tracking-wider text-gray-600 hover:text-yellow-600 transition-colors"
            :class="{ 'text-yellow-700 underline': currentMonth?.trim() === month.trim() }"
          >
            {{ month.slice(0, 3).toUpperCase() }}
            <span
              v-if="currentMonth?.trim() === month.trim()"
              class="block w-1 h-1 bg-yellow-500 rounded-full mx-auto mt-1"
            ></span>
          </button>
        </div>
      </div>
  
      <!-- Lightbox -->
      <div
        v-if="lightboxImage"
        class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
        @click.self="closeLightbox"
      >
        <img :src="lightboxImage" alt="Flyer" class="max-w-full max-h-full rounded shadow-lg" />
      </div>
    </section>
  </template>
  
  <script setup>
  import { onMounted, ref, watch, nextTick } from 'vue'
  import { useEventStore } from '@/stores/eventStore'
  import EventCard from '@/components/EventCard.vue'
  
  const eventStore = useEventStore()
  const groupedEvents = ref({})
  const lightboxImage = ref(null)
  const currentMonth = ref(null)
  const monthRefs = ref({})
  let observer = null
  
  const openLightbox = (src) => {
    lightboxImage.value = src
  }
  
  const closeLightbox = () => {
    lightboxImage.value = null
  }
  
  const scrollToMonth = async (month) => {
    const el = monthRefs.value[month]
    if (!el) return
  
    const top = el.getBoundingClientRect().top + window.scrollY
    const header = document.querySelector('header')
    const headerHeight = header?.offsetHeight || 120
  
    window.scrollTo({
      top: top - headerHeight - 30,
      behavior: 'smooth'
    })
  }
  
  // Watch for events, group them by month
  watch(() => eventStore.events, async (events) => {
    const groups = {}
    events.forEach(e => {
      const date = new Date(e.date)
      const monthLabel = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
      if (!groups[monthLabel]) groups[monthLabel] = []
      groups[monthLabel].push(e)
    })
    groupedEvents.value = groups
  
    await nextTick()
  
    if (observer) observer.disconnect()
  
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const monthAttr = entry.target.getAttribute('data-month')
          currentMonth.value = monthAttr?.trim()
          break
        }
      }
    }, { rootMargin: '-120px 0px -70% 0px' })
  
    for (const month in groups) {
      const el = monthRefs.value[month]
      if (el) observer.observe(el)
    }
  }, { immediate: true })
  
  const openInMaps = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    window.open(url, '_blank')
  }
  
  onMounted(() => {
    eventStore.fetchEvents()
  })
  </script>
  
  <style scoped>
  section {
    font-family: 'Roboto', 'Segoe UI', sans-serif;
  }
  h1, h2 {
    background-color: #f8f5f1;
  }
  </style>
  