import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/reducers/authLoginSlice";
import { loginSuccess } from "../features/reducers/authLoginSlice";
import { RootState, AppDispatch } from "../features/store/store";
import {
  loginAsync,
  fetchUserProfile,
} from "../features/reducers/authLoginSlice";

function FormSignin() {
  const dispatch = useDispatch<AppDispatch>() as any;
  const navigate = useNavigate();

  // Use Redux's useSelector to get the isAuthenticated state from the store
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Define and initialize the form data, validation state, login error, and remember me state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formIsValid, setFormIsValid] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { email, password } = formData;

  // Event handler for input changes
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Event handler for the "Remember Me" checkbox
  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);

    if (!rememberMe) {
      // If "Remember Me" is checked, store information in localStorage
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("email", email);
    } else {
      // If "Remember Me" is unchecked, remove information from localStorage
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("email");
    }
  };

  // Event handler for form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform validation checks
    if (!email || !password) {
      console.log("Please fill in all fields.");
      setFormIsValid(false);
      return;
    }

    // Check email validity using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Please enter a valid email address.");
      setFormIsValid(false);
      return;
    }

    try {
      setFormIsValid(true);

      // Call the loginAsync function from the Redux store to perform login
      const loginResponse = await dispatch(loginAsync({ email, password }));

      // Check if authentication was successful
      if (loginResponse.payload && loginResponse.payload.error) {
        console.log("Authentication Error:", loginResponse.payload.error);
        console.log("Login failed. Please check your email and password.");
        setLoginError("Login failed. Please check your email and password.");
        setFormIsValid(false);
      } else {
        // If authentication was successful, store user information in localStorage
        const token = localStorage.getItem("token") ?? "";

        // Call fetchUserProfile to get user profile data
        const profileResponse = await dispatch(fetchUserProfile(token));

        localStorage.setItem("firstName", profileResponse.firstName);
        localStorage.setItem("lastName", profileResponse.lastName);

        // Dispatch the loginSuccess action with user data and redirect to the profile page
        dispatch(
          loginSuccess({
            token: loginResponse.payload.token,
            userId: profileResponse.payload.userId,
            firstName: profileResponse.payload.firstName,
            lastName: profileResponse.payload.lastName,
          })
        );

        navigate(`/profil/`);
      }
    } catch (error) {
      console.log("Error in onSubmit:", error);
    }
  };

  // useEffect to check if "Remember Me" is checked and populate the email field
  useEffect(() => {
    const rememberMeValue = localStorage.getItem("rememberMe");
    const storedEmail = localStorage.getItem("email");

    if (rememberMeValue === "true" && storedEmail) {
      setRememberMe(true);
      setFormData({
        ...formData,
        email: storedEmail,
      });
    }
  }, []);

  // useEffect to check if the user is already authenticated and redirect to the profile page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profil");
    }
  }, [isAuthenticated, navigate]);

  console.log("isAuthenticated:", isAuthenticated);
  console.log("rememberMe:", rememberMe);

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form className="form-sign-in" onSubmit={onSubmit}>
          <div className="input-wrapper-signin">
            <label htmlFor="email">email</label>
            <input
              // className="custom-input"
              type="text"
              id="email"
              name="email"
              value={email}
              placeholder="nom d'utilisateur"
              onChange={onChange}
            />
          </div>
          <div className="input-wrapper-signin">
            <label htmlFor="password">Password</label>
            <input
              // className="custom-input"
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="mot de passe"
              onChange={onChange}
            />
          </div>
          <div className="input-remember-signin">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>

          <button
            className="sign-in-button"
            type="submit"
            disabled={!formIsValid}
          >
            Sign In
          </button>
        </form>
        {loginError && <p>{loginError}</p>}
      </section>
    </main>
  );
}

export default FormSignin;
