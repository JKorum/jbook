import { Fragment, FC, useEffect } from 'react'
import { useTypedSelector } from '../../hooks/use-typed-selector'
import { useActions } from '../../hooks/use-actions'
import CellListItem from '../CellListItem'
import AddCell from '../AddCell'
import './cell-list.css'

const CellList: FC = () => {
  const cells = useTypedSelector(({ cells }) => {
    return cells.order.map((id) => cells.data[id])
  })

  const { fetchCells } = useActions()

  useEffect(() => {
    fetchCells()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='cell-list'>
      <AddCell prevCellId={null} forceVisible={cells.length === 0} />
      {cells.map((cell) => (
        <Fragment key={cell.id}>
          <CellListItem cell={cell} />
          <AddCell prevCellId={cell.id} />
        </Fragment>
      ))}
    </div>
  )
}

export default CellList
