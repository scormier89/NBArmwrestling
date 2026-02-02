<template>
  <!--
    UI polish pass: tighter max-width container, stronger typography hierarchy,
    elevated card styling, clearer action buttons, improved media treatment,
    and scannable divisions/schedule layout with consistent map styling.
  -->
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <div
      class="bg-white rounded-2xl shadow-sm border border-slate-200/70 mb-10 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-lg hover:border-slate-300 fade-in"
      :class="index % 2 === 1 ? 'md:flex-row-reverse' : ''"
    >
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Flyer or Map (fills opposite side) -->
        <div
          v-if="event.flyer"
          class="bg-slate-50"
          :class="index % 2 === 1 ? 'md:order-2' : 'md:order-1'"
        >
          <div class="relative w-full h-full min-h-[260px] md:min-h-[360px]">
            <div class="absolute inset-0 p-3 sm:p-4">
              <img
                :src="event.flyer"
                :alt="event.title"
                class="w-full h-full object-cover cursor-pointer rounded-xl border border-slate-200/70 shadow-sm"
                @click="emit('lightbox', event.flyer)"
              />
            </div>
          </div>
        </div>
        <div
          v-else
          class="bg-slate-50"
          :class="index % 2 === 1 ? 'md:order-2' : 'md:order-1'"
        >
          <div class="relative w-full h-full min-h-[260px] md:min-h-[360px]">
            <div class="absolute inset-0 p-3 sm:p-4">
              <div
                class="relative w-full h-full overflow-hidden rounded-xl border border-slate-200/70 shadow-sm"
              >
                <iframe
                  :src="`https://www.google.com/maps?q=${encodeURIComponent(
                    event.location,
                  )}&output=embed`"
                  title="Event location map"
                  loading="lazy"
                  class="absolute top-0 left-0 w-full h-full"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <!-- Event Details -->
        <div
          class="p-7 sm:p-9 flex flex-col gap-3 text-center md:text-left"
          :class="index % 2 === 1 ? 'md:order-1' : 'md:order-2'"
        >
          <div class="space-y-2">
            <p
              class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase"
            >
              Upcoming Event
            </p>
            <h3
              class="text-3xl sm:text-[1.8rem] font-serif font-bold text-slate-900 leading-tight"
            >
              {{ event.title }}
            </h3>
            <p
              class="text-sm sm:text-base font-semibold text-slate-800 tracking-wide"
            >
              {{ new Date(event.date).toLocaleString() }}
            </p>
          </div>

          <button
            class="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[#0b4a8b] hover:text-[#063666] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b4a8b] focus-visible:ring-offset-2 rounded-md transition"
            @click="openInMaps(event.location)"
            aria-label="Open event location in Google Maps"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 2a6 6 0 016 6c0 4.418-6 10-6 10S4 12.418 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="underline underline-offset-4">{{
              event.location
            }}</span>
          </button>

          <div class="mb-2 flex flex-wrap gap-2">
            <a
              v-if="event.details && event.details.website"
              :href="event.details.website"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center justify-center gap-1.5 h-9 px-4 text-xs font-semibold text-white !text-white bg-[#0055a4] border border-[#0055a4] rounded-md shadow-sm hover:bg-[#003d7a] hover:border-[#003d7a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055a4] focus-visible:ring-offset-2 transition"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-.707.293H5a1 1 0 01-1-1v-4.5a1 1 0 01.293-.707l7.5-7.5z"
                />
              </svg>
              Visit Event Website
            </a>
            <a
              :href="getGoogleCalendarUrl(event)"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center justify-center h-9 px-4 text-xs font-semibold text-slate-800 border border-slate-300 rounded-md hover:border-[#0055a4] hover:text-[#0055a4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055a4] focus-visible:ring-offset-2 transition"
            >
              Add to Google Calendar
            </a>
            <a
              :href="getOutlookCalendarUrl(event)"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center justify-center h-9 px-4 text-xs font-semibold text-slate-800 border border-slate-300 rounded-md hover:border-[#0055a4] hover:text-[#0055a4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055a4] focus-visible:ring-offset-2 transition"
            >
              Add to Outlook
            </a>
            <a
              :href="getIcsDataUrl(event)"
              class="inline-flex items-center justify-center h-9 px-4 text-xs font-semibold text-slate-800 border border-slate-300 rounded-md hover:border-[#0055a4] hover:text-[#0055a4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055a4] focus-visible:ring-offset-2 transition"
              :download="`${event.title}.ics`"
            >
              Download .ics
            </a>
          </div>

          <div class="mt-3 grid grid-cols-1 gap-5 text-sm text-slate-800">
            <!-- Mobile Accordions -->
            <div class="md:hidden">
              <details
                v-if="event.weightClasses || event.details?.divisions"
                class="rounded-lg border border-slate-200 bg-white/80 p-3"
              >
                <summary class="font-semibold text-slate-900 cursor-pointer">
                  Divisions & Weight Classes
                </summary>
                <div class="mt-2 space-y-2">
                  <div
                    v-for="(classes, division) in event.weightClasses ||
                    event.details?.divisions"
                    :key="division"
                  >
                    <strong class="text-slate-900">{{ division }}:</strong>
                    <span class="ml-1 text-slate-700">{{
                      classes.join(", ")
                    }}</span>
                  </div>
                </div>
              </details>

              <details
                v-if="
                  event.details?.weighIns || event.details?.competitionTimes
                "
                class="rounded-lg border border-slate-200 bg-white/80 p-3"
              >
                <summary class="font-semibold text-slate-900 cursor-pointer">
                  Schedule Details
                </summary>
                <div class="mt-2">
                  <div v-if="event.details.weighIns?.length" class="mb-2">
                    <p class="font-medium text-slate-900">Weigh-ins:</p>
                    <ul class="ml-4 list-disc text-slate-700">
                      <li
                        v-for="(slot, idx) in event.details.weighIns"
                        :key="idx"
                      >
                        {{ slot }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="event.details.competitionTimes">
                    <p class="font-medium text-slate-900">Start Times:</p>
                    <ul class="ml-4 list-disc text-slate-700">
                      <li
                        v-for="(time, group) in event.details.competitionTimes"
                        :key="group"
                      >
                        {{ group }}: {{ time }}
                      </li>
                    </ul>
                  </div>
                </div>
              </details>
            </div>

            <!-- Desktop Details -->
            <div class="hidden md:block">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Weight Classes -->
                <div v-if="event.weightClasses || event.details?.divisions">
                  <p
                    class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-2"
                  >
                    Divisions
                  </p>
                  <div class="space-y-2">
                    <div
                      v-for="(classes, division) in event.weightClasses ||
                      event.details?.divisions"
                      :key="division"
                      class="rounded-md border border-slate-200/80 bg-slate-50/60 px-3 py-2"
                    >
                      <p class="text-sm font-semibold text-slate-900">
                        {{ division }}
                      </p>
                      <p class="text-sm text-slate-700">
                        {{ classes.join(", ") }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Schedule Info -->
                <div
                  v-if="
                    event.details?.weighIns || event.details?.competitionTimes
                  "
                >
                  <p
                    class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-2"
                  >
                    Schedule
                  </p>
                  <div class="space-y-3">
                    <div v-if="event.details.weighIns?.length">
                      <p class="font-semibold text-slate-900">Weigh-ins</p>
                      <ul class="ml-4 list-disc text-slate-700">
                        <li
                          v-for="(slot, idx) in event.details.weighIns"
                          :key="idx"
                        >
                          {{ slot }}
                        </li>
                      </ul>
                    </div>
                    <div v-if="event.details.competitionTimes">
                      <p class="font-semibold text-slate-900">Start Times</p>
                      <ul class="ml-4 list-disc text-slate-700">
                        <li
                          v-for="(time, group) in event.details
                            .competitionTimes"
                          :key="group"
                        >
                          {{ group }}: {{ time }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Location Map (only when flyer exists) -->
          <div v-if="event.flyer" class="mt-4">
            <p
              class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-2"
            >
              Location Map
            </p>
            <div
              class="relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm"
              style="padding-bottom: 56.25%; height: 0"
            >
              <iframe
                :src="`https://www.google.com/maps?q=${encodeURIComponent(
                  event.location,
                )}&output=embed`"
                title="Event location map"
                loading="lazy"
                class="absolute top-0 left-0 w-full h-full"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  event: Object,
  index: Number,
});
const emit = defineEmits(["lightbox"]);

const openInMaps = (location) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location,
  )}`;
  window.open(url, "_blank");
};

const getGoogleCalendarUrl = (event) => {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const formatDate = (d) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details: event.details?.description || "",
    location: event.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const getOutlookCalendarUrl = (event) => {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    location: event.location || "",
    body: event.details?.description || "",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

const getIcsDataUrl = (event) => {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const formatDate = (d) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NB Armwrestling//Events//EN",
    "BEGIN:VEVENT",
    `UID:${encodeURIComponent(event.title)}-${formatDate(start)}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location || ""}`,
    `DESCRIPTION:${(event.details?.description || "").replace(/\n/g, " ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.6s ease forwards;
  opacity: 0;
}
@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>
