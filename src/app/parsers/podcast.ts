import { type Podcast } from '../models/podcast'

//Cogemos de endpoint solo los valores que necesitemos
const podcastParser = (data: Podcast[]) => {
  return data.map((podcastData: Podcast) => {
    const podcast: Podcast = {
      trackId: podcastData.trackId,
      artistName: podcastData.artistName,
      artworkUrl30: podcastData.artworkUrl30,
      artworkUrl100: podcastData.artworkUrl100,
      trackName: podcastData.trackName,
      trackTimeMillis: podcastData.trackTimeMillis,
      releaseDate: podcastData.releaseDate,
      trackCensoredName: podcastData.trackCensoredName
    }
    return podcast
  })
}

export default podcastParser
