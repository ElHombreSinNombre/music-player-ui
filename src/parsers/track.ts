import { Track } from '../types/track'

const trackParser = (tracks: Track[]) => {
  const trackbyName = tracks.map((trackData: Track) => {
    return {
      id: trackData.id,
      name: trackData.name,
      is_playing: false,
      preview_url: trackData.preview_url,
      duration_ms: trackData.duration_ms,
      artists: trackData.artists,
      album: {
        name: trackData.album.name,
        release_date: trackData.album.release_date,
        images: trackData.album.images
      }
    }
  })

  return trackbyName.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

export default trackParser
