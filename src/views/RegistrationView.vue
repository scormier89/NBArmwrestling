<template>
  <section class="max-w-4xl mx-auto px-4 py-10 relative">
    <h1
      class="text-3xl font-serif font-bold text-center mb-8 sticky top-[80px] bg-white z-10 py-2 tracking-tight"
    >
      Register for NB Provincials 2025
    </h1>

    <form
      @submit.prevent="handleSubmit"
      class="space-y-6 bg-white/90 border border-gray-100 rounded-xl shadow-sm p-6"
    >
      <!-- Name -->
      <div>
        <label class="block mb-1 font-semibold text-sm tracking-wide"
          >Full Name</label
        >
        <input
          v-model="form.name"
          required
          class="w-full border border-gray-200 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          type="text"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block mb-1 font-semibold text-sm tracking-wide"
          >Email</label
        >
        <input
          v-model="form.email"
          required
          class="w-full border border-gray-200 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          type="email"
        />
      </div>

      <!-- Weight -->
      <div>
        <label class="block mb-1 font-semibold text-sm tracking-wide"
          >Your Weight (lbs)</label
        >
        <input
          v-model.number="form.weight"
          required
          class="w-full border border-gray-200 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          type="number"
          min="50"
        />
      </div>

      <!-- Class Count -->
      <div>
        <label class="block mb-1 font-semibold text-sm tracking-wide"
          >How many classes will you be pulling?</label
        >
        <input
          v-model.number="form.classCount"
          required
          class="w-full border border-gray-200 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          type="number"
          min="1"
          max="10"
        />
      </div>

      <!-- Waiver -->
      <div>
        <p
          class="text-sm text-gray-700 border border-gray-200 p-4 rounded-md leading-relaxed"
        >
          Armwrestling is a physically demanding sport with the risk of serious
          injury. By registering, you accept all risks and release the
          organizers, referees, and venue from liability. Do not register unless
          you agree.
        </p>
        <div>
          <label class="block mb-2 font-semibold text-sm tracking-wide"
            >Sign your name below:</label
          >
          <div class="border border-gray-200 rounded-md p-3 bg-white">
            <canvas
              ref="canvasRef"
              width="400"
              height="150"
              class="border border-gray-300 rounded-md"
            ></canvas>
            <button
              type="button"
              @click="clearSignature"
              class="text-sm text-blue-700 mt-2 hover:text-blue-900 transition-colors"
            >
              Clear Signature
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Note -->
      <div>
        <p class="text-gray-600 text-sm leading-relaxed">
          Registration cost: ${{ form.classCount * 20 }} (based on number of
          classes). Payment is due on-site or can be sent via e-transfer.
        </p>
      </div>

      <!-- Submit -->
      <div>
        <button
          type="submit"
          class="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          Submit Registration
        </button>
      </div>
    </form>

    <div
      v-if="submitted"
      class="mt-8 p-4 bg-green-100 border border-green-400 text-green-800 rounded"
    >
      Registration submitted! We'll see you at weigh-ins.
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SignaturePad from "signature_pad";

const canvasRef = ref(null);
let signaturePad = null;

onMounted(() => {
  if (canvasRef.value) {
    signaturePad = new SignaturePad(canvasRef.value, {
      backgroundColor: "#fff",
      penColor: "black",
    });
  }
});

const clearSignature = () => {
  if (signaturePad) signaturePad.clear();
};

const form = ref({
  name: "",
  email: "",
  weight: null,
  classCount: 1,
  signature: "",
});

const submitted = ref(false);

const handleSubmit = async () => {
  if (signaturePad && signaturePad.isEmpty()) {
    alert("Please sign the form.");
    return;
  }

  const signatureData = signaturePad.toDataURL();

  const payload = {
    ...form.value,
    signature: signatureData,
  };

  try {
    await fetch("https://your-backend-url/api/registerAthlete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    submitted.value = true;
  } catch (error) {
    console.error("Registration error:", error);
    alert(
      "There was a problem submitting your registration. Please try again."
    );
  }
};
</script>

<style scoped>
section {
  font-family: "Roboto", "Segoe UI", sans-serif;
  background-color: #f8f5f1;
}
input {
  background-color: #fff;
}
</style>
