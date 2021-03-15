import { FC } from 'react'
import ActionBar from '../ActionBar'
import TextEditor from '../TextEditor'
import CodeEditor from '../Cell'
import { Cell } from '../../state'
import './cell-list-item.css'

interface CellListItemProps {
  cell: Cell
}

const CellListItem: FC<CellListItemProps> = ({ cell }) => {
  return (
    <div className='cell-list-item'>
      {cell.type === 'code' ? (
        <>
          <div className='action-bar-wrapper'>
            <ActionBar cellId={cell.id} />
          </div>
          <CodeEditor cell={cell} />
        </>
      ) : (
        <>
          <TextEditor cell={cell} />
          <ActionBar cellId={cell.id} />
        </>
      )}
    </div>
  )
}

export default CellListItem
