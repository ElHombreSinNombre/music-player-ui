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
  showTitle?: boolean
  customTracks?: Track[] | null
}
export default function Table({ customTracks, showTitle = false }: TableProps) {
  const [currentSort, setCurrentSort] = useState<string | null>(null)
  const [isAscending, setIsAscending] = useState<boolean>(false)
  const [toggleSort, settoggleSort] = useState<boolean>(false)
  const [filteredTracks, setfilteredTracks] = useState<Track[] | null>(null)
  const [changePlaying, setTrack, track, tracks] = useStore((state) => [
    state.changePlaying,
    state.setTrack,
    state.track,
    state.tracks
  ])
  const allTracks = customTracks ? customTracks : tracks

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
    setfilteredTracks(allTracks)
  }, [customTracks, tracks, track])

  useEffect(() => {
    if (allTracks) {
      setTrack(allTracks.at(0)!)
    }
  }, [allTracks])

  const sortBy = (value: string) => {
    setCurrentSort(value)
    setIsAscending(!isAscending)
    const sortedtracks = [...tracks!].sort((a, b) => {
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
    setfilteredTracks(isAscending ? sortedtracks : sortedtracks.reverse())
  }

  const pausePlay = (track: Track) => {
    setTrack(track)
    changePlaying()
  }

  const SortMenu = () => {
    return (
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='absolute right-0 mt-40 py-4 px-4 bg-color border-lg z-10'
      >
        {options.slice(1).map((option) => (
          <motion.li
            className='text-white hover:text-color cursor-pointer'
            key={option.id}
            onClick={() => {
              settoggleSort(false)
              sortBy(option.name)
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
      {filteredTracks && filteredTracks?.length > 0 && (
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
                settoggleSort(!toggleSort)
              }}
            >
              <SearchIcon />
              <p className='text-base'>Order by</p>
              <ArrowIcon
                className={
                  toggleSort
                    ? '-rotate-90 transition-transform duration-300'
                    : 'transition-transform duration-300 rotate-90'
                }
              >
                Back
              </ArrowIcon>
            </article>
            {toggleSort && <SortMenu />}
          </article>
          <motion.table
            data-testid='table'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='text-color w-full overflow-x-auto'
          >
            <thead>
              <tr>
                {options.map((option) => (
                  <td
                    key={option.id}
                    onClick={() => {
                      option.name !== COLUMNS.COLUMN1
                        ? sortBy(option.name)
                        : null
                    }}
                    className={`text-${
                      currentSort === option.name ? 'white' : 'color'
                    }  ${
                      option.name !== COLUMNS.COLUMN1
                        ? 'hover:text-white cursor-pointer '
                        : null
                    }`}
                  >
                    <div className='flex items-center'>
                      {option.name === COLUMNS.COLUMN5 ? (
                        <ClockIcon>{COLUMNS.COLUMN5}</ClockIcon>
                      ) : (
                        option.name
                      )}
                      {option.name !== COLUMNS.COLUMN1 ? (
                        currentSort === option.name ? (
                          <ArrowIcon
                            width={18}
                            height={18}
                            className={`text-white mx-2 ${
                              isAscending ? 'rotate-90' : '-rotate-90'
                            }`}
                          />
                        ) : (
                          <ArrowIcon
                            width={18}
                            height={18}
                            className={`text-grey mx-2 rotate-90`}
                          />
                        )
                      ) : null}
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTracks.map((allTracks) => (
                <motion.tr
                  onDoubleClick={() => {
                    pausePlay(allTracks)
                  }}
                  onClick={() => {
                    setTrack(allTracks)
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className='border-t border-b border-color hover:bg-color'
                  key={allTracks.id}
                >
                  <td>
                    {allTracks.is_playing ? (
                      <PauseIcon
                        onClick={() => {
                          pausePlay(allTracks)
                        }}
                        className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400 text-white'
                      />
                    ) : (
                      <PlayIcon
                        onClick={() => {
                          pausePlay(allTracks)
                        }}
                        className='cursor-pointer  bg-indigo-500 p-1 rounded-full hover:bg-indigo-400 text-white'
                      />
                    )}
                  </td>
                  <td className='flex items-center text-base '>
                    {allTracks.album?.images?.at(2)?.url && (
                      <Image
                        loading='lazy'
                        className='rounded-lg mr-4'
                        src={allTracks.album.images.at(2)!.url}
                        width={45}
                        height={45}
                        alt='Cover'
                      />
                    )}
                    <article>
                      <Link
                        onClick={() => setTrack(track)}
                        className='text-white cursor-pointer hover:underline'
                        href={`/artist/${allTracks.id}`}
                      >
                        {allTracks.name}
                      </Link>
                      <p className='text-sm'>
                        {allTracks.artists?.at(0)?.name}
                      </p>
                    </article>
                  </td>
                  <td>{allTracks.album.name}</td>
                  <td>
                    {milisecondsToDate({
                      hasYear: true,
                      date: allTracks.album.release_date
                    })}
                  </td>
                  <td>
                    {milisecondsToDate({
                      hasYear: false,
                      date: allTracks.duration_ms
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
