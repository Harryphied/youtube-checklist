// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { deriveCurrentStage, useChecklist } from './useChecklist'
import { STAGES } from '../data/stages'
import type { Stage } from './useChecklist'

// ── helpers ──────────────────────────────────────────────────────────────────

function makeStages(overrides: Record<string, boolean> = {}): Stage[] {
  return STAGES.map(s => ({
    id: s.id,
    name: s.name,
    tasks: s.tasks.map(t => ({ ...t, checked: overrides[t.id] ?? false })),
  }))
}

function allChecked(): Stage[] {
  return STAGES.map(s => ({
    id: s.id,
    name: s.name,
    tasks: s.tasks.map(t => ({ ...t, checked: true })),
  }))
}

// ── deriveCurrentStage ───────────────────────────────────────────────────────

describe('deriveCurrentStage', () => {
  it('returns 1 when nothing is checked', () => {
    expect(deriveCurrentStage(makeStages())).toBe(1)
  })

  it('stays on stage 1 when only some tasks in stage 1 are checked', () => {
    expect(deriveCurrentStage(makeStages({ '1-1': true }))).toBe(1)
  })

  it('advances to stage 2 when all stage-1 tasks are checked', () => {
    expect(deriveCurrentStage(makeStages({ '1-1': true, '1-2': true, '1-3': true }))).toBe(2)
  })

  it('returns 9 when all stages except last are complete', () => {
    const overrides: Record<string, boolean> = {}
    STAGES.slice(0, 8).forEach(s => s.tasks.forEach(t => { overrides[t.id] = true }))
    expect(deriveCurrentStage(makeStages(overrides))).toBe(9)
  })

  it('returns 9 when all tasks are checked', () => {
    expect(deriveCurrentStage(allChecked())).toBe(9)
  })

  it('does not retreat when a task in an earlier stage is unchecked', () => {
    const overrides: Record<string, boolean> = {}
    STAGES.slice(0, 3).forEach(s => s.tasks.forEach(t => { overrides[t.id] = true }))
    const stages = makeStages(overrides)
    stages[1].tasks[0].checked = false
    expect(deriveCurrentStage(stages)).toBe(2)
  })
})

// ── localStorage integration ─────────────────────────────────────────────────

describe('localStorage integration', () => {
  beforeEach(() => { localStorage.clear() })
  afterEach(() => { vi.restoreAllMocks() })

  it('video is null on first load with empty localStorage', () => {
    const { result } = renderHook(() => useChecklist())
    expect(result.current.video).toBeNull()
  })

  it('stores valid JSON at the correct key after startVideo', () => {
    const { result } = renderHook(() => useChecklist())
    act(() => { result.current.startVideo('My test video') })
    const raw = localStorage.getItem('ytcl_video')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed.title).toBe('My test video')
    expect(parsed.schemaVersion).toBe(1)
    expect(parsed.stages).toHaveLength(9)
  })

  it('persists checked state after toggleTask', () => {
    const { result } = renderHook(() => useChecklist())
    act(() => { result.current.startVideo('Persist test') })
    act(() => { result.current.toggleTask(1, '1-1') })
    const parsed = JSON.parse(localStorage.getItem('ytcl_video')!)
    const task = parsed.stages[0].tasks.find((t: { id: string }) => t.id === '1-1')
    expect(task.checked).toBe(true)
  })

  it('clears localStorage after resetVideo', () => {
    const { result } = renderHook(() => useChecklist())
    act(() => { result.current.startVideo('Reset test') })
    act(() => { result.current.resetVideo() })
    expect(localStorage.getItem('ytcl_video')).toBeNull()
    expect(result.current.video).toBeNull()
  })

  it('returns null video when localStorage contains corrupt JSON', () => {
    localStorage.setItem('ytcl_video', 'NOT_JSON{{{')
    const { result } = renderHook(() => useChecklist())
    expect(result.current.video).toBeNull()
  })

  it('surfaces a saveError when localStorage quota is exceeded', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      const err = new DOMException('QuotaExceededError')
      Object.defineProperty(err, 'name', { value: 'QuotaExceededError' })
      throw err
    })
    const { result } = renderHook(() => useChecklist())
    act(() => { result.current.startVideo('Quota test') })
    expect(result.current.saveError).toMatch(/save/i)
  })
})

