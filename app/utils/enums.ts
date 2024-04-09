/**
 * `EmitterEvent` enum label lookup
 */
export const EmitterEvent = {
  notify: 'notify',
  newNotification: 'new-notification',
  newMedication: 'new-medication',
} as const

export type EmitterEvent = (typeof EmitterEvent)[keyof typeof EmitterEvent]
