import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Vazirmatn } from 'next/font/google'
import { PwaInstaller } from '@/components/pwa-installer'
import './globals.css'

const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['arabic', 'latin'],
})

export const metadata: Metadata = {
  title: 'تقویم کارهای من',
  description: 'تقویم جلالی فارسی همراه با مدیریت کارها',
  applicationName: 'تقویم کارهای من',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/pwa-icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0f766e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`light ${vazirmatn.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        <PwaInstaller />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
