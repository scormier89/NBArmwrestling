<template>
  <div>
    <input
      ref="inputEl"
      :value="location"
      @input="onInput($event.target.value)"
      :placeholder="placeholder || 'Search location'"
      class="border rounded p-2 w-full"
    />
    <p v-if="note && !apiLoaded" class="text-xs text-gray-500 mt-1">{{ note }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  placeholder: { type: String, default: 'Search location' },
  initialValue: { type: String, default: '' },
  note: { type: String, default: 'Autocomplete disabled: set VITE_GOOGLE_MAPS_API_KEY to enable.' }
})

const emit = defineEmits(['update:location', 'update:lat', 'update:lng', 'selected'])

const inputEl = ref(null)
const location = ref(props.initialValue)
const apiLoaded = ref(false)
let autocomplete = null

function onInput(val) {
  location.value = val
  emit('update:location', val)
}

function loadGoogleMaps(key) {
  if (window.google && window.google.maps && window.google.maps.places) return Promise.resolve()
  if (!key) return Promise.resolve() // gracefully skip
  if (document.getElementById('gmaps-script')) return new Promise(res => {
    const s = document.getElementById('gmaps-script')
    s.addEventListener('load', () => res())
    if (window.google && window.google.maps) res()
  })
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = 'gmaps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  try {
    await loadGoogleMaps(apiKey)
    if (!(window.google && window.google.maps && window.google.maps.places)) {
      apiLoaded.value = false
      return
    }
    apiLoaded.value = true
    autocomplete = new window.google.maps.places.Autocomplete(inputEl.value, {
      fields: ['formatted_address', 'geometry', 'name'],
    })
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      const addr = place.formatted_address || place.name || location.value
      const lat = place.geometry?.location?.lat?.()
      const lng = place.geometry?.location?.lng?.()
      location.value = addr
      emit('update:location', addr)
      if (typeof lat === 'number') emit('update:lat', lat)
      if (typeof lng === 'number') emit('update:lng', lng)
      emit('selected', { location: addr, lat, lng })
    })
  } catch (e) {
    apiLoaded.value = false
    // leave plain input behavior
  }
})
</script>

<style scoped>
</style>
