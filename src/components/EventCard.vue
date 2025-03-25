<template>
    <div
      class="bg-white rounded shadow-md mb-12 flex flex-col md:flex-row transition-all duration-500 ease-in-out fade-in"
      :class="index % 2 === 1 ? 'md:flex-row-reverse' : ''"
    >
      <!-- Flyer Image -->
      <div class="md:w-1/2">
        <img
          :src="event.flyer"
          :alt="event.title"
          class="w-full h-auto object-contain cursor-pointer rounded-t md:rounded-l md:rounded-tr-none"
          @click="emit('lightbox', event.flyer)"
        />
      </div>
  
      <!-- Event Details -->
      <div class="md:w-1/2 p-6 flex flex-col justify-start text-center md:text-left">
        <h3 class="text-2xl font-serif font-bold text-gray-900 mb-2">
          {{ event.title }}
        </h3>
        <p class="text-sm text-gray-700 mb-1">
          {{ new Date(event.date).toLocaleString() }}
        </p>
        <button
          class="inline-flex items-center space-x-1 text-sm text-blue-700 underline hover:text-blue-900 mb-3"
          @click="openInMaps(event.location)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 2a6 6 0 016 6c0 4.418-6 10-6 10S4 12.418 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ event.location }}</span>
        </button>
  
        <!-- Weight Classes -->
        <div v-if="event.weightClasses" class="mt-4 text-left text-sm text-gray-800 space-y-2">
          <div
            v-for="(classes, division) in event.weightClasses"
            :key="division"
          >
            <strong class="text-gray-900">{{ division }}:</strong>
            <span class="ml-1 text-gray-700">{{ classes.join(', ') }}</span>
          </div>
        </div>
        <div v-if="event.details?.weighIns || event.details?.competitionTimes" class="mt-2 text-sm text-gray-700">
        <div v-if="event.details.weighIns?.length">
            <p class="font-medium">Weigh-ins:</p>
            <ul class="ml-4 list-disc">
            <li v-for="(slot, idx) in event.details.weighIns" :key="idx">{{ slot }}</li>
            </ul>
        </div>
        <div v-if="event.details.competitionTimes">
            <p class="font-medium mt-2">Start Times:</p>
            <ul class="ml-4 list-disc">
            <li v-for="(time, group) in event.details.competitionTimes" :key="group">
                {{ group }}: {{ time }}
            </li>
            </ul>
        </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    event: Object,
    index: Number
  })
  const emit = defineEmits(['lightbox'])
  
  const openInMaps = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    window.open(url, '_blank')
  }
  </script>
  
  <style scoped>
  .fade-in {
    animation: fadeIn 0.6s ease forwards;
    opacity: 0;
  }
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
    from {
      opacity: 0;
      transform: translateY(20px);
    }
  }
  </style>
  