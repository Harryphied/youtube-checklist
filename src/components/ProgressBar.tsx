import { STAGES } from '../data/stages'

interface ProgressBarProps {
  currentStage: number
  isComplete: boolean
}

export function ProgressBar({ currentStage, isComplete }: ProgressBarProps) {
  const total = STAGES.length
  const pct = isComplete ? 100 : Math.round(((currentStage - 1) / total) * 100)
  const stageName = isComplete ? 'Complete!' : STAGES[currentStage - 1]?.name ?? ''

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          {isComplete ? 'All done!' : `Stage ${currentStage} of ${total} — ${stageName}`}
        </span>
        <span className="text-sm font-bold text-cyan-600">{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-cyan-600'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
