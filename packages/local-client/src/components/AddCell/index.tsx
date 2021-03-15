import { FC } from 'react'
import { useActions } from '../../hooks/use-actions'
import './add-cell.css'

interface AddCellProps {
  prevCellId: string | null
  forceVisible?: boolean
}

const AddCell: FC<AddCellProps> = ({ prevCellId, forceVisible }) => {
  const { insertCellAfter } = useActions()

  const handleAddCodeCell = () => {
    insertCellAfter(prevCellId, 'code')
  }

  const handleAddTextCell = () => {
    insertCellAfter(prevCellId, 'text')
  }

  return (
    <div className={`add-cell ${forceVisible ? 'force-visible' : ''}`}>
      <div className='add-cell-buttons'>
        <button
          className='button is-rounded is-primary is-small'
          onClick={handleAddCodeCell}
        >
          <span className='icon-is-small'>
            <i className='fas fa-plus' />
          </span>
          <span className='add-cell-button-text'>Code</span>
        </button>
        <button
          className='button is-rounded is-primary is-small'
          onClick={handleAddTextCell}
        >
          <span className='icon-is-small'>
            <i className='fas fa-plus' />
          </span>
          <span className='add-cell-button-text'>Text</span>
        </button>
      </div>
      <div className='add-cell-divider'></div>
    </div>
  )
}

export default AddCell
