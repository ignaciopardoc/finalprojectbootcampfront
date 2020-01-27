import React from "react";
import "./App.css";
import Navbar from "./Navbar";
import Register from "./Register/Register";

class App extends React.PureComponent {
  render() {
    return (
      <div>
        <Navbar />
        <Register />
      </div>
    );
  }
}

export default App;
