import { describe, expect, it } from 'vitest'
import { isBetterScore } from './bestScore'
import { elapsedSeconds, formatTime } from './time'

describe('isBetterScore', () => {
  it('accepts any score when there is no previous best', () => {
    expect(isBetterScore({ moves: 20, seconds: 99 }, null)).toBe(true)
  })

  it('prefers fewer moves regardless of time', () => {
    expect(isBetterScore({ moves: 8, seconds: 90 }, { moves: 9, seconds: 10 })).toBe(true)
    expect(isBetterScore({ moves: 10, seconds: 5 }, { moves: 9, seconds: 90 })).toBe(false)
  })

  it('breaks ties on moves by time', () => {
    expect(isBetterScore({ moves: 9, seconds: 30 }, { moves: 9, seconds: 31 })).toBe(true)
    expect(isBetterScore({ moves: 9, seconds: 31 }, { moves: 9, seconds: 31 })).toBe(false)
  })
})

describe('time helpers', () => {
  it('formats seconds as m:ss', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(75)).toBe('1:15')
    expect(formatTime(600)).toBe('10:00')
  })

  it('computes elapsed whole seconds', () => {
    expect(elapsedSeconds(null, null, 5000)).toBe(0)
    expect(elapsedSeconds(1000, null, 4500)).toBe(3)
    expect(elapsedSeconds(1000, 6000, 99999)).toBe(5)
  })
})
