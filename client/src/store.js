import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './reducer'
import usersSlice from './features/users/usersSlice'

export default configureStore({
  reducer: {
    state: postsReducer,
    users: usersSlice
  },
})