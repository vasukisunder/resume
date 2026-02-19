import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'
import { MouseSparkles } from '@/components/ui/mouse-sparkles'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://vasuki.design/'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Vasuki Sunder — Product Designer',
    template: '%s | Vasuki Sunder'
  },
  description: 'Designer interested in making the world a more beautiful place. MFA Design & Technology @ Parsons & HCI @ UCSD',
};

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white text-zinc-900 tracking-tight dark:bg-zinc-950 dark:text-zinc-100`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="light"
        >
          <div className={`${geist.variable} relative flex min-h-screen w-full flex-col font-sans antialiased`}>
            <MouseSparkles />
            <div className="relative z-10 flex w-full flex-1 justify-center">
              <div className="w-full max-w-md px-4 pt-16">
                <Header />
                {children}
                <Footer />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
