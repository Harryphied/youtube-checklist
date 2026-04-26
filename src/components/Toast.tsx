interface ToastProps {
  message: string
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm max-w-sm">
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-auto font-bold text-white hover:text-red-200">✕</button>
    </div>
  )
}
