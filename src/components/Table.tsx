import { type Track } from '../types/track'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { type Options } from '../types/options'
import milisecondsToDate from '../utils/formatDate'
import PauseIcon from '../components/Icons/Pause'
import PlayIcon from '../components/Icons/Play'
import ClockIcon from '../components/Icons/Clock'
import SearchIcon from '../components/Icons/Search'
import ArrowIcon from '../components/Icons/Arrow'
import { useStore } from '../store/player'

interface TableProps {
  showTitle?: boolean
  customTracks?: Track[] | null
}
export default function Table({ customTracks, showTitle = false }: TableProps) {
  const [currentSort, setCurrentSort] = useState<string | null>(null)
  const [isAscending, setIsAscending] = useState<boolean>(false)
  const [toggleSort, settoggleSort] = useState<boolean>(false)
  const [changePlaying, setTrack, track, tracks, setTracks] = useStore(
    (state) => [
      state.changePlaying,
      state.setTrack,
      state.track,
      state.tracks,
      state.setTracks
    ]
  )

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

  useEffect(
    () => setTracks(customTracks ? customTracks : tracks),
    [customTracks, tracks]
  )

  const sortBy = (value: string) => {
    setCurrentSort(value)
    setIsAscending(!isAscending)
    const sortedtracks = [...tracks!].sort((a, b) => {
      if (value === COLUMNS.COLUMN2) {
        return a.album.name.localeCompare(b.album.name)
      } else if (value === COLUMNS.COLUMN3) {
        return a.album.release_date - b.album.release_date
      } else if (value === COLUMNS.COLUMN5) {
        return a.duration_ms - b.duration_ms
      } else {
        return a.name.localeCompare(b.name)
      }
    })
    setTracks(isAscending ? sortedtracks : sortedtracks.reverse())
  }

  const pausePlay = async (track: Track) => {
    await setTrack(track)
    changePlaying()
  }

  const SortMenu = () => {
    return (
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='absolute right-0 mt-40 p-4 bg-color border-lg z-10'
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
    <section data-testid='table'>
      {tracks && tracks?.length > 0 && (
        <>
          <div className='relative flex items-center justify-between space-x-2'>
            {showTitle && track && (
              <div className='icons'>
                {track.is_playing ? (
                  <PauseIcon
                    onClick={() => {
                      changePlaying()
                    }}
                    width={36}
                    height={36}
                    className='playPauseIcon '
                  />
                ) : (
                  <PlayIcon
                    onClick={() => {
                      pausePlay(track)
                    }}
                    width={36}
                    height={36}
                    className='playPauseIcon'
                  />
                )}
                <p className='text-lg font-bold'>{track.name}</p>
              </div>
            )}

            <div
              title='Sort by'
              className={`flex items-center gap-2 ml-auto cursor-pointer transition-colors duration-300 ${
                toggleSort ? 'text-white' : 'text-color hover:text-white'
              }`}
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
            </div>
            {toggleSort && <SortMenu />}
          </div>
          <motion.table
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
              {tracks.map((allTracks) => (
                <motion.tr
                  title='Click to select. Double click to play.'
                  onDoubleClick={() => {
                    pausePlay(allTracks)
                  }}
                  onClick={async () => {
                    if (track?.id !== allTracks.id) {
                      await setTrack(allTracks)
                    }
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className='border-t border-b border-color hover:bg-color hover:text-white cursor-pointer'
                  key={allTracks.id}
                >
                  <td className='icons'>
                    {track?.id === allTracks.id && track?.is_playing ? (
                      <PauseIcon
                        onClick={() => {
                          changePlaying()
                        }}
                        className='playPauseIcon'
                      />
                    ) : (
                      <PlayIcon
                        onClick={() => {
                          pausePlay(allTracks)
                        }}
                        className='playPauseIcon'
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
                        className='text-white hover:underline'
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
                      date: allTracks.duration_ms
                    })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </>
      )}
    </section>
  )
}
