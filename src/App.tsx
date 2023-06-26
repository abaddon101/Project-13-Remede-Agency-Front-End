import React from "react";
import Nav from "./componentsApp/Nav";
import Home from "./page/Home";
import Footer from "./componentsApp/Footer";
import "./page/style.scss";

function App() {
  return (
    <div className="App">
      <Nav />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
