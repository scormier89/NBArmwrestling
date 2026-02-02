<template>
  <div class="min-h-screen flex flex-col bg-[#f8f5f1] text-gray-900 font-sans">
    <!-- Sticky Header -->
    <header
      class="fixed top-0 w-full bg-white z-50 transition-all duration-300 pb-2 overflow-visible"
      :style="headerStyle"
    >
      <div class="transition-all duration-300 w-full max-w-5xl mx-auto px-4">
        <div
          :class="
            isScrolled
              ? 'flex items-center justify-between'
              : 'flex flex-col items-center'
          "
          class="w-full"
        >
          <div :class="isScrolled ? 'flex items-center' : 'align-center'">
            <img
              src="/src/assets/images/logo.png"
              alt="NB Armwrestling Logo"
              class="transition-all duration-200 ease-out origin-top"
              :style="{
                transform: `scale(1) translateY(0px)`,
                marginTop: isScrolled ? '0' : '0',
                marginLeft: isScrolled ? '0' : '25px',
                width: isScrolled ? '4rem' : '10rem',
              }"
            />

            <h1
              class="font-serif text-3xl font-bold tracking-tight transition-all ease-out text-gray-500"
              :class="
                isScrolled ? 'pt-3 duration-500' : 'mb-2 mt-[-15px] text-center'
              "
              :style="{
                transform: `translateY(0px)`,
                fontSize: isMobile ? '1.5rem' : '',
              }"
              style="
                text-shadow: 0px 1px 12px #ffd826;
                font-family: fantasy;
                color: #2f0b0b;
              "
            >
              NB Armwrestling
            </h1>
          </div>

          <!-- Navigation -->
          <!-- Desktop Nav -->
          <nav
            v-show="(isMobile && !isScrolled) || !isMobile"
            class="transition-transform ease-out flex flex-wrap items-center"
            :class="{
              'duration-300': isScrolled,
              'justify-center': !isScrolled,
              'justify-start': isScrolled,
            }"
            :style="{
              transform: `translateY(0px)`,
              width: isScrolled ? 'auto' : '100%',
              paddingTop: isScrolled ? '1rem' : '0',
            }"
          >
            <RouterLink
              v-for="link in links"
              :key="link.path"
              :to="link.path"
              class="mx-1.5 text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase px-2 py-[0.35rem] rounded-md transition-all duration-200 border-b-2 border-transparent"
              :class="{
                'text-white border-b-2 border-[#c21818] bg-transparent':
                  router.currentRoute.value.path === link.path,
                'text-white/80 hover:text-white hover:bg-white/10':
                  router.currentRoute.value.path !== link.path,
              }"
            >
              {{ link.label }}
            </RouterLink>
          </nav>

          <!-- Mobile Hamburger (Only when scrolled) -->
          <button
            v-if="isMobile && isScrolled"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden ml-auto p-2 text-gray-700 hover:text-yellow-600 transition mt-4 mr-2"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <!-- Mobile Dropdown Menu -->
          <div
            v-if="isMobileMenuOpen && isScrolled"
            class="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-40"
          >
            <RouterLink
              v-for="link in links"
              :key="link.path"
              :to="link.path"
              class="block px-6 py-3 border-b border-gray-100 text-gray-800 hover:bg-yellow-50"
              @click="isMobileMenuOpen = false"
              :class="{
                'text-yellow-700 font-semibold underline underline-offset-4':
                  router.currentRoute.value.path === link.path,
              }"
            >
              {{ link.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1 mt-[230px] px-4 sm:px-6">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer
      class="bg-[#2b2b2b] text-white py-6 text-center text-sm tracking-wide shadow-inner"
    >
      <div
        class="flex flex-col md:flex-row justify-center items-center gap-4 mb-2"
      >
        <!-- Facebook -->
        <a
          href="https://www.facebook.com/NBArmwrestling"
          target="_blank"
          rel="noopener"
          aria-label="Facebook"
          class="hover:text-yellow-500 transition"
        >
          <svg
            class="w-5 h-5 inline-block"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.675 0h-21.35C.59 0 0 .6 0 1.325v21.351C0 23.4.59 24 1.325 24h11.494v-9.294H9.691V11.01h3.128V8.309c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.917.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116c.735 0 1.325-.6 1.325-1.324V1.325C24 .6 23.41 0 22.675 0z"
            />
          </svg>
        </a>

        <!-- Instagram -->
        <a
          href="https://www.instagram.com/nb_armwrestling/"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          class="hover:text-yellow-500 transition"
        >
          <svg
            class="w-5 h-5 inline-block"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.31.976.975 1.249 2.242 1.31 3.608.058 1.267.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.061 1.366-.335 2.633-1.31 3.608-.975.976-2.242 1.249-3.608 1.31-1.267.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.061-2.633-.335-3.608-1.31-.976-.975-1.249-2.242-1.31-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.061-1.366.335-2.633 1.31-3.608.975-.976 2.242-1.249 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.737 0 8.333.013 7.052.072 5.752.131 4.42.453 3.29 1.582 2.161 2.71 1.839 4.043 1.78 5.343.72 6.624.708 7.028.708 12c0 4.972.013 5.376.072 6.657.059 1.3.381 2.633 1.51 3.761 1.129 1.129 2.462 1.451 3.761 1.51 1.281.059 1.685.072 6.657.072s5.376-.013 6.657-.072c1.3-.059 2.633-.381 3.761-1.51 1.129-1.129 1.451-2.462 1.51-3.761.059-1.281.072-1.685.072-6.657s-.013-5.376-.072-6.657c-.059-1.3-.381-2.633-1.51-3.761C21.294.453 19.961.131 18.661.072 17.38.013 16.976 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"
            />
          </svg>
        </a>

        <!-- YouTube -->
        <a
          href="https://www.youtube.com/@nbarmwrestling"
          target="_blank"
          rel="noopener"
          aria-label="YouTube"
          class="hover:text-yellow-500 transition"
        >
          <svg
            class="w-5 h-5 inline-block"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M23.498 6.186a2.995 2.995 0 00-2.113-2.117C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.385.569a2.995 2.995 0 00-2.113 2.117C0 8.056 0 12 0 12s0 3.944.502 5.814a2.995 2.995 0 002.113 2.117c1.867.569 9.385.569 9.385.569s7.518 0 9.385-.569a2.995 2.995 0 002.113-2.117C24 15.944 24 12 24 12s0-3.944-.502-5.814zM9.75 15.02V8.98l6.25 3.02-6.25 3.02z"
            />
          </svg>
        </a>
      </div>

      <div>
        © 2025 NB Armwrestling — Recognized by the Canadian Armwrestling
        Federation
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";

const router = useRouter();
const baseLinks = [
  { path: "/", label: "Home" },
  { path: "/schedule", label: "Schedule" },
  { path: "/teams", label: "Teams" },
  { path: "/cawf", label: "CAWF" },
  { path: "/contact", label: "Contact" },
];
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");
const links = isLocalhost
  ? [...baseLinks, { path: "/shop", label: "Shop" }]
  : baseLinks;

const scrollY = ref(0);
const scrollMax = 150;

const shrinkProgress = computed(() => Math.min(scrollY.value / scrollMax, 1));

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

const isMobileMenuOpen = ref(false);

const headerStyle = computed(() => {
  return {
    height: isScrolled.value ? "85px" : "235px",
    boxShadow: isScrolled.value ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
  };
});

const scale = computed(() => {
  const min = 0.5;
  const max = 1;
  const factor = shrinkProgress.value;
  return min + (1 - factor) * (max - min);
});

const translateY = computed(() => {
  const maxTranslate = 8;
  return shrinkProgress.value * maxTranslate;
});

const isScrolled = computed(() => scrollY.value > 120);

const isMobile = ref(false);

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  router.beforeEach(() => window.scrollTo(0, 0));
  isMobile.value = window.innerWidth <= 768;
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style>
/* Mature, clean, subtle NB Armwrestling theme */
:root {
  --nb-blue: #0055a4;
  --nb-red: #c21818;
  --nb-offwhite: #f8f5f1;
  --nb-dark: #18181b;
}

main {
  min-height: calc(100vh - 300px);
}
body {
  font-family: "Inter", "Segoe UI", sans-serif;
  background-color: var(--nb-offwhite);
  line-height: 1.7; /* improve long-form readability */
  color: #1f2937;
}

h1,
h2,
h3 {
  color: var(--nb-dark);
  font-family: "Playfair Display", "Georgia", serif;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

p {
  letter-spacing: 0.01em;
}

a {
  transition: color 0.3s ease;
  color: var(--nb-blue);
}
a:hover {
  color: #222;
}

header {
  background: var(--nb-dark) !important;
  color: #fff;
  border-bottom: 2px solid var(--nb-blue);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
}

nav a {
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.18em; /* subtle spacing for clarity */
  font-weight: 600;
  padding: 0.3em 0.6em;
  border-radius: 6px;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}
nav a.router-link-exact-active {
  color: #fff !important;
  border-color: var(--nb-red) !important; /* deliberate, not loud */
}

footer {
  background: var(--nb-dark) !important;
  color: #fff;
  border-top: 2px solid var(--nb-blue);
}

button,
.btn {
  border-radius: 0.6rem;
  font-weight: 600;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease,
    transform 0.18s ease;
}
button:focus-visible,
.btn:focus-visible {
  outline: 2px solid var(--nb-blue);
  outline-offset: 2px;
}

[v-intersect] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
[v-intersect].is-visible {
  opacity: 1;
  transform: translateY(0);
}
footer svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
