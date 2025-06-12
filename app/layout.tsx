import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Transformation',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-[#FFF3E0] to-[#FFE5CC] text-gray-800">
  {children}
</body>

    </html>
  )
}
