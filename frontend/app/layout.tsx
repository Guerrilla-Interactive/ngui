import './globals.css'

import Script from 'next/script'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        { /* 
      NextJS gives an error when using a script as stragegy beforeInteractive. Details here:
      https://github.com/vercel/next.js/issues/51242
      This is needed because wails only injects its runtime in the entry (index) file:
      https://github.com/wailsapp/wails/issues/2262
      */}
        <Script src="/wails/ipc.js" strategy='beforeInteractive' />
        <Script src="/wails/runtime.js" strategy='beforeInteractive' />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
