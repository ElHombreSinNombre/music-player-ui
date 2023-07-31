import { combineReducers, configureStore } from '@reduxjs/toolkit'
import podcastReducer from './reducers/podcast'
import controlSlice from './slices/control'

const rootReducer = combineReducers({
  podcast: podcastReducer,
  control: controlSlice
})

const store = configureStore({
  reducer: rootReducer
})

export default store
