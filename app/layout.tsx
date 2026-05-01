import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Ziang Li',
  description: 'Full-stack developer & MIT student at University of Auckland. Backend, ML/AI, cloud.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body>{children}</body>
    </html>
  )
}
