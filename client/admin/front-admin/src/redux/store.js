import { configureStore } from '@reduxjs/toolkit'
import crudReducer from './crud-slice'
import authReducer from './auth-slice'

export const store = configureStore({
  reducer: {
    crud: crudReducer,
    auth: authReducer
  }
})

export default store
