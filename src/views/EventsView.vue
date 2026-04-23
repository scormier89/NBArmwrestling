<template>
  <section class="relative py-6 sm:py-8">
    <div class="page-surface mb-6 p-5 sm:p-6">
      <p class="section-label mb-2">Competition Calendar</p>
      <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Upcoming Events
      </h1>
      <p class="mt-2 text-sm text-slate-600">
        Preview eligible classes by entering the same first-step details used in
        registration.
      </p>

      <div
        class="mt-4 inline-flex rounded-full border border-slate-200 bg-white p-1"
      >
        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="
            eventMode === 'upcoming'
              ? 'bg-sky-700 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          "
          @click="eventMode = 'upcoming'"
        >
          Upcoming Events
        </button>
        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="
            eventMode === 'past'
              ? 'bg-sky-700 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          "
          @click="eventMode = 'past'"
        >
          Past Events
        </button>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label
            class="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
          >
            Birth Date
          </label>
          <input
            v-model="eligibility.birthDate"
            type="date"
            class="form-shell w-full"
          />
        </div>
        <div>
          <label
            class="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
          >
            Gender
          </label>
          <select v-model="eligibility.gender" class="form-shell w-full">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            type="button"
            class="btn-secondary w-full"
            @click="clearEligibility"
          >
            Reset Filter
          </button>
        </div>
      </div>

      <p v-if="previewAge !== null" class="mt-3 text-xs text-slate-600">
        Eligibility preview age:
        <span class="font-semibold text-slate-800">{{ previewAge }}</span> (by
        end of 2026 season)
      </p>
    </div>

    <div v-if="loading">
      <div
        class="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-sm font-medium text-slate-600"
        role="status"
        aria-live="polite"
      >
        <span
          class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-700"
          aria-hidden="true"
        ></span>
        Loading events...
      </div>
      <p v-if="slowLoading" class="mb-4 text-sm text-slate-500">
        First load can take a few seconds while events wake up.
      </p>

      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="n in 4"
          :key="n"
          class="border border-slate-200 rounded-2xl bg-white/80 p-6 animate-pulse"
        >
          <div class="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
          <div class="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div class="h-9 bg-slate-200 rounded w-32"></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800"
    >
      <p class="mb-3">{{ error }}</p>
      <button
        type="button"
        class="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
        @click="load"
      >
        Retry
      </button>
    </div>

    <p
      v-else-if="visibleSorted.length === 0"
      class="page-surface p-8 text-center text-slate-500"
    >
      {{
        eventMode === "upcoming"
          ? "No upcoming events at this time."
          : "No past events found."
      }}
    </p>

    <div v-else class="flex flex-col lg:flex-row gap-6 items-start">
      <div class="stagger-list flex-1 grid gap-4">
        <TournamentCard
          v-for="tournament in visibleSorted"
          :key="tournament.tournamentId"
          :tournament="tournament"
          :divisions-override="eligibleDivisionsForTournament(tournament)"
          :divisions-empty-message="divisionsEmptyMessage"
          :active="activeTournament?.tournamentId === tournament.tournamentId"
          @hover="setActiveTournament"
          @leave="clearHoverTournament"
          @select="selectTournament"
        />
      </div>

      <aside class="w-full lg:w-[340px] lg:sticky lg:top-[170px]">
        <div class="page-surface p-4">
          <p class="section-label mb-3">Event Location</p>
          <div
            class="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm"
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
              activeTournamentTitle
            }}</span>
            <span class="ml-1">{{ activeTournamentLocation }}</span>
          </p>
          <p class="mt-1 text-xs text-slate-500">
            Updates when you hover or select an event.
          </p>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import TournamentCard from "@/components/TournamentCard.vue";
import {
  age2026,
  filterDivisionsForAthlete,
} from "@/utils/divisionEligibility";

const API_BASE = import.meta.env.DEV
  ? "/api"
  : `${import.meta.env.VITE_API_BASE || "https://nbaw-func-rec-02242127.azurewebsites.net"}/api`;
