import { useState, useEffect } from 'react'
import { TaskItem } from './TaskItem'
import type { Stage } from '../hooks/useChecklist'

interface StageSectionProps {
  stage: Stage
  isActive: boolean
  onToggle: (stageId: number, taskId: string) => void
}

export function StageSection({ stage, isActive, onToggle }: StageSectionProps) {
  const [open, setOpen] = useState(isActive)
  const checkedCount = stage.tasks.filter(t => t.checked).length
  const total = stage.tasks.length
  const allDone = checkedCount === total

  useEffect(() => {
    if (isActive) setOpen(true)
  }, [isActive])

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${allDone ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${allDone ? 'bg-green-500 text-white' : isActive ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {allDone ? '✓' : stage.id}
          </span>
          <span className={`font-medium text-sm ${allDone ? 'text-green-700' : 'text-gray-800'}`}>
            {stage.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{checkedCount}/{total}</span>
          <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-2 pb-2 border-t border-gray-100">
          {stage.tasks.map(task => (
            <TaskItem
              key={task.id}
              id={task.id}
              label={task.label}
              tooltip={task.tooltip}
              checked={task.checked}
              onToggle={() => onToggle(stage.id, task.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
