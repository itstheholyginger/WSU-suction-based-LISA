import React from "react";
import { Form, Col, Button } from "react-bootstrap";

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="welcome-page">
        <div className="welcome-banner">
          <WelcomeBanner />
        </div>
        
        <div className="app-desc">
          <AppDescription />
        </div>
        
        <div className="button-container">
          <ButtonContainer />
        </div>
      </div>
    );
  }
}

class WelcomeBanner extends React.Component {
  render() {
    return (
      <div className="welcome-banner">
        <div className="welcome-text">Welcome to LISA</div>
      </div>
    );
  }
}

class AppDescription extends React.Component {
  render() {
    return (
      <div className="">
        <h2>Application Description</h2>
        <br />
        <p>Description of the LISA project. History and what it does.</p>
      </div>
    );
  }
}

class ButtonContainer extends React.Component {
  render() {
    return (
      <div className="button-container">
        <Button variant="success"></Button>
        <Button variant="info"></Button>
      </div>
    );
  }
}

export default WelcomePage;
