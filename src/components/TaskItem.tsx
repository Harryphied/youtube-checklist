import { Tooltip } from './Tooltip'

interface TaskItemProps {
  id: string
  label: string
  tooltip: string
  checked: boolean
  onToggle: () => void
}

export function TaskItem({ id, label, tooltip, checked, onToggle }: TaskItemProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer shrink-0"
      />
      <span className={`text-sm flex items-center gap-0.5 ${checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        {label}
        <Tooltip text={tooltip} />
      </span>
    </label>
  )
}
