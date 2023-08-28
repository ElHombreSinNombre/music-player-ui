import { create } from 'zustand'
import { Track } from '@/app/models/track'
import { searchTrackByArtistId, searchTrackByName } from '../endpoints/track'

interface State {
  track: Track | null
  tracks: Track[] | null
  setTracks: (tracks: Track[] | null) => void
  setTrack: (track: Track | null) => void
  changePlaying: (playing: boolean) => void
  fetchTracks: ({
    name,
    offset
  }: {
    name: string
    offset: number
  }) => Promise<void>
  fetchSongsById: ({
    name,
    id
  }: {
    name: string
    id: string
  }) => Promise<Track[]>
}

export const useStore = create<State>((set, get) => ({
  track: null,
  tracks: null,
  setTrack: (track) => {
    set({ track })
  },
  setTracks: (tracks) => {
    set({ tracks })
  },
  changePlaying: (playing) => {
    const { track } = get()
    const { tracks } = get()
    if (tracks) {
      const needsUpdate = Object.values(tracks).some(
        (track) => track.is_playing !== false
      )
      if (needsUpdate) {
        const updatedTracks = tracks.map((track) => ({
          ...track,
          is_playing: false
        }))
        set({ tracks: updatedTracks })
      }
    }
    if (track) {
      const updatedTrack = { ...track, is_playing: playing }
      set({ track: updatedTrack })
    }
  },
  fetchTracks: async ({
    name,
    offset,
    limit
  }: {
    name: string
    offset: number
    limit: number
  }) => {
    await searchTrackByName({ name, offset, limit }).then((data: Track[]) => {
      set((prev) => ({
        tracks: prev.tracks
          ? offset === 0
            ? data
            : [...prev.tracks, ...data]
          : data
      }))
    })
  },
  fetchSongsById: async ({ name, id }: { name: string; id: string }) => {
    const data = await searchTrackByArtistId({ name, id })
    return data
  }
}))
