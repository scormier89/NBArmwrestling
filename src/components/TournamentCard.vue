<template>
  <div
    class="rounded-2xl border bg-white/90 p-6 flex flex-col gap-3 transition-all duration-200"
    :class="
      active
        ? 'border-sky-300 shadow-lg ring-2 ring-sky-200/70 -translate-y-0.5'
        : 'border-slate-200 shadow-sm hover:shadow-md'
    "
    tabindex="0"
    @mouseenter="emit('hover', tournament)"
    @mouseleave="emit('leave')"
    @focusin="emit('hover', tournament)"
    @click="emit('select', tournament)"
  >
    <div>
      <h2 class="text-xl font-bold text-slate-900">
        {{ tournament.name }}
      </h2>
      <p class="mt-1 text-sm text-slate-600">{{ formattedDate }}</p>
      <p v-if="tournament.location" class="text-sm text-slate-500">
        {{ tournament.location }}
      </p>
    </div>

    <EventDivisionsPanel
      :tournament="tournament"
      :divisions-override="divisionsOverride"
      collapsible
      :use-default-fallback="false"
      :empty-message="divisionsEmptyMessage"
      heading-text="Divisions & Weight Classes"
      class="border-t border-slate-200/80 pt-2"
    />

    <div v-if="cta.type !== 'none'" class="mt-2">
      <button
        v-if="cta.type === 'internal'"
        class="btn-primary"
        type="button"
        @click="register"
      >
        Register Now
      </button>
      <a
        v-else
        :href="cta.url"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-primary"
      >
        Register ↗
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import EventDivisionsPanel from "@/components/EventDivisionsPanel.vue";

const props = defineProps({
  tournament: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  divisionsOverride: {
    type: Array,
    default: null,
  },
  divisionsEmptyMessage: {
    type: String,
    default: "TBD. Info available soon.",
  },
});

const emit = defineEmits(["hover", "leave", "select"]);

const router = useRouter();

const formattedDate = computed(() =>
  new Date(props.tournament.eventDate).toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Moncton",
  }),
);

const cta = computed(() => {
  if (props.tournament.registrationEnabled) {
    return { type: "internal", slug: props.tournament.tournamentSlug };
  }
  if (props.tournament.registrationUrl) {
    return { type: "external", url: props.tournament.registrationUrl };
  }
  return { type: "none" };
});

const register = () => {
  if (cta.value.type !== "internal") return;
  router.push({
    path: "/register",
    query: { tournament: props.tournament.tournamentSlug },
  });
};
</script>
