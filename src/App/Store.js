import { configureStore } from '@reduxjs/toolkit'
import logdinReducer from '../features/user/logdinSlice'
import activeChat from '../features/activeChat/activeChat'


export default configureStore({
  reducer: {
    logdin : logdinReducer,
    activeChat : activeChat,
  },
})