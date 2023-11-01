import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to handle user login
export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }: { email: string; password: string }) => {
    console.log("loginAsync is called", email);
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

// Async action to fetch user profile
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

// Async action to log out and clear user data
export const logoutAndClearUserData = createAsyncThunk(
  "auth/logoutAndClearUserData",
  async () => {
    try {
      // Simulate logout by calling loginAsync with empty values
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/login",
        { email: "", password: "" }
      );

      if (response.data.body) {
        // If the response contains a 'body', assume the logout was successful
        const { token } = response.data.body;
        localStorage.setItem("token", token);

        // Use fetchUserProfile to reset user data
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
          // If the profile response contains data, update user data in local storage
          const { firstName, lastName } = profileResponse.data.body;
          localStorage.setItem("firstName", firstName);
          localStorage.setItem("lastName", lastName);
        }
      }
    } catch (error) {
      // Handle and log errors
      console.error("Error during logout:", error);
      throw error;
    }
  }
);


// Redux slice for authentication
export const loginSlice = createSlice({
  name: "authentification",
  initialState: {
    loginSuccess: false,
    email: "string",
    password: "string",
    isAuthenticated: !!localStorage.getItem("token"), // Update isAuthenticated from local storage
    token: localStorage.getItem("token") || "",
    userId: localStorage.getItem("userId") || "",
    firstName: localStorage.getItem("firstName") || "",
    lastName: localStorage.getItem("lastName") || "",
    error: "",
  },
  // Redux reducers for handling login, success, failure, and logout actions
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
      state.userId = action.payload.userId;
    },
    loginFail: (state, { payload }) => {
      state.isAuthenticated = false;
      state.loginSuccess = false;
      state.error = payload;
    },
    logout: (state) => {
      // reinitialize values with the initials values
      state.isAuthenticated = false;
      state.loginSuccess = false;
      state.firstName = "";
      state.lastName = "";
      state.token = "";
      // reinitialize too values into the localStorage
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("token");
    },
  },
// Handle extra reducers for loginAsync, fetchUserProfile, and logoutAndClearUserData
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
      // datas reinitialized during logout
      
    });
  },
});

export const { login, loginSuccess, loginFail, logout } = loginSlice.actions;
export default loginSlice.reducer;
