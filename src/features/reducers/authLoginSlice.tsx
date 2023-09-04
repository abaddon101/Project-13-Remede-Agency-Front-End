import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface UserProfileData {
  firstName: string;
  lastName: string;
  // Ajoutez d'autres propriétés si nécessaire
}

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
        const { token, firstName, lastName } = response.data.body;
        console.log("Token:", token);
        console.log("FirstName:", firstName);
        console.log("LastName:", lastName);
        localStorage.setItem("token", token);
        return { token, firstName, lastName };
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
        console.log("Token:", token);
        console.log("FirstName:", firstName);
        console.log("LastName:", lastName);
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

// Slice Redux pour l'authentification
export const loginSlice = createSlice({
  name: "authentification",
  initialState: {
    loginSuccess: false,
    email: "string",
    password: "string",
    isAuthenticated: false,
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
      console.log("loginSuccess action is dispatched", state);
      state.loginSuccess = true;
      state.isAuthenticated = true;
      localStorage.setItem("firstName", action.payload.firstName);
      localStorage.setItem("lastName", action.payload.lastName);
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
      console.log("logout action is dispatched");
      state.isAuthenticated = false;
      state.loginSuccess = false;
      state.firstName = "";
      state.lastName = "";
      state.token = "";
    },
  },
  // ...
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      const { token, firstName, lastName } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.firstName = firstName;
      state.lastName = lastName;
    });

    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      const { firstName, lastName } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      // You might also want to set other relevant profile data in the state here
    });
  },

  // ...
});

export const { login, loginSuccess, loginFail, logout } = loginSlice.actions;
export default loginSlice.reducer;
