<template>
  <div class="app-shell flex min-h-screen flex-col text-slate-900">
    <div class="app-shell-bg" aria-hidden="true"></div>

    <header class="app-header" :class="{ 'app-header-scrolled': isScrolled }">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="flex h-[76px] items-center justify-between gap-4">
          <RouterLink
            to="/"
            class="brand-mark"
            aria-label="NB Armwrestling home"
          >
            <img
              src="/src/assets/images/logo.png"
              alt="NB Armwrestling Logo"
              class="h-12 w-12 rounded-2xl object-contain ring-1 ring-white/20"
            />
            <div class="hidden sm:block">
              <p class="brand-title">NB Armwrestling</p>
              <p class="brand-subtitle">Strength. Community. Competition.</p>
            </div>
          </RouterLink>

          <nav
            class="hidden md:flex items-center gap-1.5"
            aria-label="Primary navigation"
          >
            <RouterLink
              v-for="link in links"
              :key="link.path"
              :to="link.path"
              class="nav-link"
              :class="{ 'nav-link-active': route.path === link.path }"
            >
              {{ link.label }}
            </RouterLink>
          </nav>

          <button
            type="button"
            class="md:hidden nav-toggle"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
            aria-label="Toggle menu"
          >
            <svg
              class="h-6 w-6"
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
        </div>
      </div>

      <div
        v-if="isMobileMenuOpen"
        class="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl"
      >
        <nav class="mx-auto max-w-6xl px-4 py-3" aria-label="Mobile navigation">
          <RouterLink
            v-for="link in links"
            :key="`mobile-${link.path}`"
            :to="link.path"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': route.path === link.path }"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main
      class="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pb-14 pt-28 sm:px-6 sm:pt-32"
    >
      <RouterView v-slot="{ Component }">
        <Transition name="page-swap" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <footer class="site-footer">
      <div class="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
        <div class="mb-4 flex items-center justify-center gap-4">
          <a
            href="https://www.facebook.com/NBArmwrestling"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
            class="social-link"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M22.675 0h-21.35C.59 0 0 .6 0 1.325v21.351C0 23.4.59 24 1.325 24h11.494v-9.294H9.691V11.01h3.128V8.309c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.917.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116c.735 0 1.325-.6 1.325-1.324V1.325C24 .6 23.41 0 22.675 0z"
              />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/nb_armwrestling/"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            class="social-link"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.31.976.975 1.249 2.242 1.31 3.608.058 1.267.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.061 1.366-.335 2.633-1.31 3.608-.975.976-2.242 1.249-3.608 1.31-1.267.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.061-2.633-.335-3.608-1.31-.976-.975-1.249-2.242-1.31-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.061-1.366.335-2.633 1.31-3.608.975-.976 2.242-1.249 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.737 0 8.333.013 7.052.072 5.752.131 4.42.453 3.29 1.582 2.161 2.71 1.839 4.043 1.78 5.343.72 6.624.708 7.028.708 12c0 4.972.013 5.376.072 6.657.059 1.3.381 2.633 1.51 3.761 1.129 1.129 2.462 1.451 3.761 1.51 1.281.059 1.685.072 6.657.072s5.376-.013 6.657-.072c1.3-.059 2.633-.381 3.761-1.51 1.129-1.129 1.451-2.462 1.51-3.761.059-1.281.072-1.685.072-6.657s-.013-5.376-.072-6.657c-.059-1.3-.381-2.633-1.51-3.761C21.294.453 19.961.131 18.661.072 17.38.013 16.976 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"
              />
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@nbarmwrestling"
            target="_blank"
            rel="noopener"
            aria-label="YouTube"
            class="social-link"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M23.498 6.186a2.995 2.995 0 00-2.113-2.117C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.385.569a2.995 2.995 0 00-2.113 2.117C0 8.056 0 12 0 12s0 3.944.502 5.814a2.995 2.995 0 002.113 2.117c1.867.569 9.385.569 9.385.569s7.518 0 9.385-.569a2.995 2.995 0 002.113-2.117C24 15.944 24 12 24 12s0-3.944-.502-5.814zM9.75 15.02V8.98l6.25 3.02-6.25 3.02z"
              />
            </svg>
          </a>
        </div>
        <p class="footer-text">
          © 2026 NB Armwrestling · Recognized by the Canadian Armwrestling
          Federation
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute();
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

const baseLinks = [
  { path: "/", label: "Home" },
  { path: "/events", label: "Events" },
  { path: "/teams", label: "Teams" },
  { path: "/cawf", label: "CAWF" },
  { path: "/contact", label: "Contact" },
];

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const links = computed(() =>
  isLocalhost ? [...baseLinks, { path: "/shop", label: "Shop" }] : baseLinks,
);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 24;
};

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
);

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
