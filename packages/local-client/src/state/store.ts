import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { persistMiddleware } from './middlewares/persist-middleware'

export const store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(thunk, persistMiddleware),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )
)
