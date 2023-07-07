import { configureStore } from "@reduxjs/toolkit";
import authLoginSlice from "../reducers/authLoginSlice";

export default configureStore({
  reducer: { auth: authLoginSlice },
  devTools: true,
});
