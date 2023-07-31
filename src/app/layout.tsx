'use client'
import './assets/globals.scss'

import { Provider } from 'react-redux'
import store from './store/store'
import Player from './components/Player'
import Head from 'next/head'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  /* 
  Create-react-app está deprecado, hemos usado Nuxt, más info aqui https://react.dev/learn/start-a-new-react-project
  Hemos agregado Redux para tener siempre el estado del podcast seleccionado
  Pintamos la vista
  */
  return (
    <Provider store={store}>
      <Head>
        <title>Music player</title>
        <link rel='icon' type='image/icon' href='favicon.ico' />
      </Head>
      <html lang='en'>
        <body>
          <main className='flex flex-col items-center'>
            <section className='space-y-4 my-4 mx-4 md:w-3/5 '>
              {children}
            </section>
          </main>
          <Player />
        </body>
      </html>
    </Provider>
  )
}
