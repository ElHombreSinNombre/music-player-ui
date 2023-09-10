'use client'
import './assets/globals.scss'

import Player from './components/Player'
import Head from 'next/head'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Head>
        <title>Music player</title>
        <link rel='icon' type='image/icon' href='favicon.ico' />
      </Head>
      <html lang='en'>
        <body>
          <main className='flex flex-col items-center'>
            <section className='space-y-4 m-4 md:w-3/5 '>{children}</section>
          </main>
          <Player />
        </body>
      </html>
    </>
  )
}
