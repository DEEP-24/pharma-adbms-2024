import { vitePlugin as remix } from '@remix-run/dev'
import morgan from 'morgan'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig, type ViteDevServer } from 'vite'
import { remixRoutes } from 'remix-routes/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: { manifest: true },
  plugins: [
    morganPlugin(),
    tsconfigPaths(),
    remix({
      ignoredRouteFiles: ['**/*'],
      serverModuleFormat: 'esm',
      routes: async defineRoutes => {
        return flatRoutes('routes', defineRoutes, {
          ignoredRouteFiles: ['**/*.test.{js,jsx,ts,tsx}', '**/__*.*'],
        })
      },
    }),
    remixRoutes({
      outDir: '.',
    }),
  ],
})

function morganPlugin() {
  return {
    name: 'morgan-plugin',
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(morgan('tiny'))
      }
    },
  }
}
