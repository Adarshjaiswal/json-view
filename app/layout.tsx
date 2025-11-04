import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JSON Viewer',
  description: 'Beautiful JSON viewer with syntax highlighting and search',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

