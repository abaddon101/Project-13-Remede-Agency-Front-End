import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fonction utilitaire pour effectuer la vérification côté serveur
async function checkCredentials(email: string, password: string) {
  try {
    // Effectuer l'appel API pour vérifier les identifiants côté serveur
    const response = await axios.post(
      "http://localhost:3001/api/v1/user/login",
      { email, password }
    );
    // Log pour afficher la réponse de l'API côté serveur (facultatif, pour le débogage)
    console.log("Réponse de l'API côté serveur:", response.data);
    // Retourner true si l'authentification réussit
    return response.data.success;
  } catch (error) {
    console.log("Erreur lors de la vérification des identifiants:", error);
    return false;
  }
}
// Appel asynchrone pour la connexion
export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }: { email: string; password: string }) => {
    const isAuthenticated = await checkCredentials(email, password);
    if (isAuthenticated) {
      return { isAuthenticated };
    } else {
      throw new Error("Failed to authenticate");
    }
  }
);

// Slice Redux pour l'authentification
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
    loginSuccess: false,
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

              // Mettre à jour l'état d'authentification
              state.isAuthenticated = true;
              state.loginSuccess = true;
            })
            .catch((error: any) => {
              console.log("connection échouée");
            });
        });
      // .catch((error: any) => {
      //   console.log("connection échouée");
      // });
    },
    loginSuccess: (state, action) => {
      console.log("loginSuccess action is dispatched");
      state.isAuthenticated = true;
      state.loginSuccess = true;
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
      console.log("logout action is dispatched");
      state.isAuthenticated = false;
      state.loginSuccess = true;
      state.user = null;
      state.error = null;
    },
    test: (state) => {
      console.log("test");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      console.log("loginAsync fulfilled is dispatched");
      state.isAuthenticated = action.payload.isAuthenticated;
      state.loginSuccess = action.payload.isAuthenticated;
    });
    builder.addCase(loginAsync.rejected, (state) => {
      console.log("loginAsync rejected is dispatched");
      state.isAuthenticated = false;
      state.loginSuccess = false;
    });
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
