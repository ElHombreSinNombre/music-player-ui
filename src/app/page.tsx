'use client'

import { useEffect, useMemo, useState } from 'react'
import Input from '../components/Input'
import Table from '../components/Table'
import Spinner from '../components/Spinner'
import Toast from '../components/Toast'
import { useStore } from '../store/player'
import ArrowIcon from '../components/Icons/Arrow'
import debounce from '../utils/debounce'
import { motion } from 'framer-motion'

export default function Home() {
  const [name, setName] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const { tracks, fetchTracks } = useStore((state) => ({
    tracks: state.tracks,
    fetchTracks: state.fetchTracks
  }))

  const getTracks = ({
    limit,
    more = false
  }: {
    limit?: number
    more?: boolean
  }) => {
    if (name) {
      const debouncedFetch = debounce(() => {
        setLoading(true)
        setError(false)
        fetchTracks({ name, more, limit })
          .catch(() => {
            setName('')
            setError(true)
          })
          .finally(() => {
            setLoading(false)
            setError(false)
          })
      }, 300)
      debouncedFetch()
    }
  }

  useEffect(() => getTracks({}), [name])

  const TrackTable = useMemo(() => {
    if (!loading) {
      return <Table />
    }
    return (
      <section className='flex justify-center items-center h-screen'>
        <Spinner backgroundColor='text-indigo-500' />
      </section>
    )
  }, [loading])

  return (
    <>
      <Input
        full
        icon
        name='Track'
        placeholder='Track'
        onChange={(value) => {
          setName(value.toString())
        }}
      />
      {error && <Toast text='An error has occurred' />}
      {TrackTable}
      {tracks && (
        <motion.section className='flex justify-center items-center'>
          <motion.article
            whileHover={{
              y: [-5, 5],
              transition: {
                repeat: Infinity,
                duration: 0.5,
                ease: 'easeInOut',
                repeatType: 'mirror'
              }
            }}
          >
            <div
              className='text-color -rotate-90 cursor-pointer hover:transition-colors duration-300 hover:text-white'
              onClick={() => getTracks({ more: true })}
            >
              <ArrowIcon>More</ArrowIcon>
            </div>
          </motion.article>
        </motion.section>
      )}
    </>
  )
}
