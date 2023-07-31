import { type Podcast } from '../models/podcast'
import podcastParser from '../parsers/podcast'

// Endpoint para buscar podcast por nombre
export const searchPodcastByName = async (name: string): Promise<Podcast[]> => {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${name}&media=podcast&limit=10`
  )
  if (res.status === 200) {
    const data = await res.json()
    if (!data) {
      throw new Error('No data was received.')
    }
    return podcastParser(data.results)
  } else {
    throw new Error('Failed to fetch podcast')
  }
}

// Endpoint para buscar por id
export const searchPodcastById = async (id: number): Promise<Podcast[]> => {
  const res = await fetch(
    `https://itunes.apple.com/lookup?id=${id}&media=podcast`
  )
  if (res.status === 200) {
    const data = await res.json()
    if (!data) {
      throw new Error('No data was received.')
    }
    return podcastParser(data.results)
  } else {
    throw new Error('Failed to fetch podcast')
  }
}
