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

export default function Player() {
  const [reproduced, setReproduced] = useState('00:00')
  const [remainingDuration, setRemainingDuration] = useState('00:00')
  const [currentProgress, setcurrentProgress] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [shuffle, setShuffle] = useState(false)
  const [loop, setLoop] = useState(false)
  const [changePlaying, track] = useStore((state) => [
    state.changePlaying,
    state.track
  ])

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const pausePlay = (track: Track) => {
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

  const Icons = () => {
    return (
      <article className='flex gap-8 items-center '>
        <ShuffleIcon
          onClick={() => {
            setShuffle(!shuffle)
          }}
          className={`cursor-pointer hidden md:flex hover:text-indigo-500 text-${
            shuffle ? 'indigo-500' : 'white'
          }`}
        />
        <PreviousIcon className='cursor-pointer hidden md:flex text-white hover:text-indigo-500' />
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
        <NextIcon />
        <LoopIcon
          onClick={() => {
            setLoop(!loop)
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
        <motion.div
          className='w-full pt-32'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <section className='fixed bottom-0 w-full z-1 px-2'>
            <article className='flex items-center  bg-black text-white gap-8 py-2'>
              <Image
                title={track.name}
                loading='lazy'
                src={track.album.images[1].url}
                width={110}
                height={110}
                alt={track.name}
              />
              <section className='flex items-center flex-grow'>
                <article className='line-clamp-3 w-4/12'>
                  <p>{track.name}</p>
                  <p>{track.artists.at(0)?.name}</p>
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
                {volume && (
                  <>
                    <VolumeIcon className='text-white' />
                    <input
                      title={`Volume at ${volume}%`}
                      type='range'
                      min={0}
                      max={100}
                      step={1}
                      value={volume}
                      onChange={(event) => {
                        changeVolume(+event.target.value)
                      }}
                    />
                  </>
                )}
                {track.is_playing && (
                  <audio autoPlay ref={audioRef}>
                    <source src={track.preview_url} type='audio/mpeg' />
                  </audio>
                )}
              </section>
            </article>
          </section>
        </motion.div>
      )}
    </>
  )
}
