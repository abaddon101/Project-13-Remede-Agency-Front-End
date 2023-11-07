import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./componentsApp/Nav";
import Footer from "./componentsApp/Footer";
import Home from "./page/Home";
import Signin from "./page/Signin";
import Profil from "./page/Profil";
import Transactions from "./page/Transactions";

import "./page/style.scss";

function App() {

  
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/Transactions" element={<Transactions />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
