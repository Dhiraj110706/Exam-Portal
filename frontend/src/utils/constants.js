// src/utils/constants.js

// Violation Types
export const VIOLATION_TYPES = {
  TAB_SWITCH: 'tab_switch',
  FULLSCREEN_EXIT: 'fullscreen_exit',
  COPY_PASTE: 'copy_paste',
  KEYBOARD_SHORTCUT: 'keyboard_shortcut',
  FACE_NOT_DETECTED: 'face_not_detected',
  RIGHT_CLICK: 'right_click',
  DEVELOPER_TOOLS: 'developer_tools',
  PAGE_REFRESH: 'page_refresh'
}

// Violation Messages
export const VIOLATION_MESSAGES = {
  [VIOLATION_TYPES.TAB_SWITCH]: 'Tab switching or window focus lost detected',
  [VIOLATION_TYPES.FULLSCREEN_EXIT]: 'Fullscreen mode exited',
  [VIOLATION_TYPES.COPY_PASTE]: 'Copy/Paste attempt detected',
  [VIOLATION_TYPES.KEYBOARD_SHORTCUT]: 'Prohibited keyboard shortcut detected',
  [VIOLATION_TYPES.FACE_NOT_DETECTED]: 'Face not detected in camera feed',
  [VIOLATION_TYPES.RIGHT_CLICK]: 'Right-click context menu disabled',
  [VIOLATION_TYPES.DEVELOPER_TOOLS]: 'Developer tools access blocked',
  [VIOLATION_TYPES.PAGE_REFRESH]: 'Page refresh attempt blocked'
}

// Default exam settings
export const DEFAULT_EXAM_SETTINGS = {
  DURATION_MINUTES: 60,
  MAX_VIOLATIONS: 3,
  QUESTIONS_COUNT: 10
}

// Time thresholds (in seconds)
export const TIME_THRESHOLDS = {
  WARNING: 300, // 5 minutes
  CRITICAL: 60   // 1 minute
}

// Violation configuration
export const VIOLATION_CONFIG = {
  ALERT_COOLDOWN_MS: 5000,     // 5 seconds between alerts
  VIOLATION_COOLDOWN_MS: 2000,  // 2 seconds between same violation types
  FACE_CHECK_INTERVAL_MS: 20000, // Check face every 20 seconds
  FACE_DETECTION_CHANCE: 0.01    // 1% chance of face not detected
}