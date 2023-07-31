'use client'

import { useEffect, useState } from 'react'
import Input from '../../components/Input'
import Table from './../../components/Table'
import Spinner from './../../components/Spinner'
import { Podcast } from './../../models/podcast'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { searchPodcastById, searchPodcastByName } from '@/app/endpoints/podcast'

interface PodcastParams {
  id: number
}

export default function Podcast({ params }: { params: PodcastParams }) {
  const { id } = params
  const router = useRouter()
  const [value, setValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [podcasts, setPodcasts] = useState<Podcast[]>([])

  /*Si llega algun valor por parametro cargamos el loading y cuando se setea el estado del podcast, lo volvemos a poner a false.
  Hemos buscado el id del artista para recuperar su nombre y luego hemos buscado sus podcasts. Podriamos haber enviado el nombre por parametro
  pero de cara a futura escalabilidad es más apropiado enviar el id */
  useEffect(() => {
    setLoading(true)
    searchPodcastById(id).then((podcastById: Podcast[]) =>
      searchPodcastByName(podcastById.at(0)?.artistName!).then(
        (podcastByName: Podcast[]) => {
          setPodcasts(podcastByName)
        }
      )
    )
    setLoading(false)
  }, [id])

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
    Utilizamos Image de Next 
    Pintamos la vista
  */
  return (
    <>
      <section className='gap-4 space-y-4 '>
        <article className='flex items-center gap-8'>
          <svg
            onClick={() => router.back()}
            width='24'
            height='24'
            strokeWidth='1.5'
            viewBox='0 0 24 24'
            fill='none'
            color='#FFF'
            className='cursor-pointer '
          >
            <path
              d='M15 6l-6 6 6 6'
              stroke='#FFF'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></path>
            <title>Back</title>
          </svg>
          <div className='flex flex-grow'>
            <Input
              full
              icon
              name='Podcast'
              placeholder='Podcast'
              onChange={(value) => {
                setValue(value.toString())
              }}
            />
          </div>
        </article>
        <Image
          title='Podcast'
          loading='lazy'
          className='rounded-lg'
          src='/thubmnail.png'
          width={1200}
          height={280}
          alt='Podcast'
        />
        {podcasts?.length > 0 ? (
          <Table podcasts={podcasts} showTitle />
        ) : loading ? (
          <section className='flex justify-center items-center h-screen'>
            <Spinner backgroundColor='text-indigo-500' />
          </section>
        ) : null}
      </section>
    </>
  )
}
