'use client'

import { useEffect, useMemo, useState } from 'react'
import Input from '../../components/Input'
import Table from '../../components/Table'
import Spinner from '../../components/Spinner'
import { type Track } from '../../models/track'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Toast from '../../components/Toast'
import ArrowIcon from '../../components/Icons/Arrow'
import { useStore } from '../../store/player'
import debounce from '@/app/utils/debounce'

export default function Podcast() {
  const router = useRouter()
  const [name, setName] = useState<string | null>(null)
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [tracks, setTracks] = useState<Track[]>([])
  const { track, fetchSongsById } = useStore((state) => ({
    track: state.track,
    fetchSongsById: state.fetchSongsById
  }))

  const getSongs = ({ id, name }: { id: string; name: string }): void => {
    setLoading(true)
    setError(false)
    const param = id ? { id } : { name }
    fetchSongsById(param)
      .then((data: Track[]) => {
        setTracks(data)
      })
      .catch(() => {
        setName('')
        setError(true)
      })
      .finally(() => {
        setLoading(false)
        setError(false)
      })
  }

  useEffect(() => {
    if (track) {
      const id = track.artists[0].id
      getSongs({ id })
    }
  }, [track])

  useEffect(() => {
    if (name) {
      const debouncedFetch = debounce(() => {
        getSongs({ name })
      }, 300)
      debouncedFetch()
    }
  }, [name])

  const trackTable = useMemo(() => {
    if (loading) {
      return (
        <section className='flex justify-center items-center h-screen'>
          <Spinner backgroundColor='text-indigo-500' />
        </section>
      )
    } else {
      return <Table tracks={tracks} showTitle />
    }
  }, [loading, tracks])

  return (
    <>
      <section className='gap-4 space-y-4 '>
        <article className='flex items-center gap-8'>
          <ArrowIcon
            onClick={() => {
              router.back()
            }}
            className='cursor-pointer text-white'
          >
            Back
          </ArrowIcon>
          <div className='flex flex-grow'>
            <Input
              full
              icon
              name='Artist'
              placeholder='Artist'
              onChange={(value) => {
                setName(value.toString())
              }}
            />
          </div>
        </article>
        <Image
          title='Track'
          loading='lazy'
          className='rounded-lg'
          src='/thubmnail.png'
          width={1200}
          height={280}
          alt='Track'
        />

        {error && <Toast text='Ha ocurrido un error' />}
        {trackTable}
      </section>
    </>
  )
}