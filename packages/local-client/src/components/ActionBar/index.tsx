import { FC } from 'react'
import { useActions } from '../../hooks/use-actions'
import './action-bar.css'

interface ActionBarProps {
  cellId: string
}

const ActionBar: FC<ActionBarProps> = ({ cellId }) => {
  const { moveCell, deleteCell } = useActions()

  const handleMoveUp = () => {
    moveCell(cellId, 'up')
  }

  const handleMoveDown = () => {
    moveCell(cellId, 'down')
  }

  const handleDelete = () => {
    deleteCell(cellId)
  }

  return (
    <div className='action-bar'>
      <button className='button is-primary is-small' onClick={handleMoveUp}>
        <span className='icon'>
          <i className='fas fa-arrow-up'></i>
        </span>
      </button>
      <button className='button is-primary is-small' onClick={handleMoveDown}>
        <span className='icon'>
          <i className='fas fa-arrow-down'></i>
        </span>
      </button>
      <button className='button is-primary is-small' onClick={handleDelete}>
        <span className='icon'>
          <i className='fas fa-times'></i>
        </span>
      </button>
    </div>
  )
}

export default ActionBar
