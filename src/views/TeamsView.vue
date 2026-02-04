<template>
  <section class="max-w-4xl mx-auto text-center mt-10 px-4">
    <h2
      class="text-3xl font-bold mb-8 tracking-tight"
      style="letter-spacing: 0.02em"
    >
      Our Teams
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      <div
        v-for="team in teams"
        :key="team.name"
        class="relative group bg-white border border-gray-200 rounded-xl shadow-sm p-7 flex flex-col items-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#0055a4]"
      >
        <div
          class="w-20 h-20 rounded-lg bg-gray-50 flex items-center justify-center text-3xl font-extrabold text-gray-500 mb-5 border border-gray-200 shadow-sm group-hover:scale-105 transition-transform overflow-hidden"
        >
          <template v-if="team.logo">
            <img
              :src="team.logo"
              :alt="team.name + ' logo'"
              class="object-contain w-full h-full"
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
        </div>
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
  </section>
</template>

<script setup>
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
</script>

<style scoped>
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>
