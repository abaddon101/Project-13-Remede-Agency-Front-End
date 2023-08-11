import React from "react";
import { useSelector } from "react-redux";
import Main from "../componentProfilPage/Main";
import { RootState } from "../features/store/store";

function Profil() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Sinon, affichez le formulaire de connexion
  return <Main />;
}

export default Profil;