// ── isComplete ───────────────────────────────────────────────────────────────

// ── migrate ──────────────────────────────────────────────────────────────────

describe('migrate', () => {
  beforeEach(() => { localStorage.clear() })

  it('fills missing stages when loading old data without a stage', () => {
    const oldData = {
      schemaVersion: 0,
      title: 'Old video',
      createdAt: '2026-01-01T00:00:00Z',
      stages: [{ id: 1, name: 'Idea', tasks: [{ id: '1-1', label: 'Topic chosen', tooltip: '', checked: true }] }],
    }
    localStorage.setItem('ytcl_video', JSON.stringify(oldData))
    const { result } = renderHook(() => useChecklist())
    expect(result.current.video?.stages).toHaveLength(9)
    expect(result.current.video?.stages[0].tasks[0].checked).toBe(true)
  })

  it('fills missing tasks within an existing stage', () => {
    const oldData = {
      schemaVersion: 0,
      title: 'Old video',
      createdAt: '2026-01-01T00:00:00Z',
      stages: STAGES.map((s, i) => ({
        id: s.id, name: s.name,
        tasks: i === 0 ? [{ id: '1-1', label: 'Topic chosen', tooltip: '', checked: true }] : s.tasks.map(t => ({ ...t, checked: false })),
      })),
    }
    localStorage.setItem('ytcl_video', JSON.stringify(oldData))
    const { result } = renderHook(() => useChecklist())
    const stage1 = result.current.video?.stages[0]!
    expect(stage1.tasks.length).toBe(3)
    expect(stage1.tasks[0].checked).toBe(true)
    expect(stage1.tasks[1].checked).toBe(false)
  })
})

// ── edge cases ────────────────────────────────────────────────────────────────

describe('edge cases', () => {
  beforeEach(() => { localStorage.clear(); vi.restoreAllMocks() })

  it('clearSaveError resets saveError to null', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      const err = new DOMException('QuotaExceededError')
      Object.defineProperty(err, 'name', { value: 'QuotaExceededError' })
      throw err
    })
    const { result } = renderHook(() => useChecklist())
    act(() => { result.current.startVideo('Error test') })
    expect(result.current.saveError).not.toBeNull()
    act(() => { result.current.clearSaveError() })
    expect(result.current.saveError).toBeNull()
  })

  it('toggleTask is a no-op when video is null', () => {
    const { result } = renderHook(() => useChecklist())
    expect(result.current.video).toBeNull()
    act(() => { result.current.toggleTask(1, '1-1') })
    expect(result.current.video).toBeNull()
  })

  it('currentStage defaults to 1 when video is null', () => {
    const { result } = renderHook(() => useChecklist())
    expect(result.current.currentStage).toBe(1)
  })

  it('resetVideo clears saveError', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      const err = new DOMException('QuotaExceededError')
      Object.defineProperty(err, 'name', { value: 'QuotaExceededError' })
      throw err
    })
    const { result } = renderHook(() => useChecklist())
    act(() => { result.current.startVideo('Test') })
    expect(result.current.saveError).not.toBeNull()
    vi.restoreAllMocks()
    act(() => { result.current.resetVideo() })
    expect(result.current.saveError).toBeNull()
    expect(result.current.video).toBeNull()
  })
})

describe('isComplete', () => {
  beforeEach(() => { localStorage.clear() })

  it('is false when nothing is checked', () => {
    const { result } = renderHook(() => useChecklist())
    act(() => { result.current.startVideo('Not done') })
    expect(result.current.isComplete).toBe(false)
  })

  it('is true when all tasks are checked', () => {
    const { result } = renderHook(() => useChecklist())
    act(() => { result.current.startVideo('All done') })
    act(() => {
      STAGES.forEach(s => s.tasks.forEach(t => {
        result.current.toggleTask(s.id, t.id)
      }))
    })
    expect(result.current.isComplete).toBe(true)
  })
})
