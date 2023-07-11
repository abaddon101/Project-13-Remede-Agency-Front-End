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
    redirectToProfil: false,
    userId: "",
  },

  reducers: {
    login: (state, action) => {
      // console.log(action);

      axios
        .post("http://localhost:3001/api/v1/user/login", action.payload)
        .then((res) => {
          // console.log(res);
          // Dispatch loginSuccess avec les données de l'utilisateur en payload
          // console.log(res.data.body.token);
          // console.log(res.data.body);
          // Enregistrer le token dans le stockage local
          localStorage.setItem("token", res.data.body.token);

          // Récupérer le token du stockage local
          const token = localStorage.getItem("token");
          console.log(token);

          // Utiliser le token pour effectuer une requête authentifiée
          axios
            .post(
              "http://localhost:3001/api/v1/user/profile",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((profileRes) => {
              // Accéder à l'ID de l'utilisateur à partir de la réponse
              const userId = profileRes.data.body.id;
              console.log(userId);
            })
            .catch((error: any) => {
              console.log("connection échouée");
            });
        })
        .catch((error: any) => {
          console.log("connection échouée");
        });
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.userId = action.payload.id;
      state.error = null;
    },
    redirectToProfil: (state) => {
      state.redirectToProfil = true;
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

export const {
  loginSuccess,
  loginFailure,
  logout,
  test,
  login,
  redirectToProfil,
} = authLoginSlice.actions;
export default authLoginSlice.reducer;
