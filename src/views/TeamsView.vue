<template>
  <section class="max-w-6xl mx-auto text-center mt-10 px-4">
    <h2
      class="text-3xl font-bold mb-8 tracking-tight"
      style="letter-spacing: 0.02em"
    >
      Our Teams
    </h2>
    <div
      class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-stretch gap-8 mb-10 text-left"
    >
      <!-- Mobile View Toggle -->
      <div class="lg:hidden flex justify-center">
        <div
          class="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm"
          role="tablist"
          aria-label="Teams view"
        >
          <button
            type="button"
            class="px-4 py-2 rounded-full text-sm font-semibold transition"
            :class="
              mobileView === 'list'
                ? 'bg-[#0055a4] text-white'
                : 'text-[#0055a4]'
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
              mobileView === 'map'
                ? 'bg-[#0055a4] text-white'
                : 'text-[#0055a4]'
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
          <div
            class="bg-white/95 border border-gray-200 rounded-2xl shadow-md p-5 h-full flex flex-col"
          >
            <p
              class="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-3"
            >
              Team Locations
            </p>
            <div
              class="relative overflow-hidden rounded-xl border border-gray-200 shadow-sm flex-1 min-h-[280px] lg:min-h-[320px]"
            >
              <div
                ref="mapEl"
                class="absolute top-0 left-0 w-full h-full"
                role="img"
                aria-label="Map showing team locations in New Brunswick"
              ></div>
            </div>
            <div class="mt-3 text-sm text-gray-600">
              <p>
                <span class="font-semibold text-gray-800">{{
                  hoveredTeamLabel
                }}</span>
                <span class="ml-1">{{ hoveredTeamCity }}</span>
              </p>
              <div v-if="hoveredTeam?.fb" class="mt-2">
                <a
                  :href="hoveredTeam.fb"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 text-[#0055a4] text-xs font-bold px-3 py-1 rounded bg-white hover:bg-[#0055a4] hover:text-white border border-[#0055a4] shadow-sm transition"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M22.675 0h-21.35C.59 0 0 .6 0 1.325v21.351C0 23.4.59 24 1.325 24h11.494v-9.294H9.691V11.01h3.128V8.309c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.917.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116c.735 0 1.325-.6 1.325-1.324V1.325C24 .6 23.41 0 22.675 0z"
                    />
                  </svg>
                  Facebook
                </a>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                Tap a team to highlight its pin.
                <span v-if="!mapsReady">(Map loading…)</span>
              </p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Teams List -->
      <div
        class="order-2 lg:order-1 grid grid-cols-1 md:grid-cols-2 gap-8"
        :class="mobileView === 'list' ? 'grid' : 'hidden lg:grid'"
      >
        <div
          v-for="team in teams"
          :key="team.name"
          class="relative group bg-white border border-gray-200 rounded-xl shadow-sm p-7 flex flex-col items-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#0055a4]"
          :class="{
            'ring-2 ring-[#0055a4]/60 border-[#0055a4] shadow-md':
              hoveredTeam?.name === team.name,
          }"
          @mouseenter="setHoveredTeam(team)"
          @mouseleave="clearHoveredTeam"
          @focusin="setHoveredTeam(team)"
        >
          <button
            type="button"
            class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white flex items-center justify-center text-3xl font-extrabold text-gray-500 mb-5 border-2 border-gray-200 shadow-lg shadow-gray-200/70 group-hover:scale-105 transition-transform overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055a4] focus-visible:ring-offset-2"
            @click="team.logo && openLogoLightbox(team.logo, team.name)"
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
            class="text-2xl font-extrabold mb-1 text-gray-900 tracking-tight group-hover:text-[#0055a4] transition-colors"
          >
            {{ team.name }}
          </h3>
          <div class="text-base text-gray-600 mb-1 font-medium">
            {{ team.city }}
          </div>
          <div class="text-xs text-gray-400 mb-4 tracking-widest uppercase">
            {{ team.region }}
          </div>
          <div class="flex gap-2 justify-center mt-2">
            <a
              v-if="team.fb"
              :href="team.fb"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1 text-[#0055a4] text-xs font-bold px-3 py-1 rounded bg-white hover:bg-[#0055a4] hover:text-white border border-[#0055a4] shadow-sm transition"
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
              class="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded shadow border border-gray-200"
              >More soon</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Logo Lightbox -->
    <div
      v-if="lightboxLogo"
      class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
      @click.self="closeLogoLightbox"
    >
      <div class="bg-white rounded-2xl p-4 shadow-xl max-w-md w-full">
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
import { ref, computed, onMounted, watch, nextTick } from "vue";
import acadianLogo from "@/assets/images/logos/acadian.jpg";
import basementLogo from "@/assets/images/logos/basement.png";
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
const mobileView = ref("list");
const mapEl = ref(null);
const mapsReady = ref(false);
let mapInstance = null;
let geocoder = null;
let markerMap = new Map();
let bounds = null;

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

const clearHoveredTeam = () => {
  hoveredTeam.value = null;
  if (mapsReady.value) resetMapView();
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
    setHoveredTeam(team);
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

const panToTeam = (teamName) => {
  const marker = markerMap.get(teamName);
  if (!marker || !mapInstance) return;
  mapInstance.panTo(marker.getPosition());
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
  if (view === "map") {
    await nextTick();
    refreshMap();
  }
};

const hoveredTeamLabel = computed(() => {
  return hoveredTeam.value?.name || "New Brunswick";
});

const hoveredTeamCity = computed(() => {
  return hoveredTeam.value?.city ? `• ${hoveredTeam.value.city}` : "• Canada";
});

onMounted(async () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  try {
    await loadGoogleMaps(apiKey);
    if (!(window.google && window.google.maps) || !mapEl.value) {
      mapsReady.value = false;
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
  }
});

watch(
  () => hoveredTeam.value,
  (team) => {
    if (!mapsReady.value) return;
    if (!team) {
      resetMapView();
      return;
    }
    highlightMarker(team.name);
    panToTeam(team.name);
  },
);
</script>

<style scoped>
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>
