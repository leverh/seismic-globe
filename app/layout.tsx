import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  title: {
    template: '%s | Seismic Globe',
    default: 'Seismic Globe — Real-time 3D Earthquakes',
  },
  description: 'Interactive WebGL visualization of global seismic activity using live USGS data.',
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL('https://seismic-globe.madebyever.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}