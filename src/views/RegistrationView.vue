<template>
  <section class="registration-ui mx-auto max-w-6xl px-4 py-8 relative">
    <h1
      class="mb-6 sticky top-[92px] z-20 rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 text-center text-3xl font-bold tracking-tight backdrop-blur"
    >
      {{ eventName || "NB Armwrestling Championship" }} Registration
    </h1>

    <div v-if="configLoading" class="text-center py-10 text-gray-600">
      Loading registration...
    </div>

    <div
      v-else-if="configError"
      class="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800"
    >
      <p class="mb-3">Unable to load registration settings.</p>
      <button type="button" class="btn-danger-soft" @click="fetchStripeConfig">
        Retry
      </button>
    </div>

    <div
      v-else-if="!registrationEnabled"
      class="page-surface p-6 text-center text-yellow-900"
    >
      Registration is not yet open. Check back soon.
    </div>

    <form v-else class="page-surface space-y-6 p-6" @submit.prevent>
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
      >
        <div class="text-sm text-slate-500">
          Step {{ currentStep + 1 }} of 4
        </div>
        <div class="flex gap-2 text-xs text-gray-600">
          <span
            v-for="(label, index) in stepLabels"
            :key="label"
            class="px-2 py-1 rounded-full"
            :class="
              index === currentStep
                ? 'bg-sky-700 text-white'
                : 'bg-slate-100 text-slate-600'
            "
          >
            {{ label }}
          </span>
        </div>
      </div>

      <!-- Step 0: Athlete Info -->
      <div v-if="currentStep === 0" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-semibold text-sm">First Name</label>
            <input
              v-model.trim="athlete.firstName"
              type="text"
              class="form-shell w-full"
              required
            />
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Last Name</label>
            <input
              v-model.trim="athlete.lastName"
              type="text"
              class="form-shell w-full"
              required
            />
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Email</label>
            <input
              v-model.trim="athlete.email"
              type="email"
              class="form-shell w-full"
              required
            />
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Province</label>
            <select
              v-model="athlete.province"
              class="form-shell w-full"
              required
            >
              <option value="" disabled>Select province</option>
              <option
                v-for="province in provinces"
                :key="province"
                :value="province"
              >
                {{ province }}
              </option>
            </select>
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Birth Date</label>
            <input
              v-model="athlete.birthDate"
              type="date"
              class="form-shell w-full"
              required
            />
          </div>
          <div>
            <label class="block mb-1 font-semibold text-sm">Gender</label>
            <select v-model="athlete.gender" class="form-shell w-full" required>
              <option value="" disabled>Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div
          v-if="requiresGuardian"
          class="border-t border-slate-200 pt-6 space-y-4"
        >
          <h2 class="text-lg font-semibold">Guardian Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 font-semibold text-sm">First Name</label>
              <input
                v-model.trim="guardian.firstName"
                type="text"
                class="form-shell w-full"
                required
              />
            </div>
            <div>
              <label class="block mb-1 font-semibold text-sm">Last Name</label>
              <input
                v-model.trim="guardian.lastName"
                type="text"
                class="form-shell w-full"
                required
              />
            </div>
            <div>
              <label class="block mb-1 font-semibold text-sm">Email</label>
              <input
                v-model.trim="guardian.email"
                type="email"
                class="form-shell w-full"
                required
              />
            </div>
            <div>
              <label class="block mb-1 font-semibold text-sm">Phone</label>
              <input
                v-model.trim="guardian.phone"
                type="tel"
                class="form-shell w-full"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 1: Select Classes -->
      <div v-if="currentStep === 1" class="space-y-6">
        <div
          v-if="filteredDivisions.length === 0"
          class="text-sm text-gray-600"
        >
          Enter athlete birth date and gender to see eligible divisions.
        </div>

        <div class="stagger-list space-y-4">
          <div
            v-for="division in filteredDivisions"
            :key="division.name"
            class="rounded-lg border border-slate-200 bg-white/72 p-4"
          >
            <div
              class="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 class="text-lg font-semibold">{{ division.name }}</h3>
                <p class="text-xs text-gray-500">{{ division.ageRule }}</p>
              </div>
              <div class="text-xs text-gray-600">
                Fee: CAD ${{ feeForDivision(division) }} per entry
              </div>
            </div>

            <div
              v-for="group in division.groups"
              :key="group.division"
              class="mt-3 border-t pt-3"
            >
              <div
                class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p class="font-semibold text-sm">{{ group.division }}</p>
                  <p class="text-xs text-gray-500" v-if="group.note">
                    {{ group.note }}
                  </p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="handOption in handOptions(group.hand)"
                    :key="handOption"
                    type="button"
                    class="rounded-full border px-3 py-1 text-sm transition"
                    :class="
                      isSelected(division.name, group.division, handOption)
                        ? 'border-sky-700 bg-sky-700 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                    "
                    @click="toggleSelection(division, group, handOption)"
                  >
                    {{ handOption }}
                  </button>
                </div>
              </div>

              <div
                v-for="handOption in handOptions(group.hand)"
                :key="handOption + '-selector'"
                class="mt-3"
              >
                <div
                  v-if="
                    isSelected(division.name, group.division, handOption) &&
                    group.classes.length > 1
                  "
                  class="flex flex-col gap-2 sm:flex-row sm:items-center"
                >
                  <label class="text-sm font-semibold"
                    >Weight Class ({{ handOption }})</label
                  >
                  <select
                    v-model="
                      getSelection(division.name, group.division, handOption)
                        .weightClass
                    "
                    class="form-shell"
                  >
                    <option value="" disabled>Select class</option>
                    <option
                      v-for="cls in group.classes"
                      :key="cls"
                      :value="cls"
                    >
                      {{ cls }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-between border-t border-slate-200 pt-4"
        >
          <p class="text-sm text-slate-600">
            Total entries: {{ selections.length }}
          </p>
          <p class="text-lg font-semibold">Total: CAD ${{ total }}</p>
        </div>
      </div>

      <!-- Step 2: Waiver & Signatures -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div
          class="rounded-lg border border-slate-200 bg-white/70 p-4 text-sm leading-relaxed text-slate-700"
        >
          <p class="font-semibold text-base mb-2">
            Waiver & Release of Liability
          </p>
          <p>
            I acknowledge that armwrestling is a contact sport and involves
            inherent risks of personal injury. In consideration of being
            permitted to participate in this event, I voluntarily assume all
            risks of injury or death arising from my participation.
          </p>
          <p class="mt-2">
            I hereby release, waive, and discharge NB Armwrestling and its
            organizers, volunteers, and officials from any and all liability,
            claims, or demands arising from my participation in this event.
          </p>
          <p class="mt-2">
            I confirm that I am physically fit to compete and have no medical
            conditions that would prevent safe participation.
          </p>
          <p class="mt-2">
            I consent that photos and videos taken during the event may be used
            for promotional purposes.
          </p>
        </div>

        <label class="flex items-start gap-2 text-sm">
          <input type="checkbox" v-model="waiverReadConfirmed" class="mt-1" />
          I have read and agree to the waiver and release of liability above.
        </label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="font-semibold text-sm mb-2">Athlete Signature</p>
            <div class="rounded-md border border-slate-200 bg-white p-3">
              <canvas
                ref="athleteCanvasRef"
                class="w-full rounded-md border border-slate-300"
              ></canvas>
              <button
                type="button"
                @click="clearAthleteSignature"
                class="mt-2 text-sm text-sky-700 transition-colors hover:text-sky-900"
              >
                Clear Signature
              </button>
            </div>
          </div>

          <div v-if="requiresGuardian">
            <p class="font-semibold text-sm mb-2">Guardian Signature</p>
            <div class="rounded-md border border-slate-200 bg-white p-3">
              <canvas
                ref="guardianCanvasRef"
                class="w-full rounded-md border border-slate-300"
              ></canvas>
              <button
                type="button"
                @click="clearGuardianSignature"
                class="mt-2 text-sm text-sky-700 transition-colors hover:text-sky-900"
              >
                Clear Signature
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Review & Pay -->
      <div v-if="currentStep === 3" class="space-y-6">
        <div
          class="space-y-2 rounded-lg border border-slate-200 bg-white/72 p-4"
        >
          <h3 class="text-lg font-semibold">Athlete</h3>
          <p class="text-sm text-gray-700">
            {{ athlete.firstName }} {{ athlete.lastName }} · {{ athlete.email }}
          </p>
          <p class="text-sm text-gray-700">
            {{ athlete.province }} · {{ athlete.birthDate }} ·
            {{ athlete.gender }}
          </p>
        </div>

        <div
          v-if="requiresGuardian"
          class="space-y-2 rounded-lg border border-slate-200 bg-white/72 p-4"
        >
          <h3 class="text-lg font-semibold">Guardian</h3>
          <p class="text-sm text-gray-700">
            {{ guardian.firstName }} {{ guardian.lastName }} ·
            {{ guardian.email }} · {{ guardian.phone }}
          </p>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white/72 p-4">
          <h3 class="text-lg font-semibold mb-3">Entries</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b text-left text-slate-500">
                  <th class="py-2">Division</th>
                  <th class="py-2">Group</th>
                  <th class="py-2">Hand</th>
                  <th class="py-2">Weight Class</th>
                  <th class="py-2">Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="entry in selections"
                  :key="entryKey(entry)"
                  class="border-b border-slate-200/80"
                >
                  <td class="py-2">{{ entry.division }}</td>
                  <td class="py-2">{{ entry.group }}</td>
                  <td class="py-2">{{ entry.hand }}</td>
                  <td class="py-2">{{ entry.weightClass }}</td>
                  <td class="py-2">CAD ${{ selectionFee(entry) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 flex justify-between text-sm">
            <span>Event: {{ eventName }}</span>
            <span class="font-semibold">Total: CAD ${{ total }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <label class="flex items-start gap-2 text-sm">
            <input type="checkbox" v-model="privacyAccepted" class="mt-1" />
            I agree to the Privacy Policy and consent to the collection and use
            of my personal information for event administration purposes.
          </label>
          <label class="flex items-start gap-2 text-sm">
            <input type="checkbox" v-model="refundAccepted" class="mt-1" />
            I acknowledge that registration fees are non-refundable once
            submitted (except at organizer discretion), and I confirm my
            agreement to the waiver signed above.
          </label>
        </div>

        <div>
          <button
            type="button"
            class="btn-primary disabled:opacity-60"
            :disabled="submitting || !stepValid(3)"
            @click="submitRegistration"
          >
            <span v-if="submitting">Processing...</span>
            <span v-else>Proceed to Payment</span>
          </button>
          <p v-if="submitError" class="text-sm text-red-700 mt-3">
            {{ submitError }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center justify-between border-t border-slate-200 pt-4"
      >
        <button
          type="button"
          class="btn-secondary"
          :disabled="currentStep === 0"
          @click="goBack"
        >
          Back
        </button>
        <button
          v-if="currentStep < 3"
          type="button"
          class="btn-primary disabled:opacity-60"
          :disabled="!stepValid(currentStep)"
          @click="goNext"
        >
          Next
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import SignaturePad from "signature_pad";
import { loadStripe } from "@stripe/stripe-js";
import { ALL_DIVISIONS, resolveActiveDivisions } from "@/data/divisions";
import { filterDivisionsForAthlete } from "@/utils/divisionEligibility";

const API_BASE = import.meta.env.DEV
  ? "/api"
  : `${import.meta.env.VITE_API_BASE || "https://nbaw-func-rec-02242127.azurewebsites.net"}/api`;
const TENANT_HEADER = { "x-tenant-id": "nbaw" };
const FUNNEL_SESSION_KEY = "nbaw_reg_funnel_session_id";
const DRAFT_KEY = "nbaw_reg_draft";

const stepLabels = ["Athlete Info", "Classes", "Waiver", "Review"];
const currentStep = ref(0);

const configLoading = ref(true);
const configError = ref(false);
const registrationEnabled = ref(false);
const publishableKey = ref("");
const eventName = ref("");
const tournamentId = ref("");
const tournamentSlug = ref("");
const divisionsConfig = ref(null);

const route = useRoute();

const athlete = reactive({
  firstName: "",
  lastName: "",
  email: "",
  province: "",
  birthDate: "",
  gender: "",
});

const guardian = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});

const waiverReadConfirmed = ref(false);
const privacyAccepted = ref(false);
const refundAccepted = ref(false);
const submitting = ref(false);
const submitError = ref("");

const selections = ref([]);
const signatures = reactive({ athlete: null, guardian: null });

const athleteCanvasRef = ref(null);
const guardianCanvasRef = ref(null);
let athletePad = null;
let guardianPad = null;
const athleteSigned = ref(false);
const guardianSigned = ref(false);

const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

const isEmailValid = (email) => /.+@.+/.test(email || "");

const requiresGuardian = computed(() => {
  const age = ageAtRegistration(athlete.birthDate);
  return age !== undefined && age < 18;
});

const athleteValid = computed(
  () =>
    athlete.firstName &&
    athlete.lastName &&
    isEmailValid(athlete.email) &&
    athlete.province &&
    athlete.birthDate &&
    athlete.gender,
);

const guardianValid = computed(
  () =>
    !requiresGuardian.value ||
    (guardian.firstName &&
      guardian.lastName &&
      isEmailValid(guardian.email) &&
      guardian.phone),
);

const findDivisionByName = (divisionName) =>
  availableDivisions.value.find((division) => division.name === divisionName);

const selectionFee = (entry) => {
  const division = findDivisionByName(entry?.division);
  if (division) {
    return feeForDivision(division);
  }
  if (typeof entry?.fee === "number") {
    return entry.fee;
  }
  return defaultFeeForDivision(entry?.division || "");
};

const total = computed(() =>
  selections.value.reduce((sum, entry) => sum + selectionFee(entry), 0),
);

const selectionsValid = computed(
  () =>
    selections.value.length > 0 &&
    selections.value.every((entry) => entry.weightClass),
);

const waiverValid = computed(
  () =>
    waiverReadConfirmed.value &&
    athleteSigned.value &&
    (!requiresGuardian.value || guardianSigned.value),
);

const availableDivisions = computed(() =>
  resolveActiveDivisions(divisionsConfig.value),
);

const filteredDivisions = computed(() => {
  return filterDivisionsForAthlete(
    availableDivisions.value,
    athlete.birthDate,
    athlete.gender,
  );
});

const stepValid = (step) => {
  if (step === 0) return athleteValid.value && guardianValid.value;
  if (step === 1) return selectionsValid.value;
  if (step === 2) return waiverValid.value;
  if (step === 3) return privacyAccepted.value && refundAccepted.value;
  return false;
};

const entryKey = (entry) => `${entry.division}-${entry.group}-${entry.hand}`;

const handOptions = (hand) => {
  if (hand === "Both") return ["Left", "Right"];
  return [hand];
};

const getSelection = (division, group, hand) =>
  selections.value.find(
    (entry) =>
      entry.division === division &&
      entry.group === group &&
      entry.hand === hand,
  );

const isSelected = (division, group, hand) =>
  !!getSelection(division, group, hand);

const toggleSelection = (division, group, hand) => {
  const divisionName = division.name;
  const existing = getSelection(divisionName, group.division, hand);
  if (existing) {
    selections.value = selections.value.filter((entry) => entry !== existing);
    return;
  }

  const weightClass = group.classes.length === 1 ? group.classes[0] : "";
  selections.value.push({
    division: divisionName,
    group: group.division,
    hand,
    weightClass,
    fee: feeForDivision(division),
  });
};

const syncSignatures = () => {
  if (athletePad && !athletePad.isEmpty()) {
    signatures.athlete = athletePad.toDataURL();
  }
  if (requiresGuardian.value) {
    signatures.guardian =
      guardianPad && !guardianPad.isEmpty() ? guardianPad.toDataURL() : null;
  } else {
    signatures.guardian = null;
  }
};

const goNext = async () => {
  if (!stepValid(currentStep.value)) return;
  if (currentStep.value === 2) {
    syncSignatures();
  }
  currentStep.value += 1;
  await nextTick();
  sendFunnelTrack("step_change");
  if (currentStep.value === 2) initializeSignaturePads();
};

const goBack = async () => {
  if (currentStep.value === 0) return;
  currentStep.value -= 1;
  await nextTick();
  sendFunnelTrack("step_change");
  if (currentStep.value === 2) initializeSignaturePads();
};

const clearAthleteSignature = () => {
  if (athletePad) athletePad.clear();
  signatures.athlete = null;
  athleteSigned.value = false;
};

const clearGuardianSignature = () => {
  if (guardianPad) guardianPad.clear();
  signatures.guardian = null;
  guardianSigned.value = false;
};

const bindSignatureTracking = (pad, signedRef, key) => {
  if (!pad) return;

  const updateSignedState = () => {
    const hasSignature = !pad.isEmpty();
    signedRef.value = hasSignature;
    signatures[key] = hasSignature ? pad.toDataURL() : null;
  };

  pad.addEventListener("endStroke", updateSignedState);
  updateSignedState();
};

const initializeSignaturePads = () => {
  if (athleteCanvasRef.value) {
    setupCanvasSize(athleteCanvasRef.value);
    athletePad = new SignaturePad(athleteCanvasRef.value, {
      backgroundColor: "#fff",
      penColor: "black",
    });
    if (signatures.athlete) athletePad.fromDataURL(signatures.athlete);
    bindSignatureTracking(athletePad, athleteSigned, "athlete");
  }
  if (guardianCanvasRef.value && requiresGuardian.value) {
    setupCanvasSize(guardianCanvasRef.value);
    guardianPad = new SignaturePad(guardianCanvasRef.value, {
      backgroundColor: "#fff",
      penColor: "black",
    });
    if (signatures.guardian) guardianPad.fromDataURL(signatures.guardian);
    bindSignatureTracking(guardianPad, guardianSigned, "guardian");
  }
};

const setupCanvasSize = (canvas) => {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const width = canvas.clientWidth || 400;
  const height = 160;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.height = `${height}px`;
  canvas.getContext("2d").scale(ratio, ratio);
};

const fetchStripeConfig = async () => {
  configLoading.value = true;
  configError.value = false;
  try {
    const slug = route.query.tournament ? String(route.query.tournament) : "";
    const configUrl = slug
      ? `${API_BASE}/v2/stripe/config?tournament=${encodeURIComponent(slug)}`
      : `${API_BASE}/v2/stripe/config`;
    const response = await fetch(configUrl, {
      headers: TENANT_HEADER,
    });
    if (!response.ok) throw new Error("config fetch failed");
    const data = await response.json();
    registrationEnabled.value = !!data.registrationEnabled;
    publishableKey.value = data.publishableKey || "";
    eventName.value = data.eventName || "";
    tournamentId.value = data.tournamentId || "";
    tournamentSlug.value = data.tournamentSlug || slug || "";
    divisionsConfig.value = await fetchTournamentDivisions(
      tournamentSlug.value,
      tournamentId.value,
    );
  } catch (error) {
    console.error("Stripe config error:", error);
    configError.value = true;
  } finally {
    configLoading.value = false;
  }
};

const fetchTournamentDivisions = async (slug, id) => {
  try {
    const response = await fetch(`${API_BASE}/v2/tournaments`, {
      headers: TENANT_HEADER,
    });
    if (!response.ok) return null;
    const data = await response.json();
    const tournaments = Array.isArray(data?.tournaments)
      ? data.tournaments
      : [];
    const tournament = tournaments.find((item) => {
      if (slug && item.tournamentSlug === slug) return true;
      if (id && item.tournamentId === id) return true;
      return false;
    });
    return tournament?.divisionsConfig ?? null;
  } catch {
    return null;
  }
};

const submitRegistration = async () => {
  if (!stepValid(3) || submitting.value) return;
  submitError.value = "";
  submitting.value = true;

  try {
    syncSignatures();
    sendFunnelTrack("checkout_attempt");

    const payload = {
      funnelSessionId: ensureFunnelSessionId(),
      deviceType: detectDeviceType(),
      tournamentId: tournamentId.value || undefined,
      tournamentSlug: tournamentSlug.value || undefined,
      athlete: { ...athlete },
      entries: selections.value.map((entry) => ({
        ...entry,
        fee: selectionFee(entry),
      })),
      total: total.value,
      guardian: requiresGuardian.value ? { ...guardian } : undefined,
      signatures: {
        athlete: signatures.athlete,
        guardian: requiresGuardian.value ? signatures.guardian : null,
      },
      consent: {
        privacyAccepted: privacyAccepted.value,
        reminderEmailsAccepted: true,
        version: "2026-03",
      },
    };

    const response = await fetch(`${API_BASE}/v2/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...TENANT_HEADER,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 403) {
      submitError.value = "Registration is not available at this time.";
      sendFunnelTrack("checkout_start_failed");
      return;
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      submitError.value = data.error || "Unable to start checkout.";
      sendFunnelTrack("checkout_start_failed");
      return;
    }

    localStorage.removeItem(DRAFT_KEY);
    localStorage.setItem(
      "nbaw_reg_name",
      `${athlete.firstName} ${athlete.lastName}`,
    );

    const stripe = await loadStripe(publishableKey.value);
    if (!stripe) throw new Error("Stripe failed to load");
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("Checkout error:", error);
    submitError.value = error.message || "Unable to start checkout.";
    sendFunnelTrack("checkout_start_failed");
  } finally {
    submitting.value = false;
  }
};

const persistDraft = () => {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        step: currentStep.value,
        athlete,
        guardian,
        selections: selections.value,
      }),
    );
  } catch {
    // ignore draft errors
  }
};

const restoreDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const draft = JSON.parse(raw);
    if (draft.athlete) Object.assign(athlete, draft.athlete);
    if (draft.guardian) Object.assign(guardian, draft.guardian);
    if (draft.selections) selections.value = draft.selections;
  } catch {
    // ignore draft errors
  }
};

const sendFunnelTrack = async (event) => {
  const sessionId = ensureFunnelSessionId();
  try {
    await fetch(`${API_BASE}/registration-funnel-track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...TENANT_HEADER,
      },
      body: JSON.stringify({
        funnelSessionId: sessionId,
        event,
        step: currentStep.value,
        deviceType: detectDeviceType(),
        athleteFirstName: athlete.firstName,
        athleteLastName: athlete.lastName,
        athleteEmail: athlete.email,
        entryCount: selections.value.length,
        totalFee: total.value,
      }),
      keepalive: true,
    });
  } catch {
    // analytics only
  }
};

const ensureFunnelSessionId = () => {
  let id = sessionStorage.getItem(FUNNEL_SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(FUNNEL_SESSION_KEY, id);
  }
  return id;
};

const detectDeviceType = () => {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "mobile";
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  if (navigator.maxTouchPoints > 1) return "tablet";
  return "desktop";
};

const ageAtRegistration = (birthDate) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate || "");
  if (!match) return undefined;
  const [_, y, mo, d] = match.map(Number);
  const today = new Date();
  let age = today.getFullYear() - y;
  const hadBirthday =
    today.getMonth() + 1 > mo ||
    (today.getMonth() + 1 === mo && today.getDate() >= d);
  if (!hadBirthday) age -= 1;
  return age;
};

const defaultFeeForDivision = (divisionName) =>
  /junior|youth/i.test(divisionName) ? 40 : 80;

const feeForDivision = (division) => {
  if (typeof division?.fee === "number") {
    return division.fee;
  }
  return defaultFeeForDivision(division?.name || "");
};

const normalizeSelectionFees = () => {
  selections.value = selections.value.map((entry) => ({
    ...entry,
    fee: selectionFee(entry),
  }));
};

const pruneSelections = () => {
  const allowed = new Set();
  for (const div of filteredDivisions.value) {
    for (const group of div.groups) {
      for (const hand of handOptions(group.hand)) {
        allowed.add(`${div.name}-${group.division}-${hand}`);
      }
    }
  }
  selections.value = selections.value.filter((entry) =>
    allowed.has(entryKey(entry)),
  );
};

watch([() => athlete.birthDate, () => athlete.gender], () => {
  pruneSelections();
  normalizeSelectionFees();
});

watch(
  [athlete, guardian, selections],
  () => {
    persistDraft();
  },
  { deep: true },
);

watch(requiresGuardian, (value) => {
  if (!value) {
    guardian.firstName = "";
    guardian.lastName = "";
    guardian.email = "";
    guardian.phone = "";
    guardianSigned.value = false;
    signatures.guardian = null;
  }
});

watch(availableDivisions, () => {
  normalizeSelectionFees();
});

watch(
  () => route.query.tournament,
  async () => {
    await fetchStripeConfig();
  },
);

onMounted(async () => {
  restoreDraft();
  await fetchStripeConfig();
  sendFunnelTrack("view");
  if (currentStep.value === 2) initializeSignaturePads();
});
</script>

<style scoped>
.registration-ui :deep(.form-shell) {
  min-height: 2.6rem;
}

.registration-ui :deep(label) {
  color: #334155;
}

.registration-ui :deep(canvas) {
  background: linear-gradient(180deg, #ffffff, #f8fafc);
}
</style>
