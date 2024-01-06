'use client'
import './assets/globals.scss'

import Player from '../components/Player'
import { ReactNode } from 'react'
import Head from 'next/head'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>Music player</title>
        <meta
          name='description'
          content='Simple music player with react and next'
        />
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
