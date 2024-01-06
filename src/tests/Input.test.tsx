import React from 'react'
import { render } from '@testing-library/react'
import Input from '../components/Input'
import SearchIcon from '../components/Icons/Search'
import '@testing-library/jest-dom'

describe('Search icon', () => {
  test('Component is render', () => {
    const icon = render(<SearchIcon />)
    expect(icon).toBeTruthy()
  })
})

describe('Input', () => {
  it('Component is render', () => {
    const { getByTestId } = render(<Input />)
    const input = getByTestId('input')
    expect(input).toBeTruthy()
  })
  it('Component with all props', () => {
    const handleClick = jest.fn()
    const change = (value: string | number) => {
      if (handleClick != null) handleClick(value)
    }
    const { getByTestId } = render(
      <Input
        name='Test'
        title='Test'
        type='range'
        value={1}
        step={1}
        max={10}
        min={1}
        placeholder='Test'
        onChange={change}
      />
    )
    const input = getByTestId('input')
    expect(input).toHaveAttribute('name', 'Test')
    expect(input).toHaveAttribute('title', 'Test')
    expect(input).toHaveAttribute('type', 'range')
    expect(input).toHaveAttribute('value', '1')
    expect(input).toHaveAttribute('step', '1')
    expect(input).toHaveAttribute('max', '10')
    expect(input).toHaveAttribute('min', '1')
    expect(input).toHaveAttribute('placeholder', 'Test')
    change('Test')
    expect(handleClick).toBeCalledWith('Test')
  })
})
