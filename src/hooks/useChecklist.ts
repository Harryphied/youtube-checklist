import { useState, useEffect, useCallback } from 'react'
import { STAGES } from '../data/stages'

const STORAGE_KEY = 'ytcl_video'
const SCHEMA_VERSION = 1

export interface Task {
  id: string
  label: string
  tooltip: string
  checked: boolean
}

export interface Stage {
  id: number
  name: string
  tasks: Task[]
}

export interface VideoState {
  schemaVersion: number
  title: string
  createdAt: string
  stages: Stage[]
}

export interface ChecklistHook {
  video: VideoState | null
  currentStage: number
  isComplete: boolean
  saveError: string | null
  startVideo: (title: string) => void
  resetVideo: () => void
  toggleTask: (stageId: number, taskId: string) => void
  clearSaveError: () => void
}

function buildDefaultStages(): Stage[] {
  return STAGES.map(s => ({
    id: s.id,
    name: s.name,
    tasks: s.tasks.map(t => ({ ...t, checked: false })),
  }))
}

function migrate(data: VideoState): VideoState {
  if (data.schemaVersion >= SCHEMA_VERSION) return data

  // v0 → v1: fill any missing tasks from STAGES definition
  const migrated: VideoState = { ...data, schemaVersion: SCHEMA_VERSION }
  migrated.stages = STAGES.map(stageDef => {
    const existing = data.stages.find(s => s.id === stageDef.id)
    if (!existing) {
      return { id: stageDef.id, name: stageDef.name, tasks: stageDef.tasks.map(t => ({ ...t, checked: false })) }
    }
    return {
      ...existing,
      tasks: stageDef.tasks.map(taskDef => {
        const existingTask = existing.tasks.find(t => t.id === taskDef.id)
        return existingTask ?? { ...taskDef, checked: false }
      }),
    }
  })
  return migrated
}

export function deriveCurrentStage(stages: Stage[]): number {
  for (let i = 0; i < stages.length; i++) {
    if (stages[i].tasks.some(t => !t.checked)) return i + 1
  }
  return stages.length
}

function loadFromStorage(): VideoState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as VideoState
    return migrate(parsed)
  } catch {
    return null
  }
}

function saveToStorage(video: VideoState): string | null {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(video))
    return null
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      return "Couldn't save progress — try clearing your browser storage."
    }
    return 'Failed to save progress.'
  }
}

export function useChecklist(): ChecklistHook {
  const [video, setVideo] = useState<VideoState | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const loaded = loadFromStorage()
    if (loaded) setVideo(loaded)
  }, [])

  const startVideo = useCallback((title: string) => {
    const newVideo: VideoState = {
      schemaVersion: SCHEMA_VERSION,
      title,
      createdAt: new Date().toISOString(),
      stages: buildDefaultStages(),
    }
    const err = saveToStorage(newVideo)
    if (err) setSaveError(err)
    setVideo(newVideo)
  }, [])

  const resetVideo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setVideo(null)
    setSaveError(null)
  }, [])

  const toggleTask = useCallback((stageId: number, taskId: string) => {
    setVideo(prev => {
      if (!prev) return prev
      const updated: VideoState = {
        ...prev,
        stages: prev.stages.map(s =>
          s.id !== stageId ? s : {
            ...s,
            tasks: s.tasks.map(t => t.id !== taskId ? t : { ...t, checked: !t.checked }),
          }
        ),
      }
      const err = saveToStorage(updated)
      if (err) setSaveError(err)
      return updated
    })
  }, [])

  const clearSaveError = useCallback(() => setSaveError(null), [])

  const currentStage = video ? deriveCurrentStage(video.stages) : 1
  const isComplete = video ? video.stages.every(s => s.tasks.every(t => t.checked)) : false

  return { video, currentStage, isComplete, saveError, startVideo, resetVideo, toggleTask, clearSaveError }
}
