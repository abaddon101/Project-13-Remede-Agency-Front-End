import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { login } from "../features/reducers/authLoginSlice";
import { RootState } from "../features/store/store";
// import { getToken } from "../features/actions/post.action";
// console.log(login);

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [selectedUserId, setSelectedUserId] = useState("");

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profil"); // Redirige l'utilisateur vers la page de profil
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)); // Passer formData comme argument
      // Connexion réussie, redirige l'utilisateur vers la page de profil
      navigate(`/profil/`);
    } catch (error) {
      // Connexion échouée, gérer l'erreur
      console.log("connection échouée");
    }
  };

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

          <button className="sign-in-button" type="submit">
            {/* <Link to="/profil"> */}
            Sign In
            {/* </Link> */}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Main;
