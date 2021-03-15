import path from 'path'
import { Command } from 'commander'
import { serve } from '@jkorum-jbook/local-api'

const isProduction = process.env.NODE_ENV === 'production'

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    const dir = path.join(process.cwd(), path.dirname(filename))
    const file = path.basename(filename)
    try {
      await serve(parseInt(options.port, 10), file, dir, !isProduction)
      console.log(
        `Opened ${filename}. Navigate to http://0.0.0.0:${options.port} to start editing.`
      )
    } catch (err) {
      console.log(err.message)
      process.exit(1)
    }
  })
