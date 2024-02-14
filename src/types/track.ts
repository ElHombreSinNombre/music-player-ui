export type Track = {
  id: number
  name: string
  is_playing: boolean
  duration_ms: number
  preview_url: string
  artists: Array<{ name: string; id: string }>
  album: {
    name: string
    release_date: number
    images: Array<{
      url: string
    }>
  }
}
