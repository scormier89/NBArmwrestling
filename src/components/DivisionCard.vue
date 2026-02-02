<template>
  <div class="border border-gray-200 rounded-xl p-4 bg-white/90 shadow-sm">
    <div class="flex items-center justify-between mb-3">
      <h4 class="font-semibold text-lg">{{ divisionName || "Division" }}</h4>
      <button
        type="button"
        class="text-red-700 underline"
        @click="$emit('remove')"
      >
        Remove
      </button>
    </div>

    <!-- Entry Fee only -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label class="block text-sm text-gray-700 mb-1"
          >Entry Fee (optional)</label
        >
        <input
          v-model.number="local.entryFee"
          type="number"
          step="0.01"
          min="0"
          class="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          placeholder="0.00"
        />
      </div>
    </div>

    <div class="mt-3">
      <div class="mb-1 text-sm font-medium text-gray-700">Weight Classes</div>
      <div class="flex flex-wrap gap-3">
        <span
          v-for="(w, idx) in local.weightClassLabels"
          :key="idx"
          class="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-gray-900 text-sm font-medium"
        >
          {{ w }}
          <button
            type="button"
            class="ml-2 text-xs text-red-700 hover:text-red-800"
            @click="removeLabel(idx)"
          >
            ×
          </button>
        </span>
      </div>
    </div>
    <!-- Ghosted 'Add Weight Class' like New Division -->
    <div class="mt-4 border-2 border-dashed rounded-lg p-3 bg-white">
      <div class="flex items-center justify-between mb-2">
        <h5 class="text-sm font-semibold">Add Weight Class</h5>
        <button
          type="button"
          class="text-blue-700 underline hover:text-blue-900 transition-colors disabled:opacity-50"
          @click="addLabel()"
          :disabled="!canAddNewWeight"
        >
          Add
        </button>
      </div>
      <input
        v-model="newLabel"
        @keydown.enter.prevent="addLabel()"
        class="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
        placeholder="e.g. 150 lbs Right"
      />
      <p class="text-xs text-gray-500 mt-2">
        This weight class is not added until you click Add.
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ divisionId: 1, entryFee: null, weightClassLabels: [] }),
  },
  divisionName: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue", "remove"]);

const local = reactive({
  divisionId: props.modelValue.divisionId ?? 1,
  entryFee: props.modelValue.entryFee ?? null,
  weightClassLabels: Array.isArray(props.modelValue.weightClassLabels)
    ? [...props.modelValue.weightClassLabels]
    : [],
});

watch(
  local,
  (val) => {
    emit("update:modelValue", {
      divisionId: Number(val.divisionId),
      entryFee: val.entryFee,
      weightClassLabels: [...val.weightClassLabels],
    });
  },
  { deep: true }
);

const newLabel = ref("");
const canAddNewWeight = computed(
  () => !!String(newLabel.value || "").trim().length
);

function addLabel() {
  const s = String(newLabel.value || "").trim();
  if (s) {
    local.weightClassLabels.push(s);
  }
  newLabel.value = "";
}

function removeLabel(index) {
  local.weightClassLabels.splice(index, 1);
}
</script>

<style scoped></style>
