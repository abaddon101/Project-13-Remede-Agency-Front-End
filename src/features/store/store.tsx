import {
  configureStore,
  combineReducers,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authLoginSlice from "../reducers/authLoginSlice";

// Combine multiple reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authLoginSlice, // In this example, the "auth" state is managed by the authLoginSlice reducer
});

// Create a Redux store with the root reducer and enable devTools for debugging
export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

// Define the AppDispatch type to access the store's dispatch function
export type AppDispatch = typeof store.dispatch;

// Create a custom hook (useAppDispatch) to access the store's dispatch function
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Define the RootState type to represent the shape of the store's state
export type RootState = ReturnType<typeof rootReducer>;

// Define the AppThunk type for handling asynchronous actions with Redux Toolkit
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
