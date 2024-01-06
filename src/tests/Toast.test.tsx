import React from 'react'
import { render } from '@testing-library/react'
import Toast from '../components/Toast'
import '@testing-library/jest-dom'

describe('Toast', () => {
  it('Component is render', () => {
    const { getByTestId } = render(<Toast text='Hello' />)
    const toast = getByTestId('toast')
    expect(toast).toBeTruthy()
  })
  it('Component with custom props', () => {
    const { getByTestId } = render(
      <Toast text='Hello' backgroundColor='bg-blue-500' />
    )
    const toast = getByTestId('toast')
    expect(toast).toHaveClass('bg-blue-500')
    expect(toast).toHaveTextContent('Hello')
  })
})
