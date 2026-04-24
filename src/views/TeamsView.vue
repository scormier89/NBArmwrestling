<template>
  <section class="text-center">
    <div class="page-surface mb-8 px-5 py-7 sm:px-8">
      <p class="section-label mb-2">Province-wide Clubs</p>
      <h2
        class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        style="letter-spacing: 0.02em"
      >
        Our Teams
      </h2>
    </div>

    <h2 class="sr-only" style="letter-spacing: 0.02em">Our Teams</h2>
    <div
      class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-stretch gap-10 mb-12 text-left"
    >
      <!-- Mobile View Toggle -->
      <div class="lg:hidden flex justify-center">
        <div
          class="inline-flex items-center rounded-full border border-slate-200 bg-white/85 p-1 shadow-sm"
          role="tablist"
          aria-label="Teams view"
        >
          <button
            type="button"
            class="px-4 py-2 rounded-full text-sm font-semibold transition"
            :class="
              mobileView === 'list' ? 'bg-sky-700 text-white' : 'text-sky-700'
            "
            role="tab"
            :aria-selected="mobileView === 'list'"
            @click="setMobileView('list')"
          >
            Teams
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-full text-sm font-semibold transition"
            :class="
              mobileView === 'map' ? 'bg-sky-700 text-white' : 'text-sky-700'
            "
            role="tab"
            :aria-selected="mobileView === 'map'"
            @click="setMobileView('map')"
          >
            Map
          </button>
        </div>
      </div>

      <!-- Map Panel (top on mobile, side on desktop) -->
      <aside
        class="order-1 lg:order-2 h-full"
        :class="mobileView === 'map' ? 'block' : 'hidden lg:block'"
      >
        <div class="lg:sticky lg:top-28 lg:h-[calc(100vh-160px)]">
          <div class="page-surface p-5 h-full flex flex-col">
            <p class="section-label mb-3">Team Locations</p>
            <div
              class="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm flex-1 min-h-[280px] lg:min-h-[320px]"
            >
              <div
                ref="mapEl"
                class="absolute top-0 left-0 w-full h-full"
                role="img"
                aria-label="Map showing team locations in New Brunswick"
              ></div>
              <iframe
                v-if="mapFailed"
                :src="fallbackMapUrl"
                title="Map showing team locations in New Brunswick"
                loading="lazy"
                class="absolute top-0 left-0 w-full h-full"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div class="mt-3 text-sm text-slate-600">
              <p>
                <span class="font-semibold text-slate-800">{{
                  hoveredTeamLabel
                }}</span>
                <span class="ml-1">{{ hoveredTeamCity }}</span>
              </p>
              <div v-if="hoveredTeam?.fb" class="mt-2">
                <a
                  :href="hoveredTeam.fb"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 rounded border border-sky-700 bg-white px-3 py-1 text-xs font-bold text-sky-700 shadow-sm transition hover:bg-sky-700 hover:text-white"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M22.675 0h-21.35C.59 0 0 .6 0 1.325v21.351C0 23.4.59 24 1.325 24h11.494v-9.294H9.691V11.01h3.128V8.309c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.917.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116c.735 0 1.325-.6 1.325-1.324V1.325C24 .6 23.41 0 22.675 0z"
                    />
                  </svg>
                  Facebook
                </a>
              </div>
              <p class="mt-2 text-xs text-slate-500">
                Tap a team to highlight its pin.
                <span v-if="mapFailed"
                  >(Using map preview — interactive map unavailable.)</span
                >
              </p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Teams List -->
      <div
        class="stagger-list order-2 lg:order-1 grid grid-cols-1 md:grid-cols-2 gap-10"
        :class="mobileView === 'list' ? 'grid' : 'hidden lg:grid'"
      >
        <div
          v-for="team in teams"
          :key="team.name"
          class="relative group page-surface p-8 flex flex-col items-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-sky-500/60"
          :class="{
            'ring-2 ring-sky-500/60 border-sky-500 shadow-md':
              activeTeam?.name === team.name,
            'scale-[1.03] -translate-y-1 shadow-xl':
              selectedTeam?.name === team.name,
          }"
          @mouseenter="setHoveredTeam(team)"
          @mouseleave="clearHoveredTeam"
          @focusin="setHoveredTeam(team)"
          @click="setSelectedTeam(team)"
          :data-team-name="team.name"
          :ref="(el) => setTeamRef(el, team.name)"
        >
          <button
            type="button"
            class="mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white text-3xl font-extrabold text-slate-500 shadow-lg shadow-slate-200/70 transition-transform group-hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 sm:h-36 sm:w-36"
            @click.stop="team.logo && openLogoLightbox(team.logo, team.name)"
            :aria-label="
              team.logo ? `Open ${team.name} logo` : `${team.name} logo`
            "
          >
            <template v-if="team.logo">
              <img
                :src="team.logo"
                :alt="team.name + ' logo'"
                class="object-contain w-full h-full p-3"
              />
            </template>
            <template v-else>
              <span>{{
                team.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
              }}</span>
            </template>
          </button>
          <h3
            class="mb-1 text-3xl font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-sky-700"
          >
            {{ team.name }}
          </h3>
          <div class="mb-1 text-base font-medium text-slate-600">
            {{ team.city }}
          </div>
          <div class="mb-4 text-xs uppercase tracking-widest text-slate-400">
            {{ team.region }}
          </div>
          <div class="flex gap-2 justify-center mt-2">
            <a
              v-if="team.fb"
              :href="team.fb"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1 rounded border border-sky-700 bg-white px-3 py-1 text-xs font-bold text-sky-700 shadow-sm transition hover:bg-sky-700 hover:text-white"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M22.675 0h-21.35C.59 0 0 .6 0 1.325v21.351C0 23.4.59 24 1.325 24h11.494v-9.294H9.691V11.01h3.128V8.309c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.917.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116c.735 0 1.325-.6 1.325-1.324V1.325C24 .6 23.41 0 22.675 0z"
                />
              </svg>
              Facebook
            </a>
          </div>
          <div
            v-if="!team.fb"
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span
              class="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-400 shadow"
              >More soon</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Logo Lightbox -->
    <div
      v-if="lightboxLogo"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 px-4"
      @click.self="closeLogoLightbox"
    >
      <div
        class="max-w-md w-full rounded-2xl border border-white/25 bg-white p-4 shadow-xl"
      >
        <img
          :src="lightboxLogo"
          :alt="lightboxAlt"
          class="w-full h-auto rounded-xl"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import acadianLogo from "@/assets/images/logos/acadian.jpg";
