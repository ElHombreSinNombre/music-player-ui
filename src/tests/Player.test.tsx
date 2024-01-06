import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import PauseIcon from '../components/Icons/Pause'
import PreviousIcon from '../components/Icons/Previous'
import PlayIcon from '../components/Icons/Play'
import NextIcon from '../components/Icons/Next'
import LoopIcon from '../components/Icons/Loop'
import VolumeIcon from '../components/Icons/Volume'
import ClockIcon from '../components/Icons/Clock'
import Player from '../components/Player'

describe('Previous icon', () => {
  test('Component is render', () => {
    const icon = render(<PreviousIcon />)
    expect(icon).toBeTruthy()
  })
})

describe('Pause icon', () => {
  test('Component is render', () => {
    const icon = render(<PauseIcon />)
    expect(icon).toBeTruthy()
  })
})

describe('Play icon', () => {
  test('Component is render', () => {
    const icon = render(<PlayIcon />)
    expect(icon).toBeTruthy()
  })
})

describe('Nexticon', () => {
  test('Component is render', () => {
    const icon = render(<NextIcon />)
    expect(icon).toBeTruthy()
  })
})

describe('Loop icon', () => {
  test('Component is render', () => {
    const icon = render(<LoopIcon />)
    expect(icon).toBeTruthy()
  })
})

describe('Volume icon', () => {
  test('Component is render', () => {
    const icon = render(<VolumeIcon />)
    expect(icon).toBeTruthy()
  })
})

describe('ClockIcon icon', () => {
  test('Component is render', () => {
    const icon = render(<ClockIcon />)
    expect(icon).toBeTruthy()
  })
})

describe('Player', () => {
  test('Component is render', () => {
    const { getByTestId } = render(<Player />)
    const player = getByTestId('player')
    expect(player).toBeTruthy()
  })
})
