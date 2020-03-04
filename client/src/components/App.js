import React, { useState, useEffect, Fragment } from "react";
import io from "socket.io-client";
import "../styles/App.css";
import DataFormPage from "./DataForm";
import AppMode from "../AppMode";
import WelcomePage from "./Welcome";

let endPoint = "http://localhost:5000";

let socket = io.connect(`${endPoint}`);

const modeTitle = {};

modeTitle[AppMode.WELCOME] = "Welcome to LISA";
modeTitle[AppMode.DATAFORM] = "LISA Inputs";

const modeToPage = {};
modeToPage[AppMode.WELCOME] = WelcomePage;
modeToPage[AppMode.DATAFORM] = DataFormPage;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: AppMode.WELCOME,
      id: 0
    }
  }

  handleChangeMode = (newMode) => {
    this.setState({mode: newMode});
  }

  // componentDidMount() {
  //   window.addEventListener("click", this.handleClick);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener("click", this.handleClick);
  // }

  render() {
    const ModePage = modeToPage[this.state.mode];
    return (
      <>
        {/* <h1>LISA</h1>
        <DataForm /> */}
        <ModePage 
          mode={this.state.mode}
          changeMode={this.handleChangeMode}
          id={this.state.id}
        />
      </>
    );
  }
}

export default App;
