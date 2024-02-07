import { create } from 'zustand'
import { Track } from '../types/track'
import { searchTrackByArtistId, searchTrackByName } from '../endpoints/track'

interface State {
  track: Track | null
  tracks: Track[] | null
  setTracks: (tracks: Track[] | null) => void
  setTrack: (track: Track | null) => void
  changePlaying: () => void
  fetchTracks: ({
    name,
    more,
    limit
  }: {
    name: string
    more?: boolean
    limit?: number
  }) => Promise<void>
  fetchSongsById: ({
    name,
    id
  }: {
    name?: string
    id?: string
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
  changePlaying: () => {
    const { track } = get()
    const { tracks } = get()
    if (tracks && track) {
      const updatedTracks = tracks.map((allTracks) => {
        if (allTracks.id !== track.id) {
          return { ...allTracks, is_playing: false }
        } else {
          return { ...allTracks, is_playing: !track.is_playing }
        }
      })
      set(() => ({
        tracks: updatedTracks
      }))
      const updateTrack = { ...track, is_playing: !track.is_playing }
      set(() => ({
        track: updateTrack
      }))
    }
  },
  fetchTracks: async ({
    name,
    more,
    limit
  }: {
    name: string
    more?: boolean
    limit?: number
  }) => {
    await searchTrackByName({ name, more, limit }).then((tracks: Track[]) => {
      set({ tracks })
    })
  },
  fetchSongsById: async ({ name, id }: { name?: string; id?: string }) => {
    return await searchTrackByArtistId({ name, id })
  }
}))
