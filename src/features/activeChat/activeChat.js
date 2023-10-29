import { createSlice } from '@reduxjs/toolkit'

export const activeChat = createSlice({
  name: 'whoActiveChat',
  initialState: {
    value: null,
  },
  reducers: {
    activeChatNow: (state,action) => {
      state.value = action.payload
    },
    
  },
})

export const { activeChatNow } = activeChat.actions

export default activeChat.reducer