import { type Track } from '../models/track'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { type Options } from '../models/options'
import milisecondsToDate from '../utils/formatDate'
import PauseIcon from './Icons/Pause'
import PlayIcon from './Icons/Play'
import ClockIcon from './Icons/Clock'
import SearchIcon from './Icons/Search'
import ArrowIcon from './Icons/Arrow'
import { useStore } from '../store/player'

interface TableProps {
  tracks: Track[] | null
  showTitle?: boolean
}
export default function Table({ tracks, showTitle = false }: TableProps) {
  const [currentSort, setCurrentSort] = useState<string | null>(null)
  const [isAscending, setIsAscending] = useState(false)
  const [toogleSort, setToogleSort] = useState(false)
  const [filteredtracks, setFilteredtracks] = useState<Track[] | null>(tracks)
  const [changePlaying, setTrack, track] = useStore((state) => [
    state.changePlaying,
    state.setTrack,
    state.track
  ])

  const COLUMNS = Object.freeze({
    COLUMN1: '#',
    COLUMN2: 'Name',
    COLUMN3: 'Album',
    COLUMN4: 'Released',
    COLUMN5: 'Duration'
  })

  const options: Options[] = [
    { id: 1, name: COLUMNS.COLUMN1 },
    { id: 2, name: COLUMNS.COLUMN2 },
    {
      id: 3,
      name: COLUMNS.COLUMN3
    },
    {
      id: 4,
      name: COLUMNS.COLUMN4
    },
    {
      id: 5,
      name: COLUMNS.COLUMN5
    }
  ]

  useEffect(() => {
    if (tracks) setFilteredtracks(tracks)
  }, [tracks])

  const pausePlay = (track: Track) => {
    selectTrack(track)
    changePlaying(!track.is_playing)
  }

  const selectTrack = (selected: Track) => {
    setTrack(selected)
  }

  const sortBy = (value: string) => {
    if (tracks) {
      setCurrentSort(value)
      setIsAscending(!isAscending)
      const sortedtracks = [...tracks].sort((a, b) => {
        if (value === COLUMNS.COLUMN1) {
          return a.name.localeCompare(b.name)
        } else if (value === COLUMNS.COLUMN2) {
          return a.album.name.localeCompare(b.album.name)
        } else if (value === COLUMNS.COLUMN3) {
          return a.album.release_date - b.album.release_date
        } else {
          return a.duration_ms - b.duration_ms
        }
      })
      setFilteredtracks(isAscending ? sortedtracks : sortedtracks.reverse())
    }
  }

  const SortMenu = () => {
    return (
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: toogleSort ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
        className='absolute right-0 mt-40 py-4 px-4 bg-color border-lg'
      >
        {options.slice(1).map((option) => (
          <motion.li
            className='text-white hover:text-color cursor-pointer'
            key={option.id}
            onClick={() => {
              setToogleSort(false)
              sortBy(option.name)
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {option.name}
          </motion.li>
        ))}
      </motion.ul>
    )
  }

  return (
    <>
      {filteredtracks && filteredtracks?.length > 0 && (
        <>
          <article className='relative flex items-center justify-between space-x-2'>
            {showTitle && track && (
              <>
                {track.is_playing ? (
                  <PauseIcon
                    onClick={() => {
                      pausePlay(track)
                    }}
                    width={36}
                    height={36}
                    className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400 text-white'
                  />
                ) : (
                  <PlayIcon
                    onClick={() => {
                      pausePlay(track)
                    }}
                    width={36}
                    height={36}
                    className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400 text-white'
                  />
                )}
                <p className='text-lg font-bold'>{track.name}</p>
              </>
            )}

            <article
              title='Sort by'
              className='flex items-center gap-2 ml-auto text-white cursor-pointer'
              onClick={() => {
                setToogleSort(!toogleSort)
              }}
            >
              <SearchIcon />
              <p className='text-base'>Order by</p>
              <ArrowIcon
                className={
                  toogleSort
                    ? '-rotate-90 transition-transform duration-300'
                    : 'transition-transform duration-300 rotate-90'
                }
              >
                Back
              </ArrowIcon>
            </article>
            <SortMenu />
          </article>
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className='text-color w-full overflow-x-auto'
          >
            <thead>
              <tr>
                {options.map((options) => (
                  <td
                    key={options.id}
                    onClick={() => {
                      options.name !== COLUMNS.COLUMN1
                        ? sortBy(options.name)
                        : null
                    }}
                    className={`text-${
                      currentSort === options.name ? 'white' : 'color'
                    }  ${
                      options.name !== COLUMNS.COLUMN1
                        ? 'hover:text-white cursor-pointer '
                        : null
                    }`}
                  >
                    {options.name === COLUMNS.COLUMN5 ? (
                      <ClockIcon />
                    ) : (
                      options.name
                    )}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredtracks.map((track) => (
                <motion.tr
                  onDoubleClick={() => {
                    pausePlay(track)
                  }}
                  onClick={() => {
                    selectTrack(track)
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className='border-t border-b border-color hover:bg-color'
                  key={track.id}
                >
                  <td>
                    {track.is_playing ? (
                      <PauseIcon
                        onClick={() => {
                          pausePlay(track)
                        }}
                        className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400 text-white'
                      />
                    ) : (
                      <PlayIcon
                        onClick={() => {
                          pausePlay(track)
                        }}
                        className='bg-indigo-500 p-1 cursor-pointer rounded-full hover:bg-indigo-400 text-white'
                      />
                    )}
                  </td>
                  <td className='flex items-center text-base '>
                    <Image
                      loading='lazy'
                      className='rounded-lg mr-4'
                      src={track.album.images[2].url}
                      width={45}
                      height={45}
                      alt='Cover'
                    />
                    <article>
                      <Link
                        onClick={() => setTrack(track)}
                        className='text-white cursor-pointer hover:underline'
                        href={`/artist/${track.id}`}
                      >
                        {track.name}
                      </Link>
                      <p className='text-sm'>{track.artists.at(0)?.name}</p>
                    </article>
                  </td>
                  <td>{track.album.name}</td>
                  <td>
                    {milisecondsToDate({
                      hasYear: true,
                      date: track.album.release_date
                    })}
                  </td>
                  <td>
                    {milisecondsToDate({
                      hasYear: false,
                      date: track.duration_ms
                    })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </>
      )}
    </>
  )
}
