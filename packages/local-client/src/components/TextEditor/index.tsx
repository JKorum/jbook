import { useState, useRef, useEffect, FC } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { useActions } from '../../hooks/use-actions'
import { Cell } from '../../state'
import './text-editor.css'

interface TextEditorProps {
  cell: Cell
}

const TextEditor: FC<TextEditorProps> = ({ cell }) => {
  const { id, content } = cell

  const { updateCell } = useActions()

  const [editing, setEditing] = useState(false)

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const listener = (evt: MouseEvent) => {
      if (
        ref.current &&
        evt.target &&
        ref.current.contains(evt.target as Node)
      ) {
        return
      }

      setEditing(false)
    }

    document.addEventListener('click', listener, { capture: true })

    return () => {
      document.removeEventListener('click', listener, { capture: true })
    }
  }, [])

  const handleChange = (value: string | undefined) => {
    updateCell(id, value ?? '')
  }

  if (editing) {
    return (
      <div ref={ref} className='text-editor'>
        <MDEditor value={content} onChange={handleChange} />
      </div>
    )
  }

  return (
    <div onClick={() => setEditing(true)} className='text-editor card'>
      <div className='card-content'>
        <MDEditor.Markdown source={content || 'Click to edit'} />
      </div>
    </div>
  )
}

export default TextEditor
