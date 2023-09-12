import {
  configureStore,
  combineReducers,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authLoginSlice from "../reducers/authLoginSlice";

const rootReducer = combineReducers({
  auth: authLoginSlice,
  // Ajoutez ici d'autres tranches de votre store Redux
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