import basementLogo from "@/assets/images/logos/basement.png";
import cccLogo from "@/assets/images/logos/ccc.jpg";
import maximumLogo from "@/assets/images/logos/maximum.png";
import hubcityLogo from "@/assets/images/logos/hubcity.jpg";
import northwestLogo from "@/assets/images/logos/northwest.jpg";
import portcityLogo from "@/assets/images/logos/portcity.jpg";

const teams = [
  {
    name: "Capital City Crank",
    city: "Fredericton",
    region: "NB",
    fb: "https://www.facebook.com/groups/824740288415124/about",
    logo: cccLogo,
  },
  {
    name: "Hub City Hitmen",
    city: "Moncton",
    region: "NB",
    fb: "https://www.facebook.com/groups/834044750124909",
    logo: hubcityLogo,
  },
  {
    name: "Maximum Hookers",
    city: "Shediac",
    region: "NB",
    logo: maximumLogo,
    fb: "https://www.facebook.com/maximumstrengthperformance",
  },
  {
    name: "Acadian Arms",
    city: "Péninsule Acadienne",
    region: "NB",
    fb: "https://www.facebook.com/profile.php?id=100063550002503",
    logo: acadianLogo,
  },
  {
    name: "North West Pullers",
    city: "Edmundston",
    region: "NB",
    fb: "https://www.facebook.com/groups/1511662322360206",
    logo: northwestLogo,
  },
  {
    name: "Port City Pullers",
    city: "Saint John",
    region: "NB",
    fb: "https://www.facebook.com/groups/613527030725413",
    logo: portcityLogo,
  },
  {
    name: "Basement Pullers",
    city: "St Leonard",
    region: "NB",
    fb: "https://www.facebook.com/groups/606670355797570",
    logo: basementLogo,
  },
];

const lightboxLogo = ref(null);
const lightboxAlt = ref("Team logo");

const hoveredTeam = ref(null);
const selectedTeam = ref(null);
const mobileView = ref("list");
const mapEl = ref(null);
const mapsReady = ref(false);
const mapFailed = ref(false);
let mapInstance = null;
let geocoder = null;
let markerMap = new Map();
let bounds = null;
const teamRefs = new Map();
let teamObserver = null;

const openLogoLightbox = (src, name) => {
  if (!src) return;
  lightboxLogo.value = src;
  lightboxAlt.value = name ? `${name} logo` : "Team logo";
};

const closeLogoLightbox = () => {
  lightboxLogo.value = null;
};

const setHoveredTeam = (team) => {
  hoveredTeam.value = team || null;
};

const setSelectedTeam = (team) => {
  selectedTeam.value = team || null;
  hoveredTeam.value = null;

  // Force map focus on click even if computed activeTeam stays the same object.
  if (mapsReady.value && team?.name) {
    highlightMarker(team.name);
    panToTeam(team.name, { animateZoom: true });
  }
};

const clearHoveredTeam = () => {
  hoveredTeam.value = null;
  if (mapsReady.value && !selectedTeam.value) resetMapView();
};

const setTeamRef = (el, name) => {
  if (!el) return;
  teamRefs.set(name, el);
  if (teamObserver) teamObserver.observe(el);
};

