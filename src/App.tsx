import React from "react";
import Nav from "./componentsApp/Nav";
import Home from "./page/Home";
import Signin from "./page/Signin";
import Profil from "./page/Profil";
import Footer from "./componentsApp/Footer";

import "./page/style.scss";

function App() {
  return (
    <div className="App">
      <Nav />
      <Profil />
      <Footer />
    </div>
  );
}

export default App;
