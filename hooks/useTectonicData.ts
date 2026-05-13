import { useQuery } from '@tanstack/react-query'

const TECTONIC_URL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'

export function useTectonicData() {
  return useQuery({
    queryKey: ['tectonic'],
    queryFn: async () => {
      const res = await fetch(TECTONIC_URL)
      if (!res.ok) throw new Error('Failed to fetch tectonic data')
      return res.json()
    },
    staleTime: Infinity,
  })
}