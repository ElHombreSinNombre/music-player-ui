'use client'

import { useEffect, useMemo, useState } from 'react'
import Input from './components/Input'
import Table from './components/Table'
import Spinner from './components/Spinner'
import Toast from './components/Toast'
import { useStore } from './store/player'
import ArrowIcon from './components/Icons/Arrow'
import debounce from './utils/debounce'
import { motion } from 'framer-motion'

export default function Home() {
  const [name, setName] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [offset, setOffset] = useState<number>(0)
  const { tracks, fetchTracks } = useStore((state) => ({
    tracks: state.tracks,
    fetchTracks: state.fetchTracks
  }))

  const getTracks = ({ offset }: { offset: number }) => {
    if (name) {
      const debouncedFetch = debounce(() => {
        setLoading(true)
        setError(false)
        fetchTracks({ name, offset })
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

  useEffect(() => {
    getTracks({ offset })
  }, [name, offset])

  const trackTable = useMemo(() => {
    if (loading) {
      return (
        <section className='flex justify-center items-center h-screen'>
          <Spinner backgroundColor='text-indigo-500' />
        </section>
      )
    } else {
      return <Table tracks={tracks} />
    }
  }, [loading, tracks])

  return (
    <>
      <Input
        full
        icon
        name='Track'
        placeholder='Track'
        onChange={(value) => {
          setName(value.toString())
          setOffset(0)
        }}
      />
      {error && <Toast text='Ha ocurrido un error' />}
      {trackTable}
      {tracks && (
        <motion.div className='flex justify-center items-center'>
          <motion.div
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
            <ArrowIcon
              className='text-color -rotate-90 cursor-pointer hover:transition-colors duration-300 hover:text-white'
              onClick={() => setOffset((prev) => prev + 10)}
            >
              More
            </ArrowIcon>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
