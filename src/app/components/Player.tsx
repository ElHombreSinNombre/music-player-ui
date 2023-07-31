import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { Podcast } from '../models/podcast'
import { setControl } from '../store/slices/control'
import { Control } from '../models/control'
import { motion } from 'framer-motion'
import milisecondsToDate from '../utils/formatDate'
import { useState } from 'react'
import Input from './Input'

export default function Player() {
  const dispatch = useDispatch()
  //Estado local para saber si el boton de shuffle esta activo o no
  const [shuffle, setShuffle] = useState(false)
  //Estado local para saber si el boton de loop esta activo o no
  const [loop, setLoop] = useState(false)
  //Recuperamos el podcast seleccionado de la store
  const selectedPodcast = useSelector(
    (state: { podcast: Podcast }) => state.podcast
  )
  //Recuperamos para saber si el boton de play esta activado o no
  const playing = useSelector(
    (state: { control: Control }) => state.control.playing
  )
  //Recuperamos el volumen de la store
  const volume = useSelector(
    (state: { control: Control }) => state.control.volume ?? 5
  )
  //Cambianos el estado del botom de play en la store
  const pausePlay = () => {
    dispatch(setControl({ playing: !playing }))
  }
  //Cambianos el estado del volumen en la store
  const changeVolume = (value: number) => {
    dispatch(setControl({ volume: value }))
  }

  // Creamos esto para aglutinar todos los iconos
  const Icons = () => {
    return (
      <article className='flex gap-8 items-center '>
        <svg
          onClick={() => setShuffle(!shuffle)}
          width='24'
          height='24'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={`cursor-pointer hidden md:flex hover:text-indigo-500 text-${
            shuffle ? 'indigo-500' : 'white'
          }`}
        >
          <title>Shuffle</title>
          <path
            d='M22 7c-3 0-8.5 0-10.5 5.5S5 18 2 18'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M20 5l2 2-2 2M22 18c-3 0-8.5 0-10.5-5.5S5 7 2 7'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M20 20l2-2-2-2'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <svg
          width='24'
          height='24'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
          stroke='currentCOlor'
          xmlns='http://www.w3.org/2000/svg'
          className='cursor-pointer hidden md:flex text-white hover:text-indigo-500'
        >
          <title>Previous</title>
          <path
            d='M6 7v10M17.028 5.267a.6.6 0 01.972.471v12.524a.6.6 0 01-.972.47l-7.931-6.261a.6.6 0 010-.942l7.931-6.262z'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        {playing ? (
          <svg
            onClick={() => pausePlay()}
            width='36'
            height='36'
            strokeWidth='1.5'
            viewBox='0 0 24 24'
            fill='#FFF'
            xmlns='http://www.w3.org/2000/svg'
            className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400'
          >
            <path
              d='M6 18.4V5.6a.6.6 0 01.6-.6h2.8a.6.6 0 01.6.6v12.8a.6.6 0 01-.6.6H6.6a.6.6 0 01-.6-.6zM14 18.4V5.6a.6.6 0 01.6-.6h2.8a.6.6 0 01.6.6v12.8a.6.6 0 01-.6.6h-2.8a.6.6 0 01-.6-.6z'
              strokeWidth='1.5'
            />
            <title>Pause</title>
          </svg>
        ) : (
          <svg
            onClick={() => pausePlay()}
            width='36'
            height='36'
            strokeWidth='1.5'
            viewBox='0 0 24 24'
            fill='#FFF'
            className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M6.906 4.537A.6.6 0 006 5.053v13.894a.6.6 0 00.906.516l11.723-6.947a.6.6 0 000-1.032L6.906 4.537z'
              strokeWidth='1.5'
            ></path>
            <title>Play</title>
          </svg>
        )}
        <svg
          width='24'
          height='24'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='cursor-pointer hidden md:flex text-white hover:text-indigo-500'
        >
          <title>Next</title>
          <path
            d='M18 7v10M6.972 5.267A.6.6 0 006 5.738v12.524a.6.6 0 00.972.47l7.931-6.261a.6.6 0 000-.942L6.972 5.267z'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <svg
          onClick={() => setLoop(!loop)}
          width='24'
          height='24'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
          className={`cursor-pointer hidden md:flex hover:text-indigo-500 text-${
            loop ? 'indigo-500' : 'white'
          }`}
          xmlns='http://www.w3.org/2000/svg'
          stroke='currentColor'
        >
          <title>Loop</title>
          <path
            d='M17 17H8c-1.667 0-5-1-5-5s3.333-5 5-5h8c1.667 0 5 1 5 5 0 1.494-.465 2.57-1.135 3.331'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></path>
          <path
            d='M14.5 14.5L17 17l-2.5 2.5'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></path>
        </svg>
      </article>
    )
  }

  /* 
    Utilizamos framer para agregar animaciones
    Mostramos todos los valores
    Cargamos componentes con props 
    Utilizamos Image de Next 
    Pintamos la vista
  */
  return (
    <>
      {selectedPodcast && (
        <motion.div
          className='w-full pt-32'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <section className='fixed bottom-0 w-full z-1 px-2'>
            <article className='flex items-center  bg-black text-white gap-8 py-2'>
              <Image
                title={selectedPodcast.trackName}
                loading='lazy'
                src={selectedPodcast.artworkUrl100}
                width={110}
                height={110}
                alt={selectedPodcast.trackName}
              />
              <section className='flex items-center flex-grow'>
                <article className='line-clamp-3 w-4/12'>
                  <p>{selectedPodcast.artistName}</p>
                  <p>{selectedPodcast.trackName}</p>
                </article>
                <article className='flex-grow flex justify-center'>
                  <Icons />
                </article>
              </section>
              <section className='md:flex flex-grow hidden md:items-center gap-8'>
                <p className='text-white'>00:00</p>
                <span className='duration h-2 bg-color rounded-lg overflow-hidden'></span>
                <p className='text-color'>
                  {milisecondsToDate(false, selectedPodcast.trackTimeMillis)}
                </p>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  fill='#FFF'
                  xmlns='http://www.w3.org/2000/svg'
                  color='#FFF'
                >
                  <title>Volume</title>
                  <path
                    d='M1 13.857v-3.714a2 2 0 012-2h2.9a1 1 0 00.55-.165l6-3.956a1 1 0 011.55.835v14.286a1 1 0 01-1.55.835l-6-3.956a1 1 0 00-.55-.165H3a2 2 0 01-2-2z'
                    stroke='#FFF'
                    strokeWidth='1.5'
                  ></path>
                  <path
                    d='M17.5 7.5S19 9 19 11.5s-1.5 4-1.5 4M20.5 4.5S23 7 23 11.5s-2.5 7-2.5 7'
                    stroke='#FFF'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  ></path>
                </svg>
                <Input
                  title={`Volume at ${volume}`}
                  type='range'
                  min={0}
                  max={10}
                  step={1}
                  value={volume}
                  onChange={(value) => {
                    changeVolume(+value)
                  }}
                />
              </section>
            </article>
          </section>
        </motion.div>
      )}
    </>
  )
}
