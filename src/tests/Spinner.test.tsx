import React from 'react'
import { render } from '@testing-library/react'
import Spinner from '../components/Spinner'
import '@testing-library/jest-dom'

describe('Spinner', () => {
  it('Component is render', () => {
    const { getByTestId } = render(<Spinner />)
    const spinner = getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })
  it('Component with custom props', () => {
    const { getByTestId } = render(<Spinner backgroundColor='bg-blue-500' />)
    const spinner = getByTestId('spinner')
    expect(spinner).toHaveClass('bg-blue-500')
  })
})
