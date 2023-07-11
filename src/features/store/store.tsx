import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authLoginSlice from "../reducers/authLoginSlice";

const rootReducer = combineReducers({
  auth: authLoginSlice,
  // Ajoutez ici d'autres tranches de votre store Redux
});

export type RootState = ReturnType<typeof rootReducer>;


export default configureStore({
  reducer: rootReducer,
  devTools: true,
});
