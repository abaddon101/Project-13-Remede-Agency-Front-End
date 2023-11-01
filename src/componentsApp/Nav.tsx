import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import argentBankLogo from "../assets/argentBankLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOut,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import { RootState, AppDispatch } from "../features/store/store";
import { logout } from "../features/reducers/authLoginSlice";
// import { logoutAndClearUserData } from "../features/reducers/authLoginSlice";

function Navigation() {
  // Using useSelector to access data from the Redux store
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const firstName = useSelector((state: RootState) => state.auth.firstName);
  const lastName = useSelector((state: RootState) => state.auth.lastName);

  const dispatch = useDispatch<AppDispatch>() as any;

  // Handler function for signing out
  const handleSignOut = () => {
    // Dispatch the "logout" action to log the user out
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
          // Render content for authenticated users
          <div className="LinksInAndOut-first-child">
            <h3>
              {/* Display user's first name */}
              <FontAwesomeIcon width={45} icon={faUserCircle} />
              {firstName}
            </h3>
            <Link to="/" onClick={handleSignOut} className="main-nav-item">
              {/* Sign out button */}
              <FontAwesomeIcon width={45} icon={faSignOut} />
              Sign Out
            </Link>
          </div>
        ) : (
          // Render content for non-authenticated users
          <div className="LinksInAndOut-second-child">
            <h3>
              {/* Link to the sign-in page */}
              <Link to="/signin" className="main-nav-item">
                <FontAwesomeIcon width={45} icon={faSignIn} />
                Sign In
              </Link>
            </h3>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
