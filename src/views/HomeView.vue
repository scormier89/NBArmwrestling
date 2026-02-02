<template>
  <section class="bg-[#f8f5f1]">
    <!-- Hero: stronger overlay + integrated content flow -->
    <div
      class="relative h-[520px] sm:h-[580px] bg-fixed bg-cover bg-no-repeat flex flex-col items-center justify-center w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
      :style="{
        backgroundImage: `url(${heroImage})`,
        backgroundPosition: 'center 20%',
      }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-[#f8f5f1]/95"
      ></div>
    </div>

    <!-- Main Content Panel: reduced modal feel + max-width rhythm -->
    <div
      class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 text-center -mt-24 sm:-mt-28 relative z-10"
    >
      <div
        class="bg-white/80 backdrop-blur-sm border border-slate-200/70 rounded-2xl shadow-sm px-6 sm:px-10 py-10 sm:py-12"
      >
        <h2
          class="text-4xl sm:text-6xl font-serif font-extrabold text-slate-900 tracking-tight mb-5 leading-tight"
          style="font-family: &quot;Playfair Display&quot;, serif"
        >
          Arm Wrestling in New Brunswick
        </h2>
        <p
          class="mt-4 text-slate-700 text-lg sm:text-xl leading-relaxed font-light"
        >
          Welcome to the home of NB Armwrestling —
          <span class="font-semibold text-blue-900"
            >where strength meets community</span
          >.<br />
          Whether you're a beginner or a seasoned puller, we’ve got a table for
          you.
        </p>

        <!-- CTA Group: primary + secondary -->
        <div
          class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <RouterLink
            to="/teams"
            class="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 !text-white hover:!text-white font-bold text-base sm:text-lg h-11 sm:h-12 px-8 sm:px-10 rounded-full shadow-lg shadow-blue-200/40 transition-all duration-200 tracking-wide border-2 border-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            style="letter-spacing: 0.04em"
          >
            Join a Local Practice
          </RouterLink>
          <RouterLink
            to="/schedule"
            class="inline-flex items-center justify-center text-blue-800 font-semibold text-sm sm:text-base h-11 sm:h-12 px-6 rounded-full border border-blue-200 hover:border-blue-400 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 transition"
            aria-label="View upcoming events"
          >
            View Upcoming Events
          </RouterLink>
        </div>

        <!-- Next Event -->
        <hr
          class="my-10 sm:my-12 border-t border-gray-200/70 w-2/3 mx-auto rounded-full"
        />
        <div v-if="eventStore.upcomingEvent" class="mt-8 flex justify-center">
          <div
            class="bg-white/95 border border-blue-200 rounded-2xl shadow-lg shadow-blue-200/40 px-6 sm:px-8 py-8 max-w-md w-full text-center"
          >
            <h3
              class="text-2xl font-bold font-serif mb-3 text-slate-900 tracking-tight"
            >
              Next Event
            </h3>
            <!-- Lightbox Trigger -->
            <img
              :src="eventStore.upcomingEvent.flyer || logoImage"
              :alt="eventStore.upcomingEvent.title"
              class="w-full max-w-xs mx-auto rounded-xl shadow-md cursor-pointer transition hover:scale-[1.02] border border-slate-200"
              @error="onFlyerError"
              @click="openLightbox(eventStore.upcomingEvent.flyer)"
            />
            <p class="mt-4 text-lg font-semibold text-slate-800">
              {{ eventStore.upcomingEvent.title }}
            </p>
            <p class="text-sm text-slate-600">
              {{ new Date(eventStore.upcomingEvent.date).toLocaleString() }}
            </p>
            <button
              class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 rounded-md transition"
              @click="openInMaps(eventStore.upcomingEvent.location)"
              aria-label="Open next event location in Google Maps"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 2a6 6 0 016 6c0 4.418-6 10-6 10S4 12.418 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="underline underline-offset-4">{{
                eventStore.upcomingEvent.location
              }}</span>
            </button>
            <RouterLink
              to="/schedule"
              class="mt-5 inline-flex items-center justify-center text-blue-700 font-semibold hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 rounded-md transition"
            >
              See All Events
            </RouterLink>
          </div>
        </div>

        <p v-else class="text-slate-600 mt-10">
          No events yet. Check back soon!
        </p>

        <!-- Embedded YouTube Video -->
        <hr
          class="my-10 sm:my-12 border-t border-gray-200/70 w-2/3 mx-auto rounded-full"
        />
        <div class="mt-8 max-w-5xl mx-auto">
          <div class="bg-white/95 rounded-2xl shadow-lg px-6 sm:px-10 py-8">
            <h4
              class="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mb-4"
            >
              NB Armwrestling Members at the Superman Tournament in Nova Scotia
            </h4>
            <div
              class="relative rounded-xl overflow-hidden shadow-md border border-slate-200"
              style="padding-bottom: 56.25%; height: 0"
            >
              <iframe
                src="https://www.youtube-nocookie.com/embed/McgTdXpHI5I?rel=0"
                title="NB Armwrestling Highlights"
                frameborder="0"
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                "
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
                class="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
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
import heroImage from "@/assets/images/team2.jpg";
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
    location,
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
