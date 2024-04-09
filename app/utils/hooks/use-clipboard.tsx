import { useCallback, useState } from 'react'

export const useClipboard = (timeoutDuration: number = 1000) => {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setError(null)
        setTimeout(() => setCopied(false), timeoutDuration)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to copy text'))
      }
    },
    [timeoutDuration],
  )

  return { copied, copyToClipboard, error }
}
