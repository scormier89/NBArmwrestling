<template>
  <section class="space-y-10 sm:space-y-12">
    <div
      class="hero-wrap overflow-hidden rounded-[1.7rem] border border-white/40"
    >
      <div
        class="hero-media"
        :style="{ backgroundImage: `url(${heroImage})` }"
      ></div>
      <div class="hero-overlay">
        <p class="section-label mb-3 text-white/80">
          New Brunswick Armwrestling
        </p>
        <h1 class="hero-title">Built For Pullers Who Train To Win</h1>
        <p class="hero-copy">
          Join a growing provincial scene with regular practices, top-tier
          tournaments, and a community that pushes each athlete forward.
        </p>
        <div class="mt-7 flex flex-wrap items-center gap-3">
          <RouterLink to="/teams" class="btn-primary">Find a Team</RouterLink>
          <RouterLink to="/events" class="btn-secondary"
            >See the Schedule</RouterLink
          >
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <article class="page-surface p-6 sm:p-8">
        <p class="section-label mb-3">What You Get</p>
        <h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Train Local, Compete National
        </h2>
        <p class="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          NB Armwrestling supports newcomers and elite athletes alike through
          coaching, event access, and a direct path to CAWF-sanctioned
          competition.
        </p>
        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <div class="feature-card">
            <h3 class="feature-title">Weekly Team Practices</h3>
            <p class="feature-copy">
              Multiple clubs across the province with active pullers.
            </p>
          </div>
          <div class="feature-card">
            <h3 class="feature-title">Event-Ready Coaching</h3>
            <p class="feature-copy">
              Preparation support for first-timers through advanced classes.
            </p>
          </div>
          <div class="feature-card">
            <h3 class="feature-title">Official Pathway</h3>
            <p class="feature-copy">
              Compete under recognized standards and reach national stages.
            </p>
          </div>
          <div class="feature-card">
            <h3 class="feature-title">Strong Community</h3>
            <p class="feature-copy">
              Mentorship and team culture built around long-term growth.
            </p>
          </div>
        </div>
      </article>

      <article class="page-surface p-6 sm:p-8">
        <p class="section-label mb-3">Next Event</p>

        <div v-if="eventStore.upcomingEvent" class="space-y-4">
          <img
            :src="eventStore.upcomingEvent.flyer || logoImage"
            :alt="eventStore.upcomingEvent.title"
            class="event-flyer"
            @error="onFlyerError"
            @click="openLightbox(eventStore.upcomingEvent.flyer)"
          />

          <div>
            <h3 class="text-2xl font-bold text-slate-900">
              {{ eventStore.upcomingEvent.title }}
            </h3>
            <p class="mt-1 text-sm text-slate-500">
              {{ new Date(eventStore.upcomingEvent.date).toLocaleString() }}
            </p>
            <button
              class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-sky-800 hover:text-sky-950"
              @click="openInMaps(eventStore.upcomingEvent.location)"
              aria-label="Open next event location in Google Maps"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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
          </div>

          <RouterLink to="/events" class="btn-primary w-full sm:w-auto"
            >Browse all events</RouterLink
          >
        </div>

        <p v-else class="text-slate-500">
          No events posted yet. Check back soon.
        </p>
      </article>
    </div>

    <article class="page-surface overflow-hidden p-6 sm:p-8">
      <p class="section-label mb-3">Featured Video</p>
      <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl">
        NB Armwrestling Members at Superman Tournament
      </h2>
      <div class="video-shell mt-5">
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
          class="absolute left-0 top-0 h-full w-full"
        ></iframe>
      </div>
    </article>

    <div
      v-if="lightboxImage"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 px-4"
      @click.self="closeLightbox"
    >
      <img
        :src="lightboxImage"
        alt="Event flyer"
        class="max-h-[88vh] max-w-full rounded-2xl border border-white/20"
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
  if (!src) return;
  lightboxImage.value = src;
};

const closeLightbox = () => {
  lightboxImage.value = null;
};

const openInMaps = (location) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
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
.hero-wrap {
  position: relative;
  min-height: 460px;
}

.hero-media {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center 24%;
  transform: scale(1.03);
}

.hero-overlay {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 460px;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.6rem;
  background: linear-gradient(
    165deg,
    rgba(5, 11, 28, 0.26) 0%,
    rgba(5, 11, 28, 0.8) 62%,
    rgba(8, 19, 42, 0.95) 100%
  );
}

.hero-title {
  margin: 0;
  max-width: 18ch;
  color: #f8fbff;
  font-size: clamp(2.1rem, 4.8vw, 3.8rem);
  line-height: 1.04;
}

.hero-copy {
  margin-top: 0.9rem;
  max-width: 60ch;
  color: rgba(226, 232, 240, 0.93);
  font-size: 1.02rem;
}

.feature-card {
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 1rem;
  background: rgba(248, 250, 252, 0.9);
  padding: 1rem;
}

.feature-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.feature-copy {
  margin-top: 0.45rem;
  font-size: 0.92rem;
  color: #64748b;
}

.event-flyer {
  width: 100%;
  max-height: 460px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 1rem;
  object-fit: cover;
  cursor: pointer;
  transition: transform 170ms ease;
}

.event-flyer:hover {
  transform: scale(1.01);
}

.video-shell {
  position: relative;
  height: 0;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.34);
  border-radius: 1rem;
  padding-bottom: 56.25%;
  box-shadow: 0 20px 30px rgba(15, 23, 42, 0.16);
}

@media (min-width: 640px) {
  .hero-overlay {
    padding: 2.4rem;
  }
}
</style>
