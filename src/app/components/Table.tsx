import { Podcast } from '../models/podcast'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setControl } from '../store/slices/control'
import { Control } from '../models/control'
import { podcast } from '../store/reducers/podcast'
import milisecondsToDate from '../utils/formatDate'

interface TableProps {
  podcasts: Podcast[]
  showTitle?: boolean
}

export default function Table({ podcasts, showTitle = false }: TableProps) {
  const dispatch = useDispatch()
  //Estado local para guardar que filtro está seleccionado
  const [currentSort, setCurrentSort] = useState('')
  //Estado local para saber si se ordena ASC o DESC
  const [isAscending, setIsAscending] = useState(false)
  //Estado local para filtrar
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>(podcasts)
  //Estado local para mostrar/ocultar el menú de filtro
  const [toogleSort, setToogleSort] = useState(false)
  //Estado local para saber qué elemento de la tabla se ha pinchado
  const [pausedPodcasts, setPausedPodcasts] = useState<Record<number, boolean>>(
    {}
  )
  //Recuperar de la store elemento de la tabla que se ha pinchado
  const selectedPodcast = useSelector(
    (state: { podcast: Podcast }) => state.podcast
  )
  //Recuperar de la store para saber si está pausado o no el botón de play
  const playing = useSelector(
    (state: { control: Control }) => state.control.playing
  )
  //Opciones del menú y cabeceras de la tabla
  const options = [
    { id: 1, name: '#' },
    { id: 2, name: 'Name' },
    {
      id: 3,
      name: 'Description'
    },
    {
      id: 4,
      name: 'Released'
    },
    {
      id: 5,
      name: 'Duration'
    }
  ]

  //Escuchamos los cambiamos del array de filtros
  useEffect(() => {
    setFilteredPodcasts(podcasts)
  }, [podcasts])

  //Cambiamos el estado de los botones de play/pause en la store
  const pausePlay = (podcast: Podcast) => {
    if (podcast) {
      setPausedPodcasts((prevState: Record<number, boolean>) => ({
        [podcast.trackId]: !prevState[podcast.trackId]
      }))
    }
    dispatch(setControl({ playing: !playing }))
    setPodcast(podcast)
  }

  //Cambiamos el estado del podcast seleccionado en la store
  const setPodcast = (selected: Podcast) => {
    dispatch(podcast(selected))
  }

  //Ordenamos de forma ASC o desc
  const sortBy = (value: string) => {
    setCurrentSort(value)
    setIsAscending(!isAscending)
    const sortedPodcasts = [...podcasts].sort((a, b) => {
      if (value === 'Name') {
        return a.artistName.localeCompare(b.artistName)
      } else if (value === 'Description') {
        return a.trackCensoredName.localeCompare(b.trackCensoredName)
      } else if (value === 'Released') {
        return a.releaseDate - b.releaseDate
      } else {
        return a.trackTimeMillis - b.trackTimeMillis
      }
    })
    setFilteredPodcasts(isAscending ? sortedPodcasts : sortedPodcasts.reverse())
  }

  //Menú de filtro
  const SortMenu = () => {
    return (
      <>
        {toogleSort && (
          <ul className='absolute right-0 mt-40 py-4 px-4 bg-color border-lg  '>
            {options.slice(1).map((option) => (
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className='text-white hover:text-color  cursor-pointer'
                key={option.id}
                onClick={() => sortBy(option.name)}
              >
                {option.name}
              </motion.li>
            ))}
          </ul>
        )}
      </>
    )
  }

  //Pintamos la vista
  return (
    <>
      {filteredPodcasts?.length > 0 && (
        <>
          <article className='relative flex items-center justify-between text-white space-x-2'>
            {showTitle && (
              <>
                {playing ? (
                  <svg
                    onClick={() => pausePlay(selectedPodcast)}
                    width='36'
                    height='36'
                    strokeWidth='1.5'
                    viewBox='0 0 24 24'
                    fill='#FFF'
                    xmlns='http://www.w3.org/2000/svg'
                    className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400'
                  >
                    <title>Pause</title>
                    <path
                      d='M6 18.4V5.6a.6.6 0 01.6-.6h2.8a.6.6 0 01.6.6v12.8a.6.6 0 01-.6.6H6.6a.6.6 0 01-.6-.6zM14 18.4V5.6a.6.6 0 01.6-.6h2.8a.6.6 0 01.6.6v12.8a.6.6 0 01-.6.6h-2.8a.6.6 0 01-.6-.6z'
                      stroke='#FFF'
                      strokeWidth='1.5'
                    />
                  </svg>
                ) : (
                  <svg
                    onClick={() => pausePlay(selectedPodcast)}
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
                {selectedPodcast && (
                  <p className='text-lg font-bold'>
                    {selectedPodcast.trackName}
                  </p>
                )}
              </>
            )}
            <article
              title='Sort by'
              className='flex items-center gap-2 ml-auto cursor-pointer'
              onClick={() => setToogleSort(!toogleSort)}
            >
              <svg width='24' height='24' viewBox='0 0 20 20' fill='none'>
                <path
                  d='M15.8047 14.862L11.8253 10.8826C12.9098 9.55637 13.4429 7.86404 13.3146 6.15568C13.1862 4.44733 12.4061 2.85366 11.1357 1.70432C9.86531 0.554984 8.20173 -0.0620951 6.4891 -0.0192739C4.77647 0.0235473 3.14581 0.722992 1.93442 1.93439C0.723023 3.14578 0.0235778 4.77644 -0.0192434 6.48907C-0.0620646 8.2017 0.555014 9.86528 1.70435 11.1357C2.85369 12.4061 4.44736 13.1862 6.15571 13.3145C7.86407 13.4429 9.5564 12.9097 10.8827 11.8253L14.862 15.8046C14.9877 15.9261 15.1561 15.9933 15.3309 15.9918C15.5057 15.9902 15.6729 15.9201 15.7966 15.7965C15.9202 15.6729 15.9903 15.5057 15.9918 15.3309C15.9933 15.1561 15.9261 14.9877 15.8047 14.862ZM6.66667 12C5.61184 12 4.58069 11.6872 3.70363 11.1011C2.82657 10.5151 2.14298 9.68216 1.73932 8.70762C1.33565 7.73308 1.23003 6.66073 1.43582 5.62616C1.64161 4.5916 2.14956 3.64129 2.89544 2.89541C3.64132 2.14953 4.59163 1.64158 5.62619 1.43579C6.66076 1.23 7.73311 1.33562 8.70765 1.73929C9.68219 2.14295 10.5151 2.82654 11.1012 3.7036C11.6872 4.58066 12 5.61181 12 6.66664C11.9984 8.08064 11.436 9.43627 10.4362 10.4361C9.43631 11.436 8.08067 11.9984 6.66667 12Z'
                  fill='#FFF'
                />
              </svg>
              <p className='text-base'>Order by</p>
              <svg
                className={
                  toogleSort
                    ? 'rotate-180 transition-all duration-500 '
                    : 'transition-all duration-500  '
                }
                width='24'
                height='24'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M14.0325 6.15749C13.9628 6.08719 13.8798 6.03139 13.7884 5.99332C13.6971 5.95524 13.599 5.93564 13.5 5.93564C13.401 5.93564 13.303 5.95524 13.2116 5.99332C13.1202 6.03139 13.0372 6.08719 12.9675 6.15749L9.53251 9.59249C9.46279 9.66278 9.37984 9.71858 9.28845 9.75666C9.19705 9.79473 9.09902 9.81434 9.00001 9.81434C8.90101 9.81434 8.80298 9.79473 8.71158 9.75666C8.62019 9.71858 8.53724 9.66278 8.46751 9.59249L5.03251 6.15749C4.96279 6.08719 4.87984 6.03139 4.78845 5.99332C4.69705 5.95524 4.59902 5.93564 4.50001 5.93564C4.40101 5.93564 4.30298 5.95524 4.21158 5.99332C4.12019 6.03139 4.03724 6.08719 3.96751 6.15749C3.82783 6.29801 3.74942 6.4881 3.74942 6.68624C3.74942 6.88438 3.82783 7.07447 3.96751 7.21499L7.41001 10.6575C7.83189 11.0788 8.40376 11.3155 9.00001 11.3155C9.59627 11.3155 10.1681 11.0788 10.59 10.6575L14.0325 7.21499C14.1722 7.07447 14.2506 6.88438 14.2506 6.68624C14.2506 6.4881 14.1722 6.29801 14.0325 6.15749Z'
                  fill='white'
                />
              </svg>
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
                {options.map((column) => (
                  <td
                    key={column.id}
                    onClick={() =>
                      column.name != '#' ? sortBy(column.name) : null
                    }
                    className={`text-${
                      currentSort === column.name ? 'white' : 'color'
                    } cursor-pointer ${
                      column.name == '#'
                        ? 'hover:text-color'
                        : 'hover:text-white'
                    }`}
                  >
                    {column.name === 'Duration' ? (
                      <svg
                        width='20'
                        height='20'
                        strokeWidth='1.5'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        color='currentColor'
                      >
                        <path
                          d='M12 6v6h6'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        ></path>
                        <path
                          d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        ></path>
                      </svg>
                    ) : (
                      column.name
                    )}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPodcasts.map((podcast, index) => (
                <motion.tr
                  onDoubleClick={() => pausePlay(podcast)}
                  onClick={() => setPodcast(podcast)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * index }}
                  className='border-t border-b border-color hover:bg-color'
                  key={podcast.trackId}
                >
                  <td>
                    {pausedPodcasts[podcast.trackId] ? (
                      <svg
                        onClick={() => pausePlay(podcast)}
                        width='24'
                        height='24'
                        strokeWidth='1.5'
                        viewBox='0 0 24 24'
                        fill='#FFF'
                        xmlns='http://www.w3.org/2000/svg'
                        className='cursor-pointer bg-indigo-500 p-1 rounded-full hover:bg-indigo-400'
                      >
                        <title>Pause</title>
                        <path
                          d='M6 18.4V5.6a.6.6 0 01.6-.6h2.8a.6.6 0 01.6.6v12.8a.6.6 0 01-.6.6H6.6a.6.6 0 01-.6-.6zM14 18.4V5.6a.6.6 0 01.6-.6h2.8a.6.6 0 01.6.6v12.8a.6.6 0 01-.6.6h-2.8a.6.6 0 01-.6-.6z'
                          strokeWidth='1.5'
                        />
                      </svg>
                    ) : (
                      <svg
                        onClick={() => pausePlay(podcast)}
                        width='24'
                        height='24'
                        strokeWidth='1.5'
                        viewBox='0 0 24 24'
                        fill='#FFF'
                        className='bg-indigo-500 p-1 cursor-pointer rounded-full hover:bg-indigo-400'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M6.906 4.537A.6.6 0 006 5.053v13.894a.6.6 0 00.906.516l11.723-6.947a.6.6 0 000-1.032L6.906 4.537z'
                          strokeWidth='1.5'
                        ></path>
                        <title>Play</title>
                      </svg>
                    )}
                  </td>
                  <td className='flex items-center text-base '>
                    <Image
                      loading='lazy'
                      className='rounded-lg mr-4'
                      src={podcast.artworkUrl30}
                      width={45}
                      height={45}
                      alt='Cover'
                    />
                    <article>
                      <Link
                        className='text-white cursor-pointer hover:underline'
                        href={`/podcast/${podcast.trackId}`}
                      >
                        {podcast.artistName}
                      </Link>
                      <p className='text-sm'>{podcast.trackName}</p>
                    </article>
                  </td>
                  <td>{podcast.trackCensoredName}</td>
                  <td>{milisecondsToDate(true, podcast.releaseDate)}</td>
                  <td>{milisecondsToDate(false, podcast.trackTimeMillis)}</td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </>
      )}
    </>
  )
}
