import { useState } from 'react'

interface TooltipProps {
  text: string
}

export function Tooltip({ text }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center hover:bg-cyan-100 hover:text-cyan-700 transition-colors"
        aria-label="Why this matters"
      >
        ?
      </button>
      {visible && (
        <span className="absolute left-6 top-0 z-10 w-56 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-lg leading-relaxed">
          {text}
        </span>
      )}
    </span>
  )
}
