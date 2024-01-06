import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Table from '../components/Table'
import tracks from './mocks/tracks'
import milisecondsToDate from '../utils/formatDate'
import trackParser from '../parsers/track'
import PauseIcon from '../components/Icons/Pause'

describe('Pause icon', () => {
  test('Component is render', () => {
    const icon = render(<PauseIcon />)
    expect(icon).toBeTruthy()
  })
})

describe('Tracks parser', () => {
  test('Parser works', () => {
    const parser = trackParser(tracks)
    expect(parser).toEqual(tracks)
  })
})

describe('Utils', () => {
  test('Miliseconds to date works', () => {
    const hasYear = milisecondsToDate({ hasYear: true, date: 0 })
    expect(hasYear).toBe('01/01/1970')
    const notHasYear = milisecondsToDate({ hasYear: false, date: 0 })
    expect(notHasYear).toBe('00:00')
  })
})

describe('Table', () => {
  test('Component is render', () => {
    const { getByTestId } = render(<Table customTracks={tracks} />)
    const table = getByTestId('table')
    expect(table).toBeTruthy()
  })
})
