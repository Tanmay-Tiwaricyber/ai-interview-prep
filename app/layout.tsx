import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ai-interview-prep',
  description: 'ai-interview-prep',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
