// import { Form, Field } from "react-final-form";
import React from "react";
import { Form, Col, Button } from "react-bootstrap";

class DataFormPage extends React.Component {
  constructor(props) {
    super(props);
  }

  // Needed Random Variables:
  //    cohesion, ang_fric, k_s, a, n
  // Constant Variables:
  //    y_sat, y, y_w, slope, z, gnd_to_wt, c_r
  // also, ask user for fluxes
  render() {
    return (
      <div className="myForm">
        <Form>
          <div className="rand-vars">
            <h4>Random Variables</h4>

            <div className="form-group">
            <NumRandVars />
            </div>

            <div className="form-group">
              <RandVar name="Soil Cohesion (coh)" />
            </div>

            <div className="form-group">
              <RandVar name="Root Cohesion" />
            </div>

            <div className="form-group">
              <RandVar name="Angle of Friction (ang_fric)" />
            </div>

            <div className="form-group">
              <RandVar name="Saturated Hydraulic Conductivity (k_s)" />
            </div>

            <div className="form-group">
              <h5> Van Genuchten's parameters</h5>
              <RandVar name="a" />
              <RandVar name="n" />
            </div>
          </div>

          <div className="const-vars">
            {/* plot dist above water table between 0-5 by step of .05 )let user decide
          get max z and the step */}
            <div className="form-group">
              <ConstVar name="y_water" />
            </div>

            <div className="form-group">
              <ConstVar name="y_sat" />
            </div>

            <div className="form-group">
              <ConstVar name="y" />
            </div>

            <div className="form-group">
              <ConstVar name="slope" />
            </div>

            {/* Assume 5 for now ??? */}
            {/* <div className="form-group">
              <ConstVar name="Distance from Ground to Water Table" />
            </div> */}

            <div className="form-group">
              <ZVar />
            </div>
          </div>

            <Button variant="primary" type="submit">
              Submit
            </Button>
        </Form>
      </div>
    );
  }
}


class RandVar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dist: "uniform",
      min: 0,
      max: 0,
      mean: 0,
      stddev: 0
    };
  }

  handleSubmit = e => {
    console.log(e.target.value);
  };

  handleDistChange = selectedOption => {
    this.setState(
      {
        dist: selectedOption.target.value,
        min: 0,
        max: 0,
        mean: 0,
        stddev: 0
      },
      () => console.log("option selected: ", this.state.dist)
    );
  };

  handleChange = e => {
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  }

  render() {

    return (
      <div>
        {/* <Form> */}
          <h6>{this.props.name}</h6>
          <Form.Row  className="randVarGroup">
            <Form.Group  as={Col} controlId="formDist">
              <Form.Label> Distribution </Form.Label>
              <Form.Control as="select" className="input" onChange={this.handleDistChange}>
                <option value="uniform" selected>
                  Uniform
                </option>
                <option value="normal">Normal</option>
                <option value="bivariate"> Bivariate</option>
              </Form.Control>
            </Form.Group>
            {this.state.dist === "uniform" ? (
              <>
                <Form.Group as={Col} className="input" controlId="formMin">
                  <Form.Label>Min</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    step={0.0001}
                    onChange={this.handleChange}
                    placeholder="Enter minimum"
                   />
                </Form.Group>

                <Form.Group as={Col} className="input" controlId="formMax">
                  <Form.Label>Max</Form.Label>
                  <Form.Control
                    type="number"
                    min={this.state.min}
                    step={0.0001}
                    onChange={this.handleChange}
                    placeholder="Enter maximum" 
                    />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group as={Col} controlId="formMean">
                  <Form.Label>Mean</Form.Label>
                  <Form.Control type="text" onChange={this.handleChange} placeholder="Enter mean" />
                </Form.Group>

                <Form.Group as={Col} controlId="formStdDev">
                  <Form.Label>Standard Deviation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter standard deviation"
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </>
            )}
          </Form.Row>
        {/* </Form> */}
      </div>
      
    );
  }
}


class ConstVar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  render() {
    // text for a placeholder for each value input field
    return (
      <div >
        {/* <Form> */}
          <Form.Row style={{width: "300px"}}>
            {/* <h6>{this.props.name}</h6> */}
            <Form.Group as={Col} controlID="formVal" style={{}}>
              <Form.Label><h6>{this.props.name}</h6></Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={0.0001}
                placeholder="Enter value"
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form.Row>
        {/* </Form> */}
      </div>
    );
  }
}

class ZVar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      max: 0,
      step: 0.5
    };
  }

  handleChange = e => {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  render() {
    return (
      <div >
        {/* <Form> */}
          <h6>Z</h6>
          <Form.Row>
            <Form.Group as={Col} controlId="form-max">
              <Form.Label>Max</Form.Label>
              <Form.Control
                type="number"
                min={.0001}
                step={0.0001}
                placeholder="Max Z value"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group as ={Col} controlId="form-step">
              <Form.Label>Step</Form.Label>
              <Form.Control
                type="number"
                min={0.0001}
                step={0.0001}
                placeholder="Z step value"
                onChange={this.handleChange}
               />
            </Form.Group>
          </Form.Row>
        {/* </Form> */}
      </div>
    );
  }
}

class NumRandVars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  render() {
    return (
      <div >
          <Form.Row className="input">
            <Form.Group as={Col} controlId="form-numVars">
              <Form.Label>Number of Random Variables</Form.Label>
              <Form.Control
                type="number"
                min={0}
                placeholder="Enter value"
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form.Row>
      </div>
    );
  }
}

export default DataFormPage;
