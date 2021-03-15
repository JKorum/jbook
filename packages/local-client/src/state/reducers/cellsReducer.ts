import produce from 'immer'
import { v4 as uuid } from 'uuid'
import { Action } from '../actions'
import { ActionType } from '../action-types'
import { Cell } from '../cell'

interface CellsState {
  loading: boolean
  error: string | null
  order: string[]
  data: {
    [key: string]: Cell
  }
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
}

const reducer = produce(
  (draft: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.SAVE_CELLS_ERROR: {
        draft.error = action.payload
        break
      }
      case ActionType.FETCH_CELLS: {
        draft.loading = true
        draft.error = null
        break
      }
      case ActionType.FETCH_CELLS_COMPLETE: {
        draft.loading = false
        draft.error = null
        draft.order = action.payload.map((cell) => cell.id)
        draft.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell
          return acc
        }, {} as CellsState['data'])
        break
      }
      case ActionType.FETCH_CELLS_ERROR: {
        draft.loading = false
        draft.error = action.payload
        break
      }
      case ActionType.UPDATE_CELL: {
        const { id, content } = action.payload
        draft.data[id].content = content
        break
      }
      case ActionType.DELETE_CELL: {
        delete draft.data[action.payload]
        draft.order = draft.order.filter((id) => id !== action.payload)
        break
      }
      case ActionType.MOVE_CELL: {
        const { id, direction } = action.payload

        const idx = draft.order.findIndex((cellId) => cellId === id)
        if (idx === -1) break

        const targetIdx = direction === 'up' ? idx - 1 : idx + 1
        if (targetIdx < 0 || targetIdx > draft.order.length - 1) break

        draft.order[idx] = draft.order[targetIdx]
        draft.order[targetIdx] = id
        break
      }
      case ActionType.INSERT_CELL_AFTER: {
        const cell: Cell = {
          id: uuid(),
          type: action.payload.type,
          content: '',
        }

        draft.data[cell.id] = cell

        const targetIdx = draft.order.findIndex(
          (cellId) => cellId === action.payload.id
        )

        if (targetIdx === -1) {
          draft.order.unshift(cell.id)
        } else {
          draft.order.splice(targetIdx + 1, 0, cell.id)
        }
      }
    }

    return draft
  }
)

export default reducer