const TENANT_HEADER = { "x-tenant-id": "nbaw" };

const loading = ref(true);
const slowLoading = ref(false);
const error = ref(null);
const tournaments = ref([]);
const activeTournament = ref(null);
const selectedTournamentId = ref(null);
const eventMode = ref("upcoming");
const eligibility = ref({
  birthDate: "",
  gender: "",
});

const sorted = computed(() =>
  [...tournaments.value].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
  ),
);

const now = () => new Date();

const visibleSorted = computed(() => {
  const upcoming = sorted.value.filter(
    (tournament) => new Date(tournament.eventDate) >= now(),
  );
  const past = sorted.value
    .filter((tournament) => new Date(tournament.eventDate) < now())
    .sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
    );

  return eventMode.value === "upcoming" ? upcoming : past;
});

const activeMapUrl = computed(() => {
  const location = activeTournament.value?.location || "New Brunswick, Canada";
  return `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
});

const activeTournamentTitle = computed(
  () => activeTournament.value?.name || "New Brunswick",
);

const activeTournamentLocation = computed(() =>
  activeTournament.value?.location
    ? `• ${activeTournament.value.location}`
    : "• Canada",
);

const previewAge = computed(() => {
  if (!eligibility.value.birthDate) return null;
  const age = age2026(eligibility.value.birthDate);
  return Number.isFinite(age) ? age : null;
});

const hasEligibilityInputs = computed(
  () => !!eligibility.value.birthDate && !!eligibility.value.gender,
);

const divisionsEmptyMessage = computed(() =>
  hasEligibilityInputs.value
    ? "No eligible classes for this athlete profile."
    : "TBD. Info available soon.",
);

const setActiveTournament = (tournament) => {
  activeTournament.value = tournament;
};

const clearHoverTournament = () => {
  if (selectedTournamentId.value) {
    const selected = visibleSorted.value.find(
      (tournament) => tournament.tournamentId === selectedTournamentId.value,
    );
    activeTournament.value = selected || activeTournament.value;
    return;
  }
  activeTournament.value = visibleSorted.value[0] || null;
};

const selectTournament = (tournament) => {
  selectedTournamentId.value = tournament?.tournamentId || null;
  activeTournament.value = tournament || null;
};

const clearEligibility = () => {
  eligibility.value.birthDate = "";
  eligibility.value.gender = "";
};

const eligibleDivisionsForTournament = (tournament) => {
  const divisions = Array.isArray(tournament?.divisionsConfig)
    ? tournament.divisionsConfig
    : [];

  if (!hasEligibilityInputs.value) return divisions;

  return filterDivisionsForAthlete(
    divisions,
    eligibility.value.birthDate,
    eligibility.value.gender,
  );
};

const load = async () => {
  let slowLoadingTimer = null;
  loading.value = true;
  slowLoading.value = false;
  error.value = null;
  slowLoadingTimer = window.setTimeout(() => {
    slowLoading.value = true;
  }, 2500);
  try {
    const res = await fetch(`${API_BASE}/v2/tournaments`, {
      headers: TENANT_HEADER,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    tournaments.value = data.tournaments ?? [];
    activeTournament.value = visibleSorted.value[0] || null;
    selectedTournamentId.value = visibleSorted.value[0]?.tournamentId || null;
  } catch {
    error.value = "Could not load events — please refresh.";
  } finally {
    if (slowLoadingTimer) window.clearTimeout(slowLoadingTimer);
    slowLoading.value = false;
    loading.value = false;
  }
};

watch(visibleSorted, (events) => {
  if (!events.length) {
    activeTournament.value = null;
    selectedTournamentId.value = null;
    return;
  }

  if (
    selectedTournamentId.value &&
    events.some((event) => event.tournamentId === selectedTournamentId.value)
  ) {
    const selected = events.find(
      (event) => event.tournamentId === selectedTournamentId.value,
    );
    activeTournament.value = selected || events[0];
    return;
  }

  activeTournament.value = events[0];
  selectedTournamentId.value = events[0]?.tournamentId || null;
});

onMounted(load);
</script>
