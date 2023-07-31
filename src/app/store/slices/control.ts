import { createSlice } from '@reduxjs/toolkit'
import { type Control } from '@/app/models/control'

// Estado en el que guardo todo los relacionado con los controles del 'player'
export const controlSlice = createSlice({
  name: 'control',
  initialState: { volume: 0, duration: 0, playing: false },
  reducers: {
    setControl: (_, action) => {
      return action.payload
    }
  }
})

export const { setControl } = controlSlice.actions
export default controlSlice.reducer

export const volume = (state: { control: Control }): number =>
  state.control.volume

export const duration = (state: { control: Control }): number =>
  state.control.duration

export const playing = (state: { control: Control }): boolean =>
  state.control.playing
