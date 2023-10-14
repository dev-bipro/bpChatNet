import { configureStore } from '@reduxjs/toolkit'
import logdinReducer from '../features/user/logdinSlice'

export default configureStore({
  reducer: {
    logdin : logdinReducer,
  },
})