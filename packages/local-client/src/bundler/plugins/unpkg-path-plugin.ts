import * as esbuild from 'esbuild-wasm'

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // resolving an entry point file
      build.onResolve({ filter: /^index\.js$/ }, () => {
        return { path: 'index.js', namespace: 'a' }
      })
      // resolving relative paths in package files on CDN
      build.onResolve({ filter: /\.+\// }, (args) => {
        return {
          path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
          namespace: 'a',
        }
      })
      // resolving a package on CDN
      build.onResolve({ filter: /.*/ }, async (args) => {
        return { path: `https://unpkg.com/${args.path}`, namespace: 'a' }
      })
    },
  }
}
