import {
  type AppLoadContext,
  type EntryContext,
  type HandleDataRequestFunction,
  createReadableStreamFromReadable,
} from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { isbot } from 'isbot'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'

import { NonceProvider } from '~/utils/nonce-provider'

const ABORT_DELAY = 10_000

export let handleDataRequest: HandleDataRequestFunction = async (
  response: Response,
  { request },
) => {
  let isGet = request.method.toLowerCase() === 'get'
  let purpose =
    request.headers.get('Purpose') ||
    request.headers.get('X-Purpose') ||
    request.headers.get('Sec-Purpose') ||
    request.headers.get('Sec-Fetch-Purpose') ||
    request.headers.get('Moz-Purpose')
  let isPrefetch = purpose === 'prefetch'

  // If it's a GET request and it's a prefetch request and it doesn't have a Cache-Control header
  if (isGet && isPrefetch && !response.headers.has('Cache-Control')) {
    // we will cache for 5 seconds only on the browser
    response.headers.set('Cache-Control', 'private, max-age=5')
  }

  return response
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  return isbot(request.headers.get('user-agent') ?? '')
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
        loadContext,
      )
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const { abort, pipe } = renderToPipeableStream(
      <RemixServer
        abortDelay={ABORT_DELAY}
        context={remixContext}
        url={request.url}
      />,
      {
        onAllReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )

          pipe(body)
        },
        onError(error: unknown) {
          responseStatusCode = 500
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error)
          }
        },
        onShellError(error: unknown) {
          reject(error)
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const nonce = String(loadContext.cspNonce) ?? undefined
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const { abort, pipe } = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <RemixServer
          abortDelay={ABORT_DELAY}
          context={remixContext}
          url={request.url}
        />
      </NonceProvider>,
      {
        onError(error: unknown) {
          responseStatusCode = 500
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error)
          }
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onShellReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )

          pipe(body)
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
