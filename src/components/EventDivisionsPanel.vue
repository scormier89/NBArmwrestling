<template>
  <div class="space-y-2">
    <template v-if="collapsible">
      <details
        class="rounded-lg border border-slate-200 bg-white/80"
        :open="initiallyOpen"
      >
        <summary
          class="px-3 py-3 cursor-pointer list-none flex items-center justify-between text-sm font-semibold text-slate-900"
        >
          <span>{{ headingText }}</span>
          <span class="text-xs tracking-[0.16em] uppercase text-slate-500"
            >Expand</span
          >
        </summary>
        <div class="px-3 pb-3 space-y-2 border-t border-slate-100">
          <p
            v-if="activeDivisions.length === 0"
            class="rounded-md border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-sm text-slate-600"
          >
            {{ emptyMessage }}
          </p>
          <div
            v-for="division in activeDivisions"
            :key="division.name"
            class="rounded-md border border-slate-200/80 bg-slate-50/60 px-3 py-2"
          >
            <p class="text-sm font-semibold text-slate-900">
              {{ divisionLabel(division) }}
            </p>
            <p class="mt-1 text-sm text-slate-700">
              {{ formatDivisionClasses(division) }}
            </p>
            <p
              v-if="divisionNote(division)"
              class="mt-1 text-xs text-slate-500"
            >
              {{ divisionNote(division) }}
            </p>
          </div>
        </div>
      </details>
    </template>
    <template v-else>
      <h3
        v-if="showHeading"
        class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-2"
      >
        {{ headingText }}
      </h3>
      <p
        v-if="activeDivisions.length === 0"
        class="rounded-md border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-sm text-slate-600"
      >
        {{ emptyMessage }}
      </p>
      <div
        v-for="division in activeDivisions"
        :key="division.name"
        class="rounded-md border border-slate-200/80 bg-slate-50/60 px-3 py-2"
      >
        <p class="text-sm font-semibold text-slate-900">
          {{ divisionLabel(division) }}
        </p>
        <p class="mt-1 text-sm text-slate-700">
          {{ formatDivisionClasses(division) }}
        </p>
        <p v-if="divisionNote(division)" class="mt-1 text-xs text-slate-500">
          {{ divisionNote(division) }}
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { resolveActiveDivisions } from "@/data/divisions";

const props = defineProps({
  tournament: {
    type: Object,
    required: true,
  },
  showHeading: {
    type: Boolean,
    default: true,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  initiallyOpen: {
    type: Boolean,
    default: false,
  },
  headingText: {
    type: String,
    default: "Divisions",
  },
  useDefaultFallback: {
    type: Boolean,
    default: true,
  },
  emptyMessage: {
    type: String,
    default: "Info available soon.",
  },
  divisionsOverride: {
    type: Array,
    default: null,
  },
});

const activeDivisions = computed(() =>
  Array.isArray(props.divisionsOverride)
    ? props.divisionsOverride
    : props.useDefaultFallback
      ? resolveActiveDivisions(props.tournament?.divisionsConfig)
      : Array.isArray(props.tournament?.divisionsConfig)
        ? props.tournament.divisionsConfig
        : [],
);

const divisionLabel = (division) => {
  const hasBoth = division.groups.some((group) => group.hand === "Both");
  const hasLeft = division.groups.some((group) => group.hand === "Left");
  const hasRight = division.groups.some((group) => group.hand === "Right");

  if (hasBoth || (hasLeft && hasRight))
    return `${division.name} (Left & Right)`;
  if (hasLeft) return `${division.name} (Left)`;
  if (hasRight) return `${division.name} (Right)`;
  return division.name;
};

const formatDivisionClasses = (division) => {
  const seen = new Set();
  return division.groups
    .flatMap((group) => group.classes)
    .filter((weightClass) => {
      if (seen.has(weightClass)) return false;
      seen.add(weightClass);
      return true;
    })
    .join(", ");
};

const divisionNote = (division) =>
  division.groups.find((group) => group.note)?.note || "";
</script>
