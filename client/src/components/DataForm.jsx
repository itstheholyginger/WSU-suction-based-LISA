/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import RandVar from './RandVars'
import { ConstVar, NumRandVars, ZVar, Saturation } from './OtherVars'
import PropTypes from 'prop-types'
import Header from './Header'
import { data, results, testing } from '../resources/test_data'
import AppMode from '../AppMode'
import API from './apiClient'

// Needed Random Variables:
//    cohesion, ang_fric, k_s, a, n
// Constant Variables:
//    y_sat, y, y_w, slope, z, gnd_to_wt, c_r
// also, ask user for fluxes

class DataFormPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
    //   data: data
    data: testing.data
    }
  }

  static propTypes = {
    onSubmit: PropTypes.func,
    apiClient: PropTypes.object,
    changeMode: PropTypes.func
  };

  //  handling variable changes in data form
  handleRVChange = (varName, key, value) => {
    console.log(varName, key, value)
    var newData = this.state.data
    console.log('old data:\t', newData)
    newData.randVars[varName][key] = value
    console.log('var:\t', varName)
    console.log('\tnew data:\t', newData)
    this.setState({ newData })
  };

  handleDistChange = (varName, selected) => {
    var newData = this.state.data
    newData.randVars[varName] = {
      dist: selected,
      low: 0,
      high: 0,
      mean: 0,
      stdev: 0
    }
    this.setState(newData)
    console.log(varName, 'new dist is: ', selected)
  };

  handleConstVarChange = (varName, value) => {
    var newData = this.state.data
    newData.constVars[varName] = value
    this.setState(newData)
  };

  handleNumVarChange = (number) => {
    var newData = this.state.data
    newData.numVars = number
    this.setState(newData)
  };

  handleZVarChange = (key, val) => {
    var newData = this.state.data
    newData.z[key] = val
    this.setState(newData)
  };

  handleSatChange = (val) => {
    var newData = this.state.data
    newData.sat = val
    this.setState(newData)
  };

  onSubmit = e => {
    console.log("submit has been clicked. attempting to post to '/add_data'")
    console.log('data being sent: ', this.state.data)
    // this.props.apiClient.addData(this.state.data)
    e.preventDefault()
    API.post('/add_data', this.state.data)
    this.props.changeMode(AppMode.DISPLAY)
    // const response = await fetch('/add_data', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(this.state.data)
    // })

    // if (response.ok) {
    //   console.log('response worked!')
    // } else {
    //   console.log('the post request failed for some reason.')
    // }
  };

  render() {
    const sat = this.state.data.sat
    console.log('sat in dataform= ', sat)

    return (
      <Fragment>
        <Header title="Data Form" />
        <div className="paddedPage">
          <div className="myForm">
            <Form>
              <Form.Row>
                <Saturation
                  name="sat"
                  label="Soil Saturation"
                  handleChange={this.handleSatChange}
                />
                <NumRandVars handleChange={this.handleNumVarChange} />
              </Form.Row>
              <Form.Row>
                <DataFormSelector
                  sat={sat}
                  data={this.state.data}
                  handleRVChange={this.handleRVChange}
                  handleDistChange={this.handleDistChange}
                  handleConstVarChange={this.handleConstVarChange}
                  handleZVarChange={this.handleZVarChange}
                />
              </Form.Row>

              <Button variant="primary" onClick={this.onSubmit}>
                {' '}
                Submit{' '}
              </Button>
            </Form>
          </div>
        </div>
      </Fragment>
    )
  }
}

class DataFormSelector extends Component {
  static propTypes = {
    sat: PropTypes.bool,
    data: PropTypes.object,
    handleRVChange: PropTypes.func,
    handleDistChange: PropTypes.func,
    handleConstVarChange: PropTypes.func,
    handleZVarChange: PropTypes.func
  };

  render() {
    const sat = this.props.sat

    if (sat === true) {
      return (
        <Fragment>
          <Form.Group as={Col}>
            <div className="rand-vars">
              <RandVar
                data={this.props.data.randVars.c}
                name="c"
                label="C: Soil Cohesion"
                handleChange={this.props.handleRVChange}
                handleDistChange={this.props.handleDistChange}
              />

              <RandVar
                data={this.props.data.randVars.c_r}
                name="c_r"
                label="C_r: Root Cohesion"
                handleChange={this.props.handleRVChange}
                handleDistChange={this.props.handleDistChange}
              />

              <RandVar
                data={this.props.data.randVars.phi}
                name="phi"
                label="phi: Effective Angle of Friction"
                handleChange={this.props.handleRVChange}
                handleDistChange={this.props.handleDistChange}
              />

              <RandVar
                data={this.props.data.randVars.k_s}
                name="k_s"
                label="k_s: Saturated Hydraulic Conductivity"
                handleChange={this.props.handleRVChange}
                handleDistChange={this.props.handleDistChange}
              />

              <h5> Van Genuchten's parameters</h5>
              <RandVar
                data={this.props.data.randVars.a}
                name="a"
                label="a"
                handleChange={this.props.handleRVChange}
                handleDistChange={this.props.handleDistChange}
              />
              <RandVar
                data={this.props.data.randVars.n}
                name="n"
                label="n"
                handleChange={this.props.handleRVChange}
                handleDistChange={this.props.handleDistChange}
              />
            </div>
          </Form.Group>

          <Form.Group as={Col}>
            <div className="const-vars">
              <ConstVar
                name="gamma"
                label="gamma: Unit Weight of Soil"
                handleChange={this.props.handleConstVarChange}
              />
              <ConstVar
                name="gamma_w"
                label="gamma_w: Unit Weight of Water"
                handleChange={this.props.handleConstVarChange}
              />
              <ConstVar
                name="slope"
                label="Beta: Slope"
                handleChange={this.props.handleConstVarChange}
              />
              <ConstVar
                name="q"
                label="q: Infiltration"
                handleChange={this.props.handleConstVarChange}
              />

              <ZVar handleChange={this.props.handleZVarChange} />
            </div>
          </Form.Group>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <div className="rand-vars">
            <RandVar
              data={this.props.data.randVars.c}
              name="c"
              label="C: Soil Cohesion"
              handleChange={this.props.handleRVChange}
              handleDistChange={this.props.handleDistChange}
            />

            <RandVar
              data={this.props.data.randVars.c_r}
              name="c_r"
              label="C_r: Root Cohesion"
              handleChange={this.props.handleRVChange}
              handleDistChange={this.props.handleDistChange}
            />

            <RandVar
              data={this.props.data.randVars.phi}
              name="phi"
              label="phi: Effective Angle of Friction"
              handleChange={this.props.handleRVChange}
              handleDistChange={this.props.handleDistChange}
            />
          </div>

          <div className="const-vars">
            <ConstVar
              name="gamma"
              label="gamma: Unit Weight of Soil"
              handleChange={this.props.handleConstVarChange}
            />
            <ConstVar
              name="slope"
              label="Beta: Slope"
              handleChange={this.props.handleConstVarChange}
            />

            <ZVar handleChange={this.props.handleZVarChange} />
          </div>
        </Fragment>
      )
    }
  }
}

export default DataFormPage
