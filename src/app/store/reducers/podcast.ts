import { createReducer, createAction } from '@reduxjs/toolkit'
import { Podcast } from '../../models/podcast'

// Estado en el que guardo el podcast seleccionado
const initialState: Podcast | null = null

const podcast = createAction<Podcast>('podcast/selectedPodcast')

const podcastReducer = createReducer<Podcast | null>(
  initialState,
  (builder) => {
    builder.addCase(podcast, (_, action) => {
      return action.payload
    })
  }
)

export { podcast }

export default podcastReducer
