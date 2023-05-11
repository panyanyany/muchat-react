import {createStore} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import appSlice from "./appSlice";

const store = configureStore({
    reducer: {
        app: appSlice,
    }
})

store.subscribe(() => {
    const curApp = store.getState().app
    localStorage.setItem('chats', JSON.stringify(curApp.chats))
    localStorage.setItem('presetPrompt', JSON.stringify(curApp.presetPrompt))
    localStorage.setItem('enabledCtx', JSON.stringify(curApp.enabledCtx))
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch