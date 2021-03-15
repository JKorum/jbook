import { useEffect, FC } from 'react'
import { useActions } from '../../hooks/use-actions'
import Resizable from '../Resizable'
import CodeEditor from '../CodeEditor'
import Preview from '../Preview'
import { Cell } from '../../state'
import { useTypedSelector } from '../../hooks/use-typed-selector'
import { useCumulativeCode } from '../../hooks/use-cumulative-code'
import './code-cell.css'

interface CodeCellProps {
  cell: Cell
}

const CodeCell: FC<CodeCellProps> = ({ cell }) => {
  const { id, content } = cell

  const bundle = useTypedSelector((state) => state.bundles[cell.id])
  const comulativeCode = useCumulativeCode(id)
  const { createBundle, updateCell } = useActions()

  useEffect(() => {
    if (!bundle) {
      createBundle(id, comulativeCode)
      return
    }

    const timer = setTimeout(() => {
      createBundle(id, comulativeCode)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, comulativeCode, createBundle])

  const handleChange = (value: string) => {
    updateCell(id, value)
  }

  return (
    <Resizable direction='vertical'>
      <div className='code-cell'>
        <Resizable direction='horizontal'>
          <CodeEditor initialValue={content} onChange={handleChange} />
        </Resizable>
        <div className='progress-wrapper'>
          {!bundle || bundle.processing ? (
            <div className='progress-cover'>
              <progress
                className='progress is-small is-primary'
                max='100'
              ></progress>
            </div>
          ) : (
            <Preview code={bundle.code} error={bundle.error} />
          )}
        </div>
      </div>
    </Resizable>
  )
}

export default CodeCell
