import express, { Router } from 'express'
import path from 'path'
import { promises } from 'fs'

interface Cell {
  id: string
  content: string
  type: 'code' | 'text'
}

export const createCellsRouter = (filename: string, dir: string): Router => {
  const router = express.Router()

  router.use(express.json())

  const fullPath = path.join(dir, filename)

  router.get('/cells', async (req, res) => {
    try {
      const result = await promises.readFile(fullPath, { encoding: 'utf-8' })
      res.send(JSON.parse(result))
    } catch (err) {
      if (err.code === 'ENOENT') {
        await promises.writeFile(fullPath, '[]', 'utf-8')
        res.send([])
      } else {
        throw err
      }
    }
  })

  router.post('/cells', async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body

    await promises.writeFile(fullPath, JSON.stringify(cells), 'utf-8')

    res.send({ status: 'ok' })
  })

  return router
}
