import { useRef, useEffect, FC } from 'react'
import './preview.css'

interface PreviewProps {
  code: string
  error: string
}

const html = `
  <html>
    <head>
      <style>
        html {
          background-color: #fff;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        function handleError(err) {
          document.querySelector('#root').innerHTML = \`
              <div style="color:red;">
                <h1>Runtime Error</h1>
                <p>\${err}<p>
              </div>
            \`
          console.error(err)
        }

        window.addEventListener('error', (evt) => {
          evt.preventDefault()
          handleError(evt.error)
        })

        window.addEventListener('message', (evt) => {
          try {
            eval(evt.data)
          } catch (err) {
            handleError(err)
          }
          
        })
      </script>
    </body>
  <html>
`

const Preview: FC<PreviewProps> = ({ code, error }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const { current: iframe } = iframeRef
    if (!iframe || !iframe.contentWindow) return
    iframe.srcdoc = html

    setTimeout(() => {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(code, '*')
      }
    }, 50)
  }, [code])

  return (
    <div className='preview-wrapper'>
      <iframe ref={iframeRef} title='1' sandbox='allow-scripts' srcDoc={html} />
      {error && <div className='bundle-error'>{error}</div>}
    </div>
  )
}

export default Preview
