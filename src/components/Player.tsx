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
import { Track } from '../types/track'
export default function Player() {
  const [reproduced, setReproduced] = useState<string>('00:00')
  const [remainingDuration, setRemainingDuration] = useState<string>('00:00')
  const [currentProgress, setcurrentProgress] = useState<number>(0)
  const [volume, setVolume] = useState<number>(50)
  const [loop, setLoop] = useState<boolean>(false)
  const [info, setInfo] = useState<boolean>(false)
  const [changePlaying, track, setTrack, tracks, setTracks] = useStore(
    (state) => [
      state.changePlaying,
      state.track,
      state.setTrack,
      state.tracks,
      state.setTracks
    ]
  )
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
    if (track?.is_playing) {
      setInfo(false)
      const interval = setInterval(() => {
        if (audio) {
          const currentTime = audio.currentTime
          const formatedReproduced = milisecondsToDate({
            date: currentTime * 1000
          })
          const formatedRemaining = milisecondsToDate({
            date: track.duration_ms - currentTime * 1000
          })
          setReproduced(formatedReproduced)
          setRemainingDuration(formatedRemaining)
          const progress = Math.round(currentTime)
          setcurrentProgress(progress)
          if (progress >= 100 || progress >= 30) {
            changePlaying()
            resetPlayer()
          }
          if (Math.round(currentTime) >= 30) {
            setInfo(true)
          }
        }
      }, 1000)
      return () => {
        resetPlayer()
        clearInterval(interval)
      }
    }
  }

  const pausePlay = () => {
    changePlaying()
  }

  const changeTrack = async (track: Track) => {
    await setTrack(track)
    pausePlay()
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
        pausePlay()
        let index = nextSong ? findIndex + 1 : findIndex - 1
        if (loop && audio?.currentTime === 30) {
          index = tracks.length - 1 ? 0 : index
        }
        const changedIndex = index % tracks.length
        changeTrack(tracks[changedIndex])
      }
    }
  }

  const Icons = () => {
    return (
      <article className='flex gap-8 items-center icons'>
        <div className='defaultIcon text-white'>
          <ShuffleIcon
            onClick={() => {
              if (tracks) {
                setTracks(tracks.sort(() => Math.random() - 0.5))
                changeTrack(tracks[Math.floor(Math.random() * tracks.length)])
              }
            }}
          />
        </div>
        <div className='defaultIcon text-white'>
          <PreviousIcon
            onClick={() => {
              moveIndex({ nextSong: false })
            }}
          />
        </div>
        {track &&
          (track.is_playing ? (
            <div className='playPauseIcon'>
              <PauseIcon
                onClick={() => {
                  pausePlay()
                }}
                width={36}
                height={36}
              />
            </div>
          ) : (
            <div className='playPauseIcon'>
              <PlayIcon
                onClick={() => {
                  pausePlay()
                }}
                width={36}
                height={36}
              />
            </div>
          ))}
        <div className='defaultIcon text-white'>
          <NextIcon
            onClick={() => {
              moveIndex({})
            }}
          />
        </div>
        <div className={`defaultIcon text-${loop ? 'indigo-500' : 'white'}`}>
          <LoopIcon
            onClick={() => {
              setLoop(!loop)
              if (!loop) {
                moveIndex({ loop: true })
              }
            }}
          />
        </div>
      </article>
    )
  }

  return (
    <section data-testid='player'>
      {info && (
        <article className='fixed top-0 right-0'>
          <div className='text-red-500 m-2 cursor-help'>
            <ClockIcon>Can´t reproduce more than 30s</ClockIcon>
          </div>
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
