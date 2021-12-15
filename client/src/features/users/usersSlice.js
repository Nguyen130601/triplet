import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import socket from '../../socket'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    return new Promise(
        (resolve , reject)=>{
            socket.emit("users")
                socket.on("users",(users)=>{
                resolve(users)
        })
    })
    
})

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [
        ],
        status:'loading',
        error: null
    },
    reducer: {},
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                console.log(action.payload)
                state.status = 'succeeded';
                state.users = state.users.concat(action.payload)
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
            })
    }
})

export default usersSlice.reducer

export const selectAllUsers = state => state.users.users