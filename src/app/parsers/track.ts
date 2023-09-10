import { type Track } from '../models/track'

const trackParser = (tracks: Track[]) => {
  const trackbyName = tracks.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  return trackbyName.map((trackData: Track) => {
    const track: Track = {
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
    return track
  })
}

export default trackParser
