import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const serverEnv = createEnv({
  emptyStringAsUndefined: true,

  runtimeEnv: process.env,
  server: {
    PUBLIC_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    SESSION_SECRET: z.string(),
  },
})
