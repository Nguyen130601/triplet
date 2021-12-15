import initialState from './initialState';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import socket from './socket';

export const deleteNode = createAsyncThunk('nodes/deleteNode', (initialValue) => {
    console.log('Deleted feature')
    socket.emit('node:delete',initialValue)
})

export const addNewNode = createAsyncThunk('nodes/addNewNode',
  async (initialValue) => {
    let response;
    socket.emit('node:create',initialValue)
    socket.on('node:create', (msg) => {
        console.log(msg)
    });
    return response;
  }
)

export const fetchNodes = createAsyncThunk('nodes/fetchNodes', async () => {
  return new Promise(
    (resolve , reject)=>{
        socket.emit("node:feed")
            socket.on("node:feed",(result)=>{
            resolve(result)
    })
})
})

const postsReducer = createSlice({
  name: 'state',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder.addCase(addNewNode.fulfilled, (state, action) => {
      const { id, body, user, title, parentId, img } = action.meta.arg
      state.nodes.push({
        id,
        user,
        title,
        body,
        hidden: false,
        votes: 1,
        childIds: [],
        parentId,
        img
      })
      const existingParentNode = state.nodes.find(node => node.id === parentId);
      if (existingParentNode) existingParentNode.childIds.push(id);
    })
    .addCase(fetchNodes.pending, (state, action) => {
      state.status = 'loading'
    })
    .addCase(fetchNodes.fulfilled, (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.nodes = state.nodes.concat(action.payload)
      action.payload.forEach(element => { 
        const existingNode = state.nodes.find(node =>  element.parentId === node.id)
        existingNode.childIds.push(element.id)
      })
    })
    .addCase(fetchNodes.rejected, (state, action) => {
      state.status = 'failed'
      //state.error = action.error.message
    })
  }
})

// Action creators are generated for each case reducer function
export const { createNode } = postsReducer.actions

export default postsReducer.reducer

export const selectAllNode = state => state.state.nodes

export const selectNodeById = (state, postId) =>
  state.state.nodes.find(post => post.id === postId)




