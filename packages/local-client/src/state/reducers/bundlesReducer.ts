import produce from 'immer'
import { Action } from '../actions'
import { ActionType } from '../action-types'

interface BundlesState {
  [cellId: string]:
    | {
        processing: boolean
        code: string
        error: string
      }
    | undefined
}

const initialState: BundlesState = {}

const reducer = produce(
  (draft: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_START: {
        draft[action.payload.cellId] = {
          processing: true,
          code: '',
          error: '',
        }
        break
      }
      case ActionType.BUNDLE_COMPLETE: {
        draft[action.payload.cellId] = {
          processing: false,
          code: action.payload.bundle.code,
          error: action.payload.bundle.error,
        }
      }
    }
    return draft
  }
)

export default reducer
