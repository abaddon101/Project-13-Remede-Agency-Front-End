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
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formIsValid, setFormIsValid] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);

    if (!rememberMe) {
      // Si la case "Remember Me" est cochée, stockez l'information dans le localStorage
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("email", email);

      // Stockez également l'e-mail
    } else {
      // Si la case "Remember Me" est décochée, supprimez l'information du localStorage
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("email"); // Supprimez également l'e-mail
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform validation checks
    if (!email || !password) {
      console.log("Veuillez remplir tous les champs.");
      setFormIsValid(false);
      return;
    }

    // Vérification de l'e-mail à l'aide d'une expression régulière
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Veuillez entrer une adresse e-mail valide.");
      setFormIsValid(false);
      return;
    }

    try {
      setFormIsValid(true);
      const loginResponse = await dispatch(loginAsync({ email, password })); // Appel à l'API via redux
      // console.log("Login Response:", loginResponse.payload);

      // Vérifier si l'authentification a réussi ou non en vérifiant la réponse de l'API
      if (loginResponse.payload && loginResponse.payload.error) {
        console.log("Authentication Error:", loginResponse.payload.error);
        // Authentification échouée, afficher l'erreur
        console.log(
          "La connexion a échoué. Veuillez vérifier votre email et mot de passe."
        );
        setLoginError(
          "La connexion a échoué. Veuillez vérifier votre email et mot de passe."
        );
        setFormIsValid(false);
      } else {
        const token = localStorage.getItem("token") ?? "";

        // console.log("Profile Response Token:", token);

        // Appel à fetchUserProfile pour obtenir les données du profil
        const profileResponse = await dispatch(fetchUserProfile(token));
        // Stocker les données dans le localStorage
        localStorage.setItem("firstName", profileResponse.firstName);
        localStorage.setItem("lastName", profileResponse.lastName);
        // console.log("Profile Response:", profileResponse);
        // Authentification réussie, redirige l'utilisateur vers la page de profil
        dispatch(
          loginSuccess({
            token: loginResponse.payload.token,
            userId: profileResponse.payload.userId, // Ajouter l'userId
            firstName: profileResponse.payload.firstName,
            lastName: profileResponse.payload.lastName,
          })
        );

        console.log(loginResponse.payload);

        // Dispatch de l'action loginSuccess avec les données de l'utilisateur
        navigate(`/profil/`);
      }
    } catch (error) {
      // Gérer les erreurs ici
      console.log("Error in onSubmit:", error);
    }
  };
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profil"); // Redirige l'utilisateur vers la page de profil s'il est déjà connecté
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