function loadGoogleMaps(key) {
  if (window.google && window.google.maps) return Promise.resolve();
  if (!key) return Promise.resolve();
  if (document.getElementById("gmaps-script"))
    return new Promise((res) => {
      const s = document.getElementById("gmaps-script");
      s.addEventListener("load", () => res());
      if (window.google && window.google.maps) res();
    });
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "gmaps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

const defaultCenter = { lat: 46.5653, lng: -66.4619 };

const addTeamMarker = (team, location) => {
  if (!mapInstance || !location) return;
  const marker = new window.google.maps.Marker({
    map: mapInstance,
    position: location,
    title: team.name,
    icon: {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: "#0055a4",
      fillOpacity: 0.9,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    },
  });
  marker.addListener("click", () => {
    setSelectedTeam(team);
  });
  markerMap.set(team.name, marker);
};

const highlightMarker = (teamName) => {
  markerMap.forEach((marker, name) => {
    marker.setIcon({
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: name === teamName ? 8 : 6,
      fillColor: name === teamName ? "#c21818" : "#0055a4",
      fillOpacity: 0.95,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    });
  });
};

const panToTeam = (teamName, options = {}) => {
  const marker = markerMap.get(teamName);
  if (!marker || !mapInstance) return;

  const { animateZoom = false } = options;
  mapInstance.panTo(marker.getPosition());

  if (animateZoom) {
    const targetZoom = 8;
    if ((mapInstance.getZoom() ?? targetZoom) !== targetZoom) {
      setTimeout(() => {
        if (mapInstance) mapInstance.setZoom(targetZoom);
      }, 180);
    }
    return;
  }

  mapInstance.setZoom(8);
};

const resetMarkers = () => {
  markerMap.forEach((marker) => {
    marker.setIcon({
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: "#0055a4",
      fillOpacity: 0.9,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    });
  });
};

const resetMapView = () => {
  if (!mapInstance || !bounds) return;
  resetMarkers();
  mapInstance.fitBounds(bounds);
};

const refreshMap = () => {
  if (!mapInstance) return;
  window.google?.maps?.event?.trigger(mapInstance, "resize");
  if (bounds && !bounds.isEmpty()) mapInstance.fitBounds(bounds);
};

const setMobileView = async (view) => {
  mobileView.value = view;
  if (view === "map" && mapsReady.value) {
    await nextTick();
    refreshMap();
  }
};

const hoveredTeamLabel = computed(() => {
  return activeTeam.value?.name || "New Brunswick";
});

const hoveredTeamCity = computed(() => {
  return activeTeam.value?.city ? `• ${activeTeam.value.city}` : "• Canada";
});

const activeTeam = computed(() => hoveredTeam.value || selectedTeam.value);

const fallbackMapUrl = computed(() => {
  const query = activeTeam.value
    ? `${activeTeam.value.city}, ${activeTeam.value.region || "NB"}`
    : "New Brunswick, Canada";
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
});

onMounted(async () => {
  teamObserver = new IntersectionObserver(
    (entries) => {
      const anchorY = 120; // align to map sticky top (top-28)
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top - anchorY) -
            Math.abs(b.boundingClientRect.top - anchorY),
        )[0];
      if (visible) {
        const name = visible.target.getAttribute("data-team-name");
        const team = teams.find((t) => t.name === name);
        if (team && !selectedTeam.value) setHoveredTeam(team);
      }
    },
    { threshold: [0.2, 0.4, 0.6, 0.8] },
  );

  teamRefs.forEach((el) => {
    teamObserver.observe(el);
  });

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  try {
    await loadGoogleMaps(apiKey);
    if (!(window.google && window.google.maps) || !mapEl.value) {
      mapsReady.value = false;
      mapFailed.value = true;
      return;
    }
    mapsReady.value = true;
    mapInstance = new window.google.maps.Map(mapEl.value, {
      center: defaultCenter,
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    geocoder = new window.google.maps.Geocoder();

    bounds = new window.google.maps.LatLngBounds();

    for (const team of teams) {
      const query = `${team.city}, ${team.region || "NB"}`;
      await new Promise((resolve) => {
        geocoder.geocode({ address: query }, (results, status) => {
          if (status === "OK" && results?.[0]?.geometry?.location) {
            const loc = results[0].geometry.location;
            addTeamMarker(team, loc);
            bounds.extend(loc);
          }
          resolve();
        });
      });
    }

    if (!bounds.isEmpty()) {
      mapInstance.fitBounds(bounds);
    }
  } catch (e) {
    mapsReady.value = false;
    mapFailed.value = true;
  }
});

onUnmounted(() => {
  if (teamObserver) teamObserver.disconnect();
});

watch(
  () => activeTeam.value,
  (team) => {
    if (!mapsReady.value) return;
    if (!team) {
      resetMapView();
      return;
    }
    highlightMarker(team.name);
    panToTeam(team.name, { animateZoom: true });
  },
);
</script>

<style scoped>
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>
