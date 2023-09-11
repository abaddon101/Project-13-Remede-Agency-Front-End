import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }: { email: string; password: string }) => {
    console.log("loginAsync is called", email); // Ajout de ce log
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/login",
        { email, password }
      );
      console.log("loginAsync is called and has good response:", response);
      if (response.data.body) {
        const { token } = response.data.body;
        console.log("Token:", token);
        // console.log("FirstName:", firstName);
        // console.log("LastName:", lastName);
        localStorage.setItem("token", token);
        return { token };
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (token: string) => {
    console.log("fetchUserProfile is called and has the token", token);
    try {
      const profileResponse = await axios.post(
        "http://localhost:3001/api/v1/user/profile",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (profileResponse.data) {
        const { token, firstName, lastName } = profileResponse.data.body;
        // console.log("Token:", token);
        console.log("response from user/profil:", firstName);
        console.log("response from user/profil:", lastName);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        return profileResponse.data.body;
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
);
// fonction pour reset les données utlisateurs
export const logoutAndClearUserData = createAsyncThunk(
  "auth/logoutAndClearUserData",
  async () => {
    try {
      // Simulez la déconnexion en appelant loginAsync avec des valeurs vides
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/login",
        { email: "", password: "" }
      );

      if (response.data.body) {
        const { token } = response.data.body;
        localStorage.setItem("token", token);

        // Utilisez fetchUserProfile pour réinitialiser les données de l'utilisateur
        const profileResponse = await axios.post(
          "http://localhost:3001/api/v1/user/profile",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.data) {
          const { firstName, lastName } = profileResponse.data.body;
          localStorage.setItem("firstName", firstName);
          localStorage.setItem("lastName", lastName);
        }
      }
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  }
);

// Slice Redux pour l'authentification
export const loginSlice = createSlice({
  name: "authentification",
  initialState: {
    loginSuccess: false,
    email: "string",
    password: "string",
    isAuthenticated: !!localStorage.getItem("token"), // Met à jour isAuthenticated à partir du local storage
    token: localStorage.getItem("token") || "",
    userId: localStorage.getItem("userId") || "",
    firstName: localStorage.getItem("firstName") || "",
    lastName: localStorage.getItem("lastName") || "",
    error: "",
  },
  reducers: {
    login: (state, action) => {
      console.log(state);
      console.log();
    },

    loginSuccess: (state, action) => {
      // console.log("loginSuccess action is dispatched", state);
      state.loginSuccess = true;

      localStorage.setItem("firstName", action.payload.firstName);
      localStorage.setItem("lastName", action.payload.lastName);
      localStorage.setItem("token", action.payload.token);
      state.token = action.payload.token;
      state.userId = action.payload.userId; // Assurez-vous d'ajouter userId

      // console.log("state:", state);
      // console.log("action:", action);
    },
    loginFail: (state, { payload }) => {
      state.isAuthenticated = false;
      state.loginSuccess = false;
      state.error = payload;
    },
    logout: (state) => {
      // Réinitialisez les valeurs avec les valeurs par défaut
      state.isAuthenticated = false;
      state.loginSuccess = false;
      state.firstName = "";
      state.lastName = "";
      state.token = "";
      // Réinitialisez également les valeurs dans le localStorage
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("token");
    },
  },
  // ...
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      const { token } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      // state.firstName = firstName;
      // state.lastName = lastName;
    });

    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      const { firstName, lastName } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      // You might also want to set other relevant profile data in the state here
    });
    builder.addCase(logoutAndClearUserData.fulfilled, (state, action) => {
      // Les données de l'utilisateur ont été réinitialisées lors de la déconnexion
      // Vous pouvez ajouter d'autres manipulations d'état ici si nécessaire
    });
  },

  // ...
});

export const { login, loginSuccess, loginFail, logout } = loginSlice.actions;
export default loginSlice.reducer;
