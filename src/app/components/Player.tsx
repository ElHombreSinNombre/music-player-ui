import Image from 'next/image'
import { motion } from 'framer-motion'
import milisecondsToDate from '../utils/formatDate'
import { useEffect, useRef, useState } from 'react'
import ShuffleIcon from '../components/Icons/Shuffle'
import PreviousIcon from '../components/Icons/Previous'
import PauseIcon from '../components/Icons/Pause'
import PlayIcon from '../components/Icons/Play'
import NextIcon from '../components/Icons/Next'
import LoopIcon from '../components/Icons/Loop'
import VolumeIcon from '../components/Icons/Volume'
import { useStore } from '../store/player'
import Input from '../components/Input'
import ClockIcon from '../components/Icons/Clock'
import { Track } from '../models/track'
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
  const [prevTrack, setPrevTrack] = useState<Track | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audio = audioRef.current

  useEffect(() => {
    if (track && audio) {
      if ((prevTrack && track.name !== prevTrack.name) || !prevTrack) {
        audio.src = track.preview_url
        resetPlayer()
        progress()
      }
      if (track.is_playing) {
        audio.play()
      } else {
        audio.pause()
      }
      setPrevTrack(track)
    }
  }, [track])

  const progress = () => {
    setInfo(false)
    const interval = setInterval(() => {
      if (audio && track) {
        const currentTime = audio.currentTime
        const formatedReproduced = milisecondsToDate({
          date: currentTime * 1000
        })
        const formatedRemaining = milisecondsToDate({
          date: track.duration_ms - currentTime * 1000
        })
        setReproduced(formatedReproduced)
        setRemainingDuration(formatedRemaining)
        const progress = Math.round(
          (currentTime / (track.duration_ms / 1000)) * 100
        )
        setcurrentProgress(progress)
        if (progress >= 100) {
          changePlaying()
          resetPlayer()
        }
        if (Math.round(currentTime) >= 30) {
          changePlaying()
          resetPlayer()
          setInfo(true)
        }
      }
    }, 1000)
    return () => {
      resetPlayer()
      clearInterval(interval)
    }
  }

  const pausePlay = () => {
    changePlaying()
  }
  const changeVolume = (value: number) => {
    if (audio) {
      audio.volume = value / 100
      setVolume(value)
    }
  }

  const resetPlayer = () => {
    setcurrentProgress(0)
    setReproduced('00:00')
    setRemainingDuration('00:00')
  }

  const moveIndex = ({
    nextSong = true,
    loop = false
  }: {
    nextSong?: boolean
    loop?: boolean
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
        pausePlay()
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
              pausePlay()
            }
          }}
          className={`cursor-pointer hidden md:flex hover:text-indigo-500 text-${
            shuffle ? 'indigo-500' : 'white'
          }`}
        />
        <PreviousIcon
          className='cursor-pointer hidden md:flex text-white hover:text-indigo-500 '
          onClick={() => {
            pausePlay()
            moveIndex({ nextSong: false })
          }}
        />
        {track &&
          (track.is_playing ? (
            <PauseIcon
              onClick={() => {
                pausePlay()
              }}
              width={36}
              height={36}
              className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400'
            />
          ) : (
            <PlayIcon
              onClick={() => {
                pausePlay()
              }}
              width={36}
              height={36}
              className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400'
            />
          ))}
        <NextIcon
          className='cursor-pointer hidden md:flex text-white hover:text-indigo-500'
          onClick={() => {
            pausePlay()
            moveIndex({})
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
    <section data-testid='player'>
      {info && (
        <article className='fixed top-0 right-0'>
          <ClockIcon className='text-red-500 m-2 cursor-help'>
            Can´t reproduce more than 30s
          </ClockIcon>
        </article>
      )}
      {track && tracks && (
        <motion.section
          className='w-full mt-24'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <article className='fixed bottom-0 w-full z-10'>
            <div className='flex items-center bg-black text-white gap-8 w-full'>
              {track.album?.images?.at(1) && (
                <Image
                  title={track.name}
                  loading='lazy'
                  src={track.album.images[1].url}
                  width={110}
                  height={110}
                  alt={track.name}
                />
              )}
              <div className='line-clamp-3 w-28'>
                <p className='line-clamp-1'>{track.name}</p>
                <p>{track.artists?.at(0)?.name}</p>
              </div>
              <div className='flex items-center flex-grow'>
                <div className='flex-grow flex justify-center'>
                  <Icons />
                </div>
              </div>
              <div className='md:flex flex-grow hidden md:items-center justify-center gap-8'>
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
              </div>
              <div className='md:flex flex-grow hidden md:items-center justify-center gap-8'>
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
              </div>
              <audio ref={audioRef}>
                <source type='audio/mpeg' />
              </audio>
            </div>
          </article>
        </motion.section>
      )}
    </section>
  )
}
