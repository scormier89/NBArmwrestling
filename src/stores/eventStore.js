import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


export const useEventStore = defineStore('event', () => {
  const events = ref([])
  const loaded = ref(false)
  // Default to NB-only filtering unless overridden
  const defaultProvince = import.meta?.env?.VITE_DEFAULT_PROVINCE || 'NB'

  // Hardcoded fallback events (if data file fails to load)
  const hardcodedEvents = [
    {
      title: "NB Armwrestling Provincials",
      date: "2026-03-28T10:00:00",
      location: "Moncton Dart Club, 28 Eaton St, Moncton, NB",
      flyer: "/flyers/provincials.jpg",
      details: {
        description: "NB Armwrestling Provincials. Earn your place."
      }
    },
    {
      title: "BOTA XXIX",
      date: "2026-03-07T12:00:00",
      location: "Wellington Community Centre, 4132 Highway 2, Wellington, NS, Canada",
      flyer: "/flyers/bota.jpg",
      details: {
        description: "Battle of the Atlantic XXIX. Juniors: 9am weigh-ins, 10am start. Adults: 11am weigh-ins, 12pm start.",
      }
    },
    {
      title: "Atlantic Canadian Championships",
      date: "2026-04-11T13:00:00",
      location: "Dr Carson & Marion Murray Community Centre, 6 Main St, Springhill, Nova Scotia, Canada",
      flyer: null,
      details: {
        description: "Weigh-ins: Friday night 6–9pm. Saturday: Juniors 9–10am, Seniors 10am–12pm."
      }
    },
    {
      title: "2026 Canadian Nationals",
      date: "2026-06-26T10:00:00",
      location: "Moncton Coliseum, Moncton, NB, Canada",
      flyer: null,
      details: {
        description: "CAWF Nationals 2026 – Moncton NB. June 26–28. Moncton Coliseum.",
        website: "https://cawfmoncton2026.ca/"
      }
    },
    {
      title: "2026 IFA World Championships",
      date: "2026-09-21T10:00:00",
      location: "Craft Civic Hall, Tsuchiura 2-6 Higashi Manabe-cho, Tsuchiura City, Ibaki, Japan",
      flyer: null,
      details: {
        description: "2026 IFA World Championships. September 21 - September 28."
      }
    }
  ]

  const fetchEvents = async () => {
    try {
      const res = await fetch('/data/events.json')
      if (!res.ok) throw new Error('Failed to load events.json')
      const data = await res.json()
      events.value = data.slice().sort((a, b) => new Date(a.date) - new Date(b.date))
    } catch (e) {
      events.value = hardcodedEvents.slice().sort((a, b) => new Date(a.date) - new Date(b.date))
    } finally {
      loaded.value = true
    }
  }

  const clearEvents = () => {
    events.value = []
    loaded.value = false
  }

  const upcomingEvent = computed(() => {
    const now = new Date()
    return events.value.find(e => new Date(e.date) >= now)
  })

  // List of future events only, for the schedule view
  const upcomingEvents = computed(() => {
    const now = new Date()
    return events.value.filter(e => new Date(e.date) >= now)
  })

  return {
    events,
    fetchEvents,
    clearEvents,
    upcomingEvent,
    upcomingEvents,
    loaded,
  }
})
