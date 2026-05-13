import { EarthquakeResponse } from '@/types/earthquake'

const BASE = 'https://earthquake.usgs.gov/fdsnws/event/1/query'

export async function fetchEarthquakes(days = 30, minMag = 4): Promise<EarthquakeResponse> {
  const end   = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)

  const params = new URLSearchParams({
    format:     'geojson',
    starttime:  start.toISOString().split('T')[0],
    endtime:    end.toISOString().split('T')[0],
    minmagnitude: String(minMag),
    limit:      '1000',
    orderby:    'time',
  })

  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) throw new Error('Failed to fetch earthquake data')
  return res.json()
}