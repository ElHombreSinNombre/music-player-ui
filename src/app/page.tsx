'use client'

import { useEffect, useState } from 'react'
import Input from './components/Input'
import { searchPodcastByName } from './endpoints/podcast'
import { Podcast } from './models/podcast'
import Table from './components/Table'
import Spinner from './components/Spinner'

export default function Home() {
  // Estado local del input
  const [value, setValue] = useState<string>('')
  // Estado local del array de podcast
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  // Estado local del loading
  const [loading, setLoading] = useState<boolean>(false)

  // Si hay algún valor el input cargamos el loading y cuando se setea el estado del podcast, lo volvemos a poner a false
  useEffect(() => {
    if (value) {
      setLoading(true)
      setTimeout(() => {
        searchPodcastByName(value).then((data: Podcast[]) => {
          setPodcasts(data)
        })
      }, 300)
    } else {
      setPodcasts([])
    }
    setLoading(false)
  }, [value])

  /* 
    Cargamos los componentes y enviamos los props
    Pintamos la vista
  */
  return (
    <>
      <Input
        full
        icon
        name='Podcast'
        placeholder='Podcast'
        onChange={(value) => {
          setValue(value.toString())
        }}
      />
      {value && podcasts?.length > 0 ? (
        <Table podcasts={podcasts} />
      ) : loading ? (
        <section className='flex justify-center items-center h-screen'>
          <Spinner backgroundColor='text-indigo-500' />
        </section>
      ) : null}
    </>
  )
}
