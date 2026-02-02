<template>
  <div
    class="max-w-2xl mx-auto p-6 text-center bg-white/90 border border-gray-100 rounded-xl shadow-sm"
  >
    <img
      :src="product.image"
      :alt="product.name"
      class="w-full max-w-md mx-auto rounded-lg mb-6 border border-gray-200 shadow-sm"
    />
    <h1 class="text-3xl font-serif font-bold mb-2 tracking-tight">
      {{ product.name }}
    </h1>
    <p class="text-lg text-gray-700 mb-4 leading-relaxed">
      {{ product.description }}
    </p>
    <p class="text-2xl font-semibold mb-6">{{ formatPrice(product.price) }}</p>

    <button
      @click="redirectToCheckout"
      class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors"
      :disabled="loading"
    >
      {{ loading ? "Processing..." : "Buy Now" }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { loadStripe } from "@stripe/stripe-js";

const loading = ref(false);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Hardcoded product for demo — ideally fetched from a backend or CMS
const product = {
  name: "NB Armwrestling Fiery Tee",
  description: "Unleash the beast. Limited edition design.",
  image: "https://yourcdn.com/images/fiery-shirt.png",
  price: 3500, // in cents
  priceId: "price_abc123", // Stripe Dashboard product price ID
};

const formatPrice = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

const redirectToCheckout = async () => {
  loading.value = true;
  try {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: product.priceId }),
    });

    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    loading.value = false;
  }
};
</script>

<style scoped></style>
