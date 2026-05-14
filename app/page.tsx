import type { Metadata } from 'next'
import GlobeScene from '@/components/Globe/GlobeScene'

export const metadata: Metadata = {
  title: 'Seismic Globe — 3D WebGL Visualization Case Study',
  description:
    'Building a cinematic, real-time 3D earthquake globe with React Three Fiber and GLSL. A deep dive into instanced rendering, custom Fresnel shaders, and geospatial coordinate projection.',
  keywords: [
    'React Three Fiber',
    'Three.js',
    'WebGL Visualization',
    'GLSL Shaders',
    'Geospatial Data',
    'Creative Engineering'
  ],
  alternates: {
    canonical: 'https://madebyever.com/projects/seismic-globe',
  },
    openGraph: {
  title: 'Seismic Globe: 3D Data Visualization — Made By Ever',
    description: 'Cinematic real-time seismic monitoring built with R3F and live USGS data.',
    url: 'https://madebyever.com/projects/seismic-globe',
    siteName: 'Made By Ever',
  images: [
      {
        url: '/images/seismic-globe-og.png',
        width: 1200,
        height: 630,
        alt: 'Seismic Globe 3D Interface',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seismic Globe — 3D Case Study | Made By Ever',
    description: 'Real-time WebGL earthquake visualization with custom shaders.',
    images: ['/images/seismic-globe-og.png'],
  },
}

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <GlobeScene />
    </main>
  )
}