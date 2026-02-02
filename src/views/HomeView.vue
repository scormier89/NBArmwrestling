<template>
  <section>
    <!-- Hero Section with Logo -->
    <div
      class="relative h-[500px] bg-fixed bg-center bg-cover bg-no-repeat flex flex-col items-center justify-center"
      :style="{ backgroundImage: `url(${heroImage})` }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#f8f5f1]/90"
      ></div>
    </div>

    <!-- Main Content Panel -->
    <div
      class="max-w-3xl mx-auto px-4 py-16 text-center bg-[#f8f5f1] -mt-28 relative z-10 rounded-xl shadow-md"
    >
      <h2
        class="text-5xl sm:text-6xl font-serif font-extrabold text-gray-900 tracking-tight mb-6"
        style="font-family: 'Playfair Display', serif"
      >
        Arm Wrestling in New Brunswick
      </h2>
      <p
        class="mt-6 text-gray-700 text-lg sm:text-xl leading-relaxed font-light"
      >
        Welcome to the home of NB Armwrestling —
        <span class="font-semibold text-blue-900"
          >where strength meets community</span
        >.<br />
        Whether you're a beginner or a seasoned puller, we’ve got a table for
        you.
      </p>

      <!-- CTA: Join Practice -->
      <div class="mt-10">
        <RouterLink
          to="/teams"
          class="inline-block bg-blue-700 hover:bg-blue-800 !text-white hover:!text-white font-bold text-lg py-3 px-10 rounded-full shadow-lg shadow-blue-200/40 transition-all duration-200 tracking-wide border-2 border-blue-800"
          style="letter-spacing: 0.04em"
        >
          Join a Local Practice
        </RouterLink>
      </div>

      <!-- Next Event -->
      <hr
        class="my-16 border-t-2 border-gray-200/60 w-2/3 mx-auto rounded-full"
      />
      <div v-if="eventStore.upcomingEvent" class="mt-20 flex justify-center">
        <div
          class="bg-white/90 border-2 border-blue-700 rounded-xl shadow-md px-8 py-8 max-w-md w-full text-center"
        >
          <h3
            class="text-2xl font-bold font-serif mb-4 text-gray-900 tracking-tight"
          >
            Next Event
          </h3>
          <!-- Lightbox Trigger -->
          <img
            :src="eventStore.upcomingEvent.flyer || logoImage"
            :alt="eventStore.upcomingEvent.title"
            class="w-full max-w-xs mx-auto rounded shadow-lg cursor-pointer transition hover:scale-[1.03] border border-gray-200"
            @error="onFlyerError"
            @click="openLightbox(eventStore.upcomingEvent.flyer)"
          />
          <p class="mt-4 text-lg font-semibold text-gray-800">
            {{ eventStore.upcomingEvent.title }}
          </p>
          <p class="text-sm text-gray-600">
            {{ new Date(eventStore.upcomingEvent.date).toLocaleString() }}
          </p>
          <button
            class="mt-2 inline-flex items-center space-x-1 text-sm text-blue-700 underline hover:text-blue-900"
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
            class="mt-6 block text-blue-700 font-semibold hover:underline"
          >
            See All Events
          </RouterLink>
        </div>
      </div>

      <p v-else class="text-gray-600 mt-16">No events yet. Check back soon!</p>

      <!-- Embedded YouTube Video -->
      <hr
        class="my-20 border-t-2 border-gray-200/60 w-2/3 mx-auto rounded-full"
      />
      <div class="mt-20 max-w-4xl mx-auto">
        <div class="bg-white/90 rounded-2xl shadow-md px-6 py-8">
          <h4
            class="text-xl sm:text-2xl font-bold font-serif text-gray-900 mb-4"
          >
            NB Armwrestling Members at the Superman Tournament in Nova Scotia
          </h4>
          <div
            class="relative rounded-xl overflow-hidden shadow-lg border border-gray-200"
            style="padding-bottom: 56.25%; height: 0"
          >
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
    </div>

    <!-- Lightbox Modal -->
    <div
      v-if="lightboxImage"
      class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
      @click.self="closeLightbox"
    >
      <img
        :src="lightboxImage"
        alt="Event Flyer"
        class="max-w-full max-h-full rounded shadow-xl"
      />
    </div>
  </section>
</template>

<script setup>
import heroImage from "@/assets/images/armwrestlers.jpg";
import logoImage from "@/assets/images/logo.png";
import { onMounted, ref } from "vue";
import { useEventStore } from "@/stores/eventStore";

const eventStore = useEventStore();
const lightboxImage = ref(null);

const openLightbox = (src) => {
  lightboxImage.value = src;
};

const closeLightbox = () => {
  lightboxImage.value = null;
};

const openInMaps = (location) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location
  )}`;
  window.open(url, "_blank");
};

const onFlyerError = (event) => {
  event.target.src = logoImage;
};

onMounted(() => {
  eventStore.fetchEvents();
});
</script>

<style scoped>
h2,
p {
  transition: opacity 0.3s ease;
}
</style>
