export interface EarthquakeFeature {
  id: string
  properties: {
    mag: number
    place: string
    time: number
    title: string
    felt: number | null
    tsunami: number
  }
  geometry: {
    coordinates: [number, number, number] // [lng, lat, depth]
  }
}

export interface EarthquakeResponse {
  features: EarthquakeFeature[]
}