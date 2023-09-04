import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import argentBankLogo from "../assets/argentBankLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../features/store/store";
import { logout } from "../features/reducers/authLoginSlice";

function Navigation() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  // console.log("isAuthenticated:", isAuthenticated);
  const dispatch = useDispatch();
  const handleSignOut = () => {
    // Dispatchez l'action de déconnexion
    dispatch(logout());
  };

  return (
    <nav className="main-nav">
      <Link to="/" className="main-nav-logo">
        <img
          className="main-nav-logo-image"
          src={argentBankLogo}
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <div className="LinksInAndOut">
        {isAuthenticated ? (
          <Link to="/" onClick={handleSignOut} className="main-nav-item">
            <FontAwesomeIcon icon={faUserCircle} />
            Sign Out
          </Link>
        ) : (
          <Link to="/signin" className="main-nav-item">
            <FontAwesomeIcon icon={faUserCircle} />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
