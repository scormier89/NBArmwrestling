// Azure Functions API client
// Implements endpoints from the provided OpenAPI and maps results
// to the UI's simplified event format.

const DEFAULT_BASE = 'http://localhost:7075'
const API_MODE = (import.meta?.env?.VITE_API_MODE || 'api').toLowerCase()
// Use local data only when explicitly enabled by VITE_USE_LOCAL_DATA
const USE_LOCAL_DATA = (import.meta?.env?.VITE_USE_LOCAL_DATA === 'true')
const IS_DEV = !!import.meta?.env?.DEV
const USE_PROXY = (import.meta?.env?.VITE_API_USE_PROXY !== 'false')
function apiBase() {
  return import.meta?.env?.VITE_API_BASE || DEFAULT_BASE
}
function apiUrl(path) {
  // In dev, prefer relative /api to use Vite proxy and avoid CORS
  const base = (IS_DEV && USE_PROXY) ? '' : apiBase()
  const sep = path.startsWith('/') ? '' : '/'
  return `${base}/api${sep}${path}`
}

function withAuthHeaders(token) {
  const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

// Debug: show runtime configuration in dev
if (IS_DEV) {
  console.info('[eventsApi] init', {
    API_MODE,
    USE_LOCAL_DATA,
    IS_DEV,
    USE_PROXY,
    apiBase: apiBase(),
  })
}

export async function loginUser(email, password) {
  const res = await fetch(apiUrl('loginUser'), {
    method: 'POST',
    headers: withAuthHeaders(),
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status}`)
  return res.json()
}

export async function getTournaments(params = {}, token) {
  if (USE_LOCAL_DATA) {
    const fallbackRes = await fetch('/data/events.json', { headers: { 'Accept': 'application/json' } })
    const data = await fallbackRes.json()
    return (Array.isArray(data) ? data : []).map(e => ({
      TournamentID: Math.floor(Math.random() * 1_000_000),
      Name: e.title,
      Location: e.location,
      StartDate: e.date,
      EndDate: e.date,
      Latitude: null,
      Longitude: null,
      MaxAthletes: null,
      OpenToOutOfProvince: true,
      CreatedBy: 0,
      CreatedAt: e.date,
    }))
  }

  const query = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') query.append(k, String(v))
  }
  const url = `${apiUrl('getTournaments')}${query.toString() ? `?${query.toString()}` : ''}`
  const res = await fetch(url, { headers: withAuthHeaders(token) })
  if (!res.ok) throw new Error(`getTournaments failed: ${res.status}`)
  return res.json()
}
// Create tournament (admin)
export async function createTournament(payload, token) {
  if (USE_LOCAL_DATA) {
    const email = parseLocalTokenEmail(token) || 'local-admin'
    const list = readLocalTournaments(email)
    const id = Date.now()
    const t = {
      TournamentID: id,
      Name: payload.name,
      Location: payload.location,
      StartDate: payload.startDate,
      EndDate: payload.endDate,
      Latitude: payload.lat ?? null,
      Longitude: payload.lng ?? null,
      MaxAthletes: payload.maxAthletes ?? null,
      OpenToOutOfProvince: !!payload.openToOutOfProvince,
      CreatedBy: email,
      CreatedAt: new Date().toISOString(),
      Divisions: payload.divisions || [],
    }
    list.push(t)
    writeLocalTournaments(email, list)
    return { message: 'Created (local)', tournamentId: id }
  }

  const res = await fetch(apiUrl('createTournament'), {
    method: 'POST',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  })
  if (res.status === 401 || res.status === 403) {
    throw new Error('Unauthorized: invalid or expired token')
  }
  if (!res.ok) throw new Error(`createTournament failed: ${res.status}`)
  return res.json()
}

export async function getMyTournaments(token) {
  if (USE_LOCAL_DATA) {
    const email = parseLocalTokenEmail(token) || 'local-admin'
    return readLocalTournaments(email)
  }

  const res = await fetch(apiUrl('getMyTournaments'), {
    headers: withAuthHeaders(token),
  })
  if (res.status === 401 || res.status === 403) {
    throw new Error('Unauthorized: invalid or expired token')
  }
  if (!res.ok) throw new Error(`getMyTournaments failed: ${res.status}`)
  return res.json()
}

export async function getDivisions() {
  if (typeof USE_LOCAL_DATA !== 'undefined' && USE_LOCAL_DATA) {
    return [
      { id: 1, name: 'Men' },
      { id: 2, name: 'Ladies' },
      { id: 3, name: 'Juniors' },
      { id: 4, name: 'Para' },
      { id: 5, name: 'Grandmaster' },
    ]
  }
  const res = await fetch(apiUrl('getDivisions'), { headers: withAuthHeaders() })
  if (!res.ok) throw new Error(`getDivisions failed: ${res.status}`)
  return res.json()
}

export async function getWeightClasses(divisionId) {
  if (typeof USE_LOCAL_DATA !== 'undefined' && USE_LOCAL_DATA) {
    const presets = {
      1: [ { id: 154, label: '154 lbs' }, { id: 165, label: '165 lbs' }, { id: 176, label: '176 lbs' }, { id: 187, label: '187 lbs' }, { id: 198, label: '198 lbs' }, { id: 220, label: '220 lbs' }, { id: 221, label: '220+ lbs' } ],
      2: [ { id: 132, label: '132 lbs' }, { id: 154, label: '154 lbs' }, { id: 155, label: '154+ lbs' } ],
      3: [ { id: 8, label: '8 & Under' }, { id: 10, label: '10 & Under' }, { id: 12, label: '12 & Under' }, { id: 14, label: '14 & Under' }, { id: 16, label: '16 & Under' }, { id: 18, label: '18 & Under' } ],
      4: [ { id: 0, label: 'Para Right' }, { id: 1, label: 'Para Left' } ],
      5: [ { id: 50, label: '50+ 198' }, { id: 51, label: '50+ 198+' } ],
    }
    if (divisionId != null) return presets[divisionId] || []
    return presets
  }
  const url = divisionId != null
    ? apiUrl(`getWeightClasses/${divisionId}`)
    : apiUrl('getWeightClasses')
  const res = await fetch(url, { headers: withAuthHeaders() })
  if (!res.ok) throw new Error(`getWeightClasses failed: ${res.status}`)
  return res.json()
}

// Local-only helpers below
function parseLocalTokenEmail(token) {
  try {
    if (typeof token === 'string' && token.startsWith('local.')) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload?.sub || null
    }
  } catch (_) {}
  return null
}

function localStoreKey(email) { return `local_tournaments_${email || 'anon'}` }
function readLocalTournaments(email) {
  const raw = localStorage.getItem(localStoreKey(email))
  try { return raw ? JSON.parse(raw) : [] } catch { return [] }
}
function writeLocalTournaments(email, list) {
  localStorage.setItem(localStoreKey(email), JSON.stringify(list || []))
}

// Map backend Tournament → front-end event model used by Schedule/EventCard
function mapTournamentToEvent(t) {
  return {
    id: t.TournamentID,
    title: t.Name,
    date: t.StartDate,
    location: t.Location,
    flyer: null, // backend may not provide flyers; UI handles null
    details: null,
  }
}

// Existing front-end integration point used by the Pinia store
export async function getEvents({ province, upcomingOnly = true, lat, lng, radiusKm, token, me } = {}) {
  if (!USE_LOCAL_DATA) {
    // Try backend first
    try {
      const tournaments = await getTournaments({ province, upcomingOnly, lat, lng, radiusKm, me }, token)
      if (IS_DEV) console.info('[eventsApi] Loaded from backend', { count: Array.isArray(tournaments) ? tournaments.length : null })
      if (Array.isArray(tournaments)) return tournaments.map(mapTournamentToEvent)
    } catch (_) {
      // fallthrough to local JSON below
      if (IS_DEV) console.warn('[eventsApi] Backend fetch failed, falling back to local JSON')
    }
  }

  // Fallback to local JSON in public folder
  if (IS_DEV) console.info('[eventsApi] Using local JSON /data/events.json')
  const fallbackRes = await fetch('/data/events.json', { headers: { 'Accept': 'application/json' } })
  const data = await fallbackRes.json()
  let arr = Array.isArray(data) ? data : []

  // Apply local filters similar to backend params
  if (province) {
    const p = String(province).toUpperCase()
    arr = arr.filter(e => matchesProvince(p, e.location))
  }
  if (upcomingOnly) {
    const now = new Date()
    arr = arr.filter(e => new Date(e.date) >= now)
  }
  return arr
}

function matchesProvince(province, location) {
  if (!province || !location) return false
  const loc = String(location).toUpperCase()
  // Simple heuristics: look for ", NB" or province token
  if (province === 'NB') return loc.includes(', NB') || loc.endsWith(' NB') || loc.includes('NEW BRUNSWICK')
  return loc.includes(`, ${province}`) || loc.endsWith(` ${province}`)
}
