import { useQuery } from '@tanstack/react-query'
import { fetchEarthquakes } from '@/services/usgsApi'

export function useEarthquakeData(days = 30, minMag = 4) {
  return useQuery({
    queryKey: ['earthquakes', days, minMag],
    queryFn:  () => fetchEarthquakes(days, minMag),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  })
}