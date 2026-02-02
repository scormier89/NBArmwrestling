<template>
  <section class="max-w-4xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-serif font-bold mb-6 tracking-tight">
      Admin Panel
    </h1>

    <!-- Auth -->
    <div
      class="mb-8 p-5 border border-gray-100 rounded-xl bg-white/90 shadow-sm"
    >
      <div v-if="!auth.token" class="space-y-3">
        <p class="text-sm text-gray-700">
          Login with the pre-configured admin account.
          <span v-if="auth.isLocal" class="ml-2 text-xs text-gray-500"
            >Local-only mode (no backend login)</span
          >
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            v-model="email"
            class="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            placeholder="Email"
          />
          <input
            v-model="password"
            type="password"
            class="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            placeholder="Password"
          />
        </div>
        <button
          @click="doLogin"
          class="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          Login
        </button>
      </div>
      <div v-else class="flex items-center justify-between">
        <p class="text-sm">
          Logged in as <strong>{{ auth.email }}</strong>
        </p>
        <div class="flex items-center gap-3">
          <span v-if="auth.isLocal" class="text-xs text-gray-500"
            >Local-only auth</span
          >
          <button @click="auth.logout()" class="text-red-700 underline">
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Create Tournament -->
    <div
      v-if="auth.token"
      class="mb-10 p-5 border border-gray-100 rounded-xl bg-white/90 shadow-sm"
    >
      <h2 class="text-xl font-semibold mb-4 tracking-wide">
        Create Tournament
      </h2>
      <!-- Reference: Available Divisions & Weight Classes -->

      <form @submit.prevent="submitTournament" class="space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            v-model="form.name"
            class="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            placeholder="Name"
            required
          />
          <LocationAutocomplete
            :initialValue="form.location"
            placeholder="Location"
            @update:location="(val) => (form.location = val)"
            @update:lat="(val) => (form.lat = val)"
            @update:lng="(val) => (form.lng = val)"
          />
          <input
            v-model="form.startDate"
            type="datetime-local"
            class="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            required
          />
          <input
            v-model="form.endDate"
            type="datetime-local"
            class="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          />
          <input
            v-model.number="form.maxAthletes"
            type="number"
            min="0"
            class="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            placeholder="Max Athletes"
          />
          <label class="flex items-center gap-2">
            <input v-model="form.openToOutOfProvince" type="checkbox" />
            <span>Open To Out Of Province</span>
          </label>
          <input
            v-model.number="form.lat"
            type="hidden"
            step="0.000001"
            class="border border-gray-200 rounded-md p-2"
            placeholder="Latitude (optional)"
          />
          <input
            v-model.number="form.lng"
            type="hidden"
            step="0.000001"
            class="border border-gray-200 rounded-md p-2"
            placeholder="Longitude (optional)"
          />
        </div>

        <!-- Divisions (cards with chip inputs) -->
        <div class="mt-4">
          <h3 class="font-medium mb-2">Divisions</h3>
          <div class="mb-6">
            <h3 class="font-medium mb-2">Available Divisions</h3>
            <div v-if="loadingMeta" class="text-gray-600">
              Loading divisions...
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="d in divisionsMeta"
                :key="d.id"
                class="border border-gray-200 rounded-lg p-3 bg-white"
              >
                <div class="flex items-center justify-between mb-2">
                  <p class="font-semibold">
                    {{ d.name }}
                    <span class="text-xs text-gray-500">(ID: {{ d.id }})</span>
                  </p>
                  <button
                    type="button"
                    class="text-blue-700 underline hover:text-blue-900 transition-colors"
                    @click="addPresetDivision(d.id)"
                  >
                    Add
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="wc in weightClassesMeta[d.id] || []"
                    :key="wc.id ?? wc.label"
                    class="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {{ wc.label ?? wc.name ?? wc.id }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DivisionCard
              v-for="(div, idx) in form.divisions"
              :key="idx"
              v-model="form.divisions[idx]"
              :division-name="divisionName(div.divisionId)"
              @remove="removeDivision(idx)"
            />
          </div>

          <!-- New Division placeholder -->
          <div class="mt-6 border-2 border-dashed rounded-lg p-4 bg-white">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">New Division</h3>
              <button
                type="button"
                class="text-blue-700 underline hover:text-blue-900 transition-colors"
                @click="addNewDivision"
                :disabled="!canAddNewDivision"
              >
                Add
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                v-model.number="newDivision.divisionId"
                class="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              >
                <option :value="null">Select Division</option>
                <option v-for="d in divisionsMeta" :key="d.id" :value="d.id">
                  {{ d.name }}
                </option>
              </select>
              <input
                v-model.number="newDivision.entryFee"
                type="number"
                step="0.01"
                min="0"
                class="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                placeholder="Entry Fee (optional)"
              />
              <div>
                <label class="block text-sm text-gray-700 mb-1"
                  >Add Weight Class</label
                >
                <input
                  v-model="newLabel"
                  @keydown="onNewLabelKeydown"
                  @blur="addNewLabel"
                  class="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  placeholder="e.g. 150 lbs Right"
                />
              </div>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="(w, idx) in newDivision.weightClassLabels"
                :key="idx"
                class="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
              >
                {{ w }}
                <button
                  type="button"
                  class="text-xs text-red-700"
                  @click="removeNewLabel(idx)"
                >
                  ×
                </button>
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              This division is not added until you click Add.
            </p>
          </div>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
            :disabled="creating"
          >
            {{ creating ? "Creating..." : "Create Tournament" }}
          </button>
        </div>
      </form>
    </div>

    <!-- My Tournaments -->
    <div
      v-if="auth.token"
      class="p-5 border border-gray-100 rounded-xl bg-white/90 shadow-sm"
    >
      <h2 class="text-xl font-semibold mb-4 tracking-wide">My Tournaments</h2>
      <div v-if="loadingMy" class="text-gray-600">Loading...</div>
      <div v-else-if="myTournaments.length === 0" class="text-gray-600">
        No tournaments yet.
      </div>
      <ul>
        <li
          v-for="t in myTournaments"
          :key="t.TournamentID"
          class="py-2 border-b"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ t.Name }}</p>
              <p class="text-sm text-gray-600">
                {{ new Date(t.StartDate).toLocaleString() }} — {{ t.Location }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import {
  createTournament,
  getMyTournaments,
  getDivisions,
  getWeightClasses,
} from "@/services/eventsApi";
import DivisionCard from "@/components/DivisionCard.vue";
import LocationAutocomplete from "@/components/LocationAutocomplete.vue";

const auth = useAuthStore();
const email = ref(auth.defaultCreds.email);
const password = ref(auth.defaultCreds.password);

async function doLogin() {
  try {
    await auth.login({ email: email.value, password: password.value });
    await loadMyTournaments();
  } catch (e) {
    alert(e.message || "Login failed");
  }
}

const creating = ref(false);
const loadingMy = ref(false);
const myTournaments = ref([]);
const loadingMeta = ref(false);
const divisionsMeta = ref([]);
const weightClassesMeta = ref({});

const form = ref({
  name: "",
  location: "",
  startDate: "",
  endDate: "",
  maxAthletes: null,
  openToOutOfProvince: false,
  lat: null,
  lng: null,
  divisions: [],
});
function removeDivision(i) {
  form.value.divisions.splice(i, 1);
}

function toRequestPayload() {
  return {
    name: form.value.name,
    location: form.value.location,
    startDate: form.value.startDate
      ? new Date(form.value.startDate).toISOString()
      : null,
    endDate: form.value.endDate
      ? new Date(form.value.endDate).toISOString()
      : null,
    maxAthletes: form.value.maxAthletes || null,
    openToOutOfProvince: !!form.value.openToOutOfProvince,
    lat: form.value.lat ?? null,
    lng: form.value.lng ?? null,
    divisions: form.value.divisions.map((d) => ({
      divisionId: Number(d.divisionId),
      entryFee:
        d.entryFee != null && d.entryFee !== "" ? Number(d.entryFee) : null,
      // keep names for local mode; extract numeric tokens if present for future API use
      weightClassLabels: Array.isArray(d.weightClassLabels)
        ? d.weightClassLabels.filter((s) => String(s).trim().length)
        : [],
      weightClasses: extractNumericIds(d.weightClassLabels),
    })),
  };
}

function extractNumericIds(labels) {
  if (!Array.isArray(labels)) return [];
  const ids = [];
  for (const s of labels) {
    const match = String(s).match(/\d+/);
    if (match) ids.push(Number(match[0]));
  }
  return ids;
}

async function submitTournament() {
  creating.value = true;
  try {
    const payload = toRequestPayload();
    const resp = await createTournament(payload, auth.token);
    alert(`Created tournament ID ${resp.tournamentId}`);
    await loadMyTournaments();
  } catch (e) {
    alert(e.message || "Create failed");
  } finally {
    creating.value = false;
  }
}

// New Division draft state
const newDivision = ref({
  divisionId: null,
  entryFee: null,
  weightClassLabels: [],
});
const newLabel = ref("");
function addNewLabel() {
  const s = String(newLabel.value || "").trim();
  if (s) newDivision.value.weightClassLabels.push(s);
  newLabel.value = "";
}
function onNewLabelKeydown(event) {
  if (event.key === "Enter" || event.key === ",") {
    event.preventDefault();
    addNewLabel();
  }
}
function removeNewLabel(i) {
  newDivision.value.weightClassLabels.splice(i, 1);
}
const canAddNewDivision = computed(
  () =>
    !!newDivision.value.divisionId &&
    newDivision.value.weightClassLabels.length > 0
);
function addNewDivision() {
  if (!canAddNewDivision.value) return;
  form.value.divisions.push({
    divisionId: Number(newDivision.value.divisionId),
    entryFee: newDivision.value.entryFee,
    weightClassLabels: [...newDivision.value.weightClassLabels],
  });
  newDivision.value = {
    divisionId: null,
    entryFee: null,
    weightClassLabels: [],
  };
}

function addPresetDivision(divisionId) {
  const classes = weightClassesMeta.value[divisionId] || [];
  const labels = classes.map((c) => c.label ?? c.name ?? String(c.id));
  form.value.divisions.push({
    divisionId,
    entryFee: null,
    weightClassLabels: labels,
  });
}

async function loadMyTournaments() {
  if (!auth.token) return;
  loadingMy.value = true;
  try {
    myTournaments.value = await getMyTournaments(auth.token);
  } catch (e) {
    console.error(e);
  } finally {
    loadingMy.value = false;
  }
}

onMounted(() => {
  if (auth.token) loadMyTournaments();
});

onMounted(async () => {
  loadingMeta.value = true;
  try {
    const divs = await getDivisions();
    divisionsMeta.value = Array.isArray(divs) ? divs : [];
    // fetch classes per division
    const map = {};
    for (const d of divisionsMeta.value) {
      try {
        map[d.id] = await getWeightClasses(d.id);
      } catch {
        map[d.id] = [];
      }
    }
    weightClassesMeta.value = map;
  } catch (e) {
    console.error("Failed to load metadata", e);
  } finally {
    loadingMeta.value = false;
  }
});

function divisionName(id) {
  const d = divisionsMeta.value.find((x) => Number(x.id) === Number(id));
  return d ? d.name : id ? `Division ${id}` : "Division";
}
</script>

<style scoped>
section {
  font-family: "Roboto", "Segoe UI", sans-serif;
}
</style>
