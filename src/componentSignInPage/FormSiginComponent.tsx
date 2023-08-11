import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/reducers/authLoginSlice";
import { loginSuccess } from "../features/reducers/authLoginSlice";
import { RootState } from "../features/store/store";

function FormSignin() {
  const dispatch = useDispatch();
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

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
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
      const response = await dispatch(login(formData)); // Appel à l'API via redux

      // Vérifier si l'authentification a réussi ou non en vérifiant la réponse de l'API
      if (response.payload && response.payload.error) {
        // Authentification échouée, afficher l'erreur
        console.log(
          "La connexion a échoué. Veuillez vérifier votre email et mot de passe."
        );
        setLoginError(
          "La connexion a échoué. Veuillez vérifier votre email et mot de passe."
        );
        setFormIsValid(false);
      } else {
        // Authentification réussie, redirige l'utilisateur vers la page de profil
        dispatch(loginSuccess(response.payload)); // Dispatch de l'action loginSuccess avec les données de l'utilisateur
        navigate(`/profil/`);
      }
    } catch (error) {
      // Gérer les erreurs ici
      console.log("Erreur lors de la connexion:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profil"); // Redirige l'utilisateur vers la page de profil s'il est déjà connecté
    }
  }, [isAuthenticated, navigate]);

  console.log("isAuthenticated:", isAuthenticated);

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={onSubmit}>
          <div className="input-wrapper">
            <label htmlFor="email">email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              placeholder="nom d'utilisateur"
              onChange={onChange}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="mot de passe"
              onChange={onChange}
            />
          </div>
          <div className="input-remember">
            <input type="checkbox" id="remember-me" />
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
