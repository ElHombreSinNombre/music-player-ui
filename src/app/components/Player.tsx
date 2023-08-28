import Image from 'next/image'
import { type Track } from '../models/track'
import { motion } from 'framer-motion'
import milisecondsToDate from '../utils/formatDate'
import { useEffect, useRef, useState } from 'react'
import ShuffleIcon from './Icons/Shuffle'
import PreviousIcon from './Icons/Previous'
import PauseIcon from './Icons/Pause'
import PlayIcon from './Icons/Play'
import NextIcon from './Icons/Next'
import LoopIcon from './Icons/Loop'
import VolumeIcon from './Icons/Volume'
import { useStore } from '../store/player'
import Input from './Input'
import ClockIcon from './Icons/Clock'

export default function Player() {
  const [reproduced, setReproduced] = useState<string>('00:00')
  const [remainingDuration, setRemainingDuration] = useState<string>('00:00')
  const [currentProgress, setcurrentProgress] = useState<number>(0)
  const [volume, setVolume] = useState<number>(50)
  const [shuffle, setShuffle] = useState<boolean>(false)
  const [loop, setLoop] = useState<boolean>(false)
  const [info, setInfo] = useState<boolean>(false)
  const [changePlaying, track, setTrack, tracks] = useStore((state) => [
    state.changePlaying,
    state.track,
    state.setTrack,
    state.tracks
  ])

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const pausePlay = (track: Track) => {
    setInfo(false)
    changePlaying(!track.is_playing)
  }
  const changeVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value / 100
      setVolume(value)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timer | undefined
    if (track) {
      interval = setInterval(() => {
        if (audioRef.current) {
          const progress = Math.round(
            (audioRef.current.currentTime / (track.duration_ms / 1000)) * 100
          )
          const formatedReproduced = milisecondsToDate({
            hasYear: false,
            date: audioRef.current.currentTime * 1000
          })
          setReproduced(formatedReproduced)
          const formatedRemaining = milisecondsToDate({
            hasYear: false,
            date: track.duration_ms - audioRef.current.currentTime * 1000
          })
          setRemainingDuration(formatedRemaining)
          setcurrentProgress(progress)
          if (progress >= 100) {
            changePlaying(!track.is_playing)
            setcurrentProgress(0)
            setReproduced('')
            setRemainingDuration('')
          }
          if (Math.round(audioRef.current.currentTime) >= 30) {
            changePlaying(!track.is_playing)
            setInfo(true)
          }
        }
      }, 1000)
    }
    return () => {
      clearInterval(interval as number | undefined)
    }
  }, [track])

  useEffect(() => {
    if (track && track.is_playing && audioRef.current) {
      audioRef.current.src = track.preview_url
      audioRef.current.currentTime = 0
    }
  }, [track])

  const moveIndex = ({
    nextSong = true,
    loop = false
  }: {
    nextSong: boolean
    loop: boolean
  }) => {
    if (tracks && track) {
      const findIndex = tracks.findIndex((element) => element.id === track.id)
      if (findIndex !== -1) {
        let index: number
        if (loop) {
          index = findIndex === tracks.length - 1 ? 0 : findIndex + 1
        } else {
          if (findIndex === 0 && !nextSong) {
            index = tracks.length - 1
          } else if (findIndex === tracks.length - 1 && nextSong) {
            index = 0
          } else {
            index = nextSong ? findIndex + 1 : findIndex - 1
          }
        }
        const changedIndex = index % tracks.length
        setTrack(tracks[changedIndex])
        pausePlay(track)
      }
    }
  }

  const Icons = () => {
    return (
      <article className='flex gap-8 items-center '>
        <ShuffleIcon
          onClick={() => {
            setShuffle(!shuffle)
            if (shuffle && tracks) {
              setTrack(tracks[Math.floor(Math.random() * tracks.length)])
              if (track) {
                pausePlay(track)
              }
            }
          }}
          className={`cursor-pointer hidden md:flex hover:text-indigo-500 text-${
            shuffle ? 'indigo-500' : 'white'
          }`}
        />
        <PreviousIcon
          className='cursor-pointer hidden md:flex text-white hover:text-indigo-500 '
          onClick={() => {
            moveIndex({ nextSong: false })
          }}
        />
        {track &&
          (track.is_playing ? (
            <PauseIcon
              onClick={() => {
                pausePlay(track)
              }}
              width={36}
              height={36}
              className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400'
            />
          ) : (
            <PlayIcon
              onClick={() => {
                pausePlay(track)
              }}
              width={36}
              height={36}
              className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400'
            />
          ))}
        <NextIcon
          className='cursor-pointer hidden md:flex text-white hover:text-indigo-500'
          onClick={() => {
            moveIndex({ nextSong: true })
          }}
        />
        <LoopIcon
          onClick={() => {
            setLoop(!loop)
            if (loop) {
              moveIndex({ loop: true })
            }
          }}
          className={`cursor-pointer hidden md:flex hover:text-indigo-500 text-${
            loop ? 'indigo-500' : 'white'
          }`}
        />
      </article>
    )
  }

  return (
    <>
      {track && (
        <>
          {info && (
            <section className='fixed top-0 '>
              <ClockIcon className='text-red-500 m-2 cursor-help'>
                Can´t reproduce more than 30s
              </ClockIcon>
            </section>
          )}
          <motion.div
            className='w-full pt-32'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <section className='fixed bottom-0 w-full z-1 px-2'>
              <article className='flex items-center bg-black text-white gap-8 py-2'>
                <Image
                  title={track.name}
                  loading='lazy'
                  src={track.album.images[1].url}
                  width={110}
                  height={110}
                  alt={track.name}
                />
                <section className='flex items-center flex-grow'>
                  <article className='line-clamp-3 w-28'>
                    <p className='line-clamp-1'>{track.name}</p>
                    <p>{track.artists[0]?.name}</p>
                  </article>
                  <article className='flex-grow flex justify-center'>
                    <Icons />
                  </article>
                </section>
                <section className='md:flex flex-grow hidden md:items-center gap-8'>
                  <p className='text-white'>{reproduced}</p>
                  <span className='duration bg-color h-2 rounded-lg overflow-hidden'>
                    <div
                      className='bg-white h-2 rounded-lg overflow-hidden'
                      style={{
                        width: `${currentProgress}%`
                      }}
                    ></div>
                  </span>
                  <p className='text-color'>{remainingDuration}</p>
                  <VolumeIcon className='text-white' off={volume == 0} />
                  <Input
                    title={`Volume at ${volume}%`}
                    type='range'
                    min={0}
                    max={100}
                    step={1}
                    value={volume}
                    onChange={(event) => {
                      changeVolume(+event)
                    }}
                  />
                  {track.is_playing && (
                    <audio autoPlay ref={audioRef}>
                      <source src={track.preview_url} type='audio/mpeg' />
                    </audio>
                  )}
                </section>
              </article>
            </section>
          </motion.div>
        </>
      )}
    </>
  )
}
