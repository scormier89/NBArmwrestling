<template>
  <section class="relative py-6 sm:py-8">
    <h1
      class="mb-7 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-center text-3xl font-bold tracking-tight backdrop-blur sticky top-[92px] z-20"
    >
      Upcoming Events
    </h1>

    <div class="flex flex-col md:flex-row gap-8 items-start">
      <!-- Event List -->
      <div class="flex-1">
        <div
          v-if="eventStore.upcomingEvents.length === 0"
          class="page-surface p-8 text-center text-slate-500"
        >
          No upcoming events.
        </div>

        <div
          v-for="(monthEvents, month) in groupedEvents"
          :key="month"
          class="mb-16"
        >
          <div
            class="mb-16"
            :ref="(el) => (monthRefs[month] = el)"
            :data-month="month"
          >
            <h2
              class="section-label mb-6 sticky top-[160px] z-10 border-b border-sky-200/80 bg-white/80 py-2 text-[0.78rem] backdrop-blur"
              :ref="(el) => (monthRefs[month] = el)"
              :data-month="month"
            >
              {{ month }}
            </h2>

            <div class="stagger-list">
              <div
                v-for="(event, index) in monthEvents"
                :key="event.title"
                :data-event-title="event.title"
                :ref="(el) => (eventRefs[event.title] = el)"
                class="rounded-2xl transition"
                :class="
                  activeEvent?.title === event.title
                    ? 'ring-2 ring-sky-500/50 shadow-lg shadow-sky-100/60'
                    : ''
                "
              >
                <EventCard
                  :event="event"
                  :index="index"
                  @lightbox="openLightbox"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Side Panel: Floating Map + Month Scroller -->
      <div
        class="hidden h-fit self-start gap-6 pt-6 md:sticky md:top-[210px] md:flex md:flex-col"
      >
        <div class="page-surface w-[320px] p-4">
          <p class="section-label mb-3">Event Location</p>
          <div
            class="relative overflow-hidden rounded-xl border border-slate-200/80 shadow-sm"
            style="padding-bottom: 85%; height: 0"
          >
            <iframe
              :src="activeMapUrl"
              title="Event location map"
              loading="lazy"
              class="absolute top-0 left-0 w-full h-full"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p class="mt-3 text-sm text-slate-600">
            <span class="font-semibold text-slate-800">{{
              activeEventTitle
            }}</span>
            <span class="ml-1">{{ activeEventLocation }}</span>
          </p>
          <p class="mt-1 text-xs text-slate-500">Updates as you scroll.</p>
        </div>

        <div class="flex flex-col pt-2">
          <button
            v-for="month in Object.keys(groupedEvents)"
            :key="month"
            @click="scrollToMonth(month)"
            class="origin-left mb-6 -rotate-90 text-[0.7rem] font-semibold tracking-[0.2em] text-slate-500 transition-colors hover:text-sky-700"
            :class="{
              'text-sky-800 underline': currentMonth?.trim() === month.trim(),
            }"
          >
            {{ month.slice(0, 3).toUpperCase() }}
            <span
              v-if="currentMonth?.trim() === month.trim()"
              class="mx-auto mt-1 block h-1 w-1 rounded-full bg-sky-500"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div
      v-if="lightboxImage"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80"
      @click.self="closeLightbox"
    >
      <img
        :src="lightboxImage"
        alt="Flyer"
        class="max-h-[90vh] max-w-full rounded-2xl border border-white/20 shadow-xl"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch, nextTick, computed } from "vue";
import { useEventStore } from "@/stores/eventStore";
import EventCard from "@/components/EventCard.vue";

const eventStore = useEventStore();
const groupedEvents = ref({});
const lightboxImage = ref(null);
const currentMonth = ref(null);
const monthRefs = ref({});
const activeEvent = ref(null);
const eventRefs = ref({});
let eventObserver = null;
let observer = null;

const openLightbox = (src) => {
  lightboxImage.value = src;
};

const closeLightbox = () => {
  lightboxImage.value = null;
};

const setActiveEvent = (event) => {
  activeEvent.value = event || null;
};

const activeMapUrl = computed(() => {
  const location = activeEvent.value?.location || "New Brunswick, Canada";
  return `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
});

const activeEventTitle = computed(() => {
  return activeEvent.value?.title || "New Brunswick";
});

const activeEventLocation = computed(() => {
  return activeEvent.value?.location
    ? `• ${activeEvent.value.location}`
    : "• Canada";
});

const scrollToMonth = async (month) => {
  const el = monthRefs.value[month];
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY;
  const header = document.querySelector("header");
  const headerHeight = header?.offsetHeight || 120;

  window.scrollTo({
    top: top - headerHeight - 30,
    behavior: "smooth",
  });
};

// Watch for upcoming events only, and group them by month
watch(
  () => eventStore.upcomingEvents,
  async (events) => {
    const groups = {};
    events.forEach((e) => {
      const date = new Date(e.date);
      const monthLabel = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      });
      if (!groups[monthLabel]) groups[monthLabel] = [];
      groups[monthLabel].push(e);
    });
    groupedEvents.value = groups;

    await nextTick();

    if (observer) observer.disconnect();
    if (eventObserver) eventObserver.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const monthAttr = entry.target.getAttribute("data-month");
            currentMonth.value = monthAttr?.trim();
            break;
          }
        }
      },
      { rootMargin: "-120px 0px -70% 0px" },
    );

    for (const month in groups) {
      const el = monthRefs.value[month];
      if (el) observer.observe(el);
    }

    eventObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const title = visible.target.getAttribute("data-event-title");
          const found = events.find((e) => e.title === title);
          if (found) setActiveEvent(found);
        }
      },
      { threshold: [0.3, 0.6, 0.9] },
    );

    Object.values(eventRefs.value).forEach((el) => {
      if (el) eventObserver.observe(el);
    });
  },
  { immediate: true },
);

const openInMaps = (location) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location,
  )}`;
  window.open(url, "_blank");
};

onMounted(() => {
  // Force reload to ensure backend mode is applied
  eventStore.fetchEvents(true);
});
</script>

<style scoped></style>
