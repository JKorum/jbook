import { useTypedSelector } from './use-typed-selector'

export const useCumulativeCode = (cellId: string): string => {
  return useTypedSelector((state) => {
    const { cells } = state

    const codeCells = cells.order
      .map((id) => cells.data[id])
      .filter((cell) => cell.type === 'code')

    const showFunc = `
      var show = (value) => {
        const previewRoot = document.querySelector('#root')
        if (!previewRoot) return

        if (typeof value === 'object' && '$$typeof' in value && 'props' in value) {
          _ReactDOM.render(value, previewRoot)
          return
        }

        if (typeof value === 'object') {
          previewRoot.innerHTML = JSON.stringify(value)
          return
        } 

        previewRoot.innerHTML = value
      }
    `

    const showFuncNoop = `
      var show = () => {};
    `

    const result = []

    result.push(`
      import _React from 'react';
      import _ReactDOM from 'react-dom';
    `)

    for (let cell of codeCells) {
      if (cell.id === cellId) {
        result.push(showFunc)
      } else {
        result.push(showFuncNoop)
      }

      result.push(cell.content)

      if (cell.id === cellId) {
        break
      }
    }

    return result.join('\n')
  })
}
