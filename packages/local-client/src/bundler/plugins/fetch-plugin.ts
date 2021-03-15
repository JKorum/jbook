import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import localForage from 'localforage'

const filesCache = localForage.createInstance({
  name: 'filesCache',
})

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ }, async () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        }
      })

      build.onLoad({ filter: /.*/ }, async (args) => {
        // retrieving cached result for URL
        const cachedResult = await filesCache.getItem<esbuild.OnLoadResult>(
          args.path
        )

        if (cachedResult) {
          return cachedResult
        }
        //if no cached result - proceed to next onLoad
      })

      build.onLoad({ filter: /.css$/ }, async (args) => {
        const response = await axios.get(args.path)

        const escapedData = response.data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: `
            var style = document.createElement('style');
            style.innerText = '${escapedData}';
            document.head.appendChild(style);
          `,
          // getting directory where the file was found
          resolveDir: new URL('./', response.request.responseURL).pathname,
        }

        // saving files content into cache
        await filesCache.setItem(args.path, result)

        return result
      })

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const response = await axios.get(args.path)

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: response.data,
          // getting directory where the file was found
          resolveDir: new URL('./', response.request.responseURL).pathname,
        }

        // saving files content into cache
        await filesCache.setItem(args.path, result)

        return result
      })
    },
  }
}
