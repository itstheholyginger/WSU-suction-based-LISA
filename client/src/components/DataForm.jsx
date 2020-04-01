/* eslint-disable react/no-unescaped-entities */
// import { Form, Field } from "react-final-form";
import React from 'react'
import { Form, Button } from 'react-bootstrap'
// eslint-disable-next-line camelcase
import { RandVar, ConstVar, NumRandVars, ZVar, Saturation, H_wtVar } from './Vars.jsx'
import PropTypes from 'prop-types'
import Header from './Header'

class DataFormPage extends React.Component {
  static propTypes = {
    handleChange: PropTypes.func,
    onSubmit: PropTypes.func,
    handleNumVarChange: PropTypes.func,
    handleSatChange: PropTypes.func,
    handleRandVarChange: PropTypes.func,
    handleDistChange: PropTypes.func,
    handleConstVarChange: PropTypes.func,
    data: PropTypes.object,
    handleZVarChange: PropTypes.func
  }
  // Needed Random Variables:
  //    cohesion, ang_fric, k_s, a, n
  // Constant Variables:
  //    y_sat, y, y_w, slope, z, gnd_to_wt, c_r
  // also, ask user for fluxes

  onSubmit = e => {
    this.props.onSubmit()
  }

  static propTypes = {
    handleChange: PropTypes.func
  }

  render() {
    return (
      <>
      <Header title="Data Form" />
      <div className="myForm paddedPage">
        <Form>
          <div className="rand-vars">
            <h4>Random Variables</h4>

              <NumRandVars handleChange={this.props.handleNumVarChange} />
{/* TODO: only show necessary vars for saturated/unsaturated */}
              <Saturation name="sat" label="Soil Saturation" handleChange={this.props.handleSatChange} />

              <RandVar data={this.props.data.randVars.c} name="c" label="C: Soil Cohesion"
                handleChange={this.props.handleRandVarChange} handleDistChange={this.props.handleDistChange} />

              <RandVar data={this.props.data.randVars.c_r} name="c_r" label="C_r: Root Cohesion"
                handleChange={this.props.handleRandVarChange} handleDistChange={this.props.handleDistChange} />

              <RandVar data={this.props.data.randVars.phi} name="phi" label="phi: Effective Angle of Friction"
                handleChange={this.props.handleRandVarChange} handleDistChange={this.props.handleDistChange} />

              <RandVar data={this.props.data.randVars.k_s} name="k_s" label="k_s: Saturated Hydraulic Conductivity"
                handleChange={this.props.handleRandVarChange} handleDistChange={this.props.handleDistChange} />

            {/* <div className="form-group"> */}
              <h5> Van Genuchten's parameters</h5>
              <RandVar data={this.props.data.randVars.a} name="a" label="a"
                handleChange={this.props.handleRandVarChange}
                handleDistChange={this.props.handleDistChange} />
              <RandVar data={this.props.data.randVars.n} name="n" label="n"
                handleChange={this.props.handleRandVarChange}
                handleDistChange={this.props.handleDistChange} />
            {/* </div> */}
          </div>

          <div className="const-vars">
            {/* TODO: plot dist above water table between 0-5 by step of .05 ) let user decide
          get max z and the step */}
              <ConstVar name="gamma" label="gamma: Unit Weight of Soil" handleChange={this.props.handleConstVarChange} />
              <ConstVar name="gamma_w" label="gamma_w: Unit Weight of Water" handleChange={this.props.handleConstVarChange} />
{/* <ConstVar name="y_sat" label="y_sat: Saturated Soil Unit Weight" handleChange={this.props.handleConstVarChange} /> */}
              <ConstVar name="slope" label="Beta: Slope" handleChange={this.props.handleConstVarChange} />
              <ConstVar name="flux" label="q: Flux" handleChange={this.props.handleConstVarChange} />
            {/* ASK: Was told to assume 5 for now, has that changed */}
            {/* <div className="form-group">
              <ConstVar name="Distance from Ground to Water Table" />
            </div> */}
            <H_wtVar />
            <ZVar handleChange={this.props.handleZVarChange} />

          </div>

          <Button variant="primary" type="submit" onClick={this.onSubmit}>
            Submit
          </Button>
        </Form>
      </div>
      </>
    )
  }
}

export default DataFormPage
