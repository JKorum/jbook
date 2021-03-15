import express from 'express'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { createCellsRouter } from './routes/cells'

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  return new Promise((resolve, reject) => {
    const app = express()

    app.use(createCellsRouter(filename, dir))

    if (useProxy) {
      // in development env
      app.use(
        createProxyMiddleware({
          target: 'http://localhost:3000',
          ws: true,
          logLevel: 'silent',
        })
      )
    } else {
      // in production env
      // absolute path (because express doesn't work with synbolic links)
      const packagePath = require.resolve(
        '@jkorum-jbook/local-client/build/index.html'
      )
      // dir name
      app.use(express.static(path.dirname(packagePath)))
    }

    app.listen(port, resolve as () => void).on('error', reject)
  })
}
