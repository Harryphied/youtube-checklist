# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0.0] - 2026-04-26

### Added

- 9-stage YouTube production checklist — Idea, Research, Script, Filming, Editing, Thumbnail, SEO, Upload, Post-publish — each with opinionated sub-tasks
- Zero-setup flow: enter a video title, start checking boxes immediately
- Stage auto-advance: completing the last task in a stage opens the next stage automatically
- Progress bar showing current stage and percentage complete
- Tooltip per task explaining why each step matters
- localStorage persistence: progress survives page refresh without an account
- Schema migration: v0 data is automatically upgraded to v1 on load
- Confetti animation on completing all 9 stages
- "New video" button with confirmation dialog to reset state
- Toast notification when localStorage quota is exceeded
- 20 Vitest unit tests covering all state logic paths
