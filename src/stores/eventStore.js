import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEventStore = defineStore('event', () => {
  const events = ref([])
  const loaded = ref(false)

  const fetchEvents = async () => {
    if (loaded.value) return
    try {
      const res = await fetch('/data/events.json')
      const data = await res.json()
      events.value = data
        .filter(e => e.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
      loaded.value = true
    } catch (err) {
      console.error('Failed to fetch events:', err)
    }
  }

  const upcomingEvent = computed(() => {
    const now = new Date()
    return events.value.find(e => new Date(e.date) >= now)
  })

  return {
    events,
    fetchEvents,
    upcomingEvent,
    loaded,
  }
})
