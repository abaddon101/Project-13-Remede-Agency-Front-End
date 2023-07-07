import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Login user

export const authLoginSlice = createSlice({
  name: "auth",
  initialState: {
    email: "string",
    password: "string",
    isAuthenticated: false,
    user: null,
    error: null,
  },

  reducers: {
    login: (state, action) => {
      console.log(action);

      axios
        .post("http://localhost:3001/api/v1/user/login", action.payload)
        .then((res) => {
          console.log(res);
          console.log(res.data.body.token);
        })
        .catch((error: any) => {
          console.log("connection échouée");
        });
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    test: (state) => {
      console.log("test");
    },
  },
});

export const { loginSuccess, loginFailure, logout, test, login } =
  authLoginSlice.actions;
export default authLoginSlice.reducer;
