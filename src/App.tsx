import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { useChecklist } from './hooks/useChecklist'
import { ProgressBar } from './components/ProgressBar'
import { StageSection } from './components/StageSection'
import { Toast } from './components/Toast'

export default function App() {
  const { video, currentStage, isComplete, saveError, startVideo, resetVideo, toggleTask, clearSaveError } = useChecklist()
  const [titleInput, setTitleInput] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const confettiFired = useRef(false)

  useEffect(() => {
    if (isComplete && !confettiFired.current) {
      confettiFired.current = true
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
    }
    if (!isComplete) {
      confettiFired.current = false
    }
  }, [isComplete])

  function handleStart(e: React.FormEvent) {
    e.preventDefault()
    const t = titleInput.trim()
    if (!t) return
    startVideo(t)
    setTitleInput('')
  }

  function handleNewVideo() {
    setShowConfirm(true)
  }

  function confirmReset() {
    resetVideo()
    setShowConfirm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎬</span>
            <span className="font-bold text-gray-900 text-sm">Creator Checklist</span>
          </div>
          {video && (
            <button
              onClick={handleNewVideo}
              className="text-xs font-medium text-cyan-600 hover:text-cyan-800 border border-cyan-200 hover:border-cyan-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              + New video
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Empty state */}
        {!video && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-5xl mb-4">🎬</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Start your first video</h1>
            <p className="text-gray-500 text-sm mb-8 max-w-xs">
              A step-by-step production checklist from idea to post-publish. No setup. Just check boxes.
            </p>
            <form onSubmit={handleStart} className="w-full max-w-sm flex flex-col gap-3">
              <input
                type="text"
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                placeholder="Working title for your video..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                disabled={!titleInput.trim()}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
              >
                Let's go →
              </button>
            </form>
          </div>
        )}

        {/* In-progress / Complete state */}
        {video && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 truncate">{video.title}</h2>
            </div>

            <ProgressBar currentStage={currentStage} isComplete={isComplete} />

            {isComplete && (
              <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-xl text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-bold text-green-800 text-sm">Video complete! Time to hit publish.</p>
                <button
                  onClick={handleNewVideo}
                  className="mt-3 text-xs font-medium text-green-700 underline hover:text-green-900"
                >
                  Start a new video
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {video.stages.map(stage => (
                <StageSection
                  key={stage.id}
                  stage={stage}
                  isActive={stage.id === currentStage && !isComplete}
                  onToggle={toggleTask}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Confirm reset dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <p className="font-semibold text-gray-900 mb-2">Start a new video?</p>
            <p className="text-sm text-gray-500 mb-6">Your current progress will be cleared.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 bg-cyan-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-cyan-700 transition-colors"
              >
                Yes, start fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save error toast */}
      {saveError && <Toast message={saveError} onDismiss={clearSaveError} />}
    </div>
  )
}
