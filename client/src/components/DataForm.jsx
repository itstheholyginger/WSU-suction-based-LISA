/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
// eslint-disable-next-line camelcase
import RandVar from './RandVars'
import { ConstVar, NumRandVars, ZVar, Saturation } from './OtherVars'
import PropTypes from 'prop-types'
import Header from './Header'

class DataFormPage extends Component {
    static propTypes = {
        onSubmit: PropTypes.func,
        handleNumVarChange: PropTypes.func,
        handleSatChange: PropTypes.func,
        handleRVChange: PropTypes.func,
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

    // static propTypes = {
    //     handleChange: PropTypes.func
    // }

    render() {
        const sat = this.props.data.sat
        console.log('sat in dataform= ', sat)

        return (
            <>
                <Header title="Data Form" />
                <div className="paddedPage">
                    <div className="myForm">
                        <Form>
                            {/* TODO: only show necessary vars for saturated/unsaturated */}
                            <Form.Row>
                                <Saturation name="sat" label="Soil Saturation" handleChange={this.props.handleSatChange} />
                                <NumRandVars handleChange={this.props.handleNumVarChange} />
                            </Form.Row>
                            <Form.Row>
                                <DataFormSelector sat={sat} data={this.props.data} handleRVChange={this.props.handleRVChange}
                                    handleDistChange={this.props.handleDistChange} handleConstVarChange={this.props.handleConstVarChange}
                                    handleZVarChange={this.props.handleZVarChange}
                                />
                            </Form.Row>

                            <Button variant="primary" type="submit" onClick={this.onSubmit}> Submit </Button>
                        </Form>
                    </div>
                </div>
            </>
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
    }

    render() {
        const sat = this.props.sat

        if (sat === true) {
            return (
                <>
                    <Form.Group as={Col}>

                        <div className="rand-vars">

                            <RandVar data={this.props.data.randVars.c} name="c" label="C: Soil Cohesion"
                                handleChange={this.props.handleRVChange} handleDistChange={this.props.handleDistChange} />

                            <RandVar data={this.props.data.randVars.c_r} name="c_r" label="C_r: Root Cohesion"
                                handleChange={this.props.handleRVChange} handleDistChange={this.props.handleDistChange} />

                            <RandVar data={this.props.data.randVars.phi} name="phi" label="phi: Effective Angle of Friction"
                                handleChange={this.props.handleRVChange} handleDistChange={this.props.handleDistChange} />

                            <RandVar data={this.props.data.randVars.k_s} name="k_s" label="k_s: Saturated Hydraulic Conductivity"
                                handleChange={this.props.handleRVChange} handleDistChange={this.props.handleDistChange} />

                            <h5> Van Genuchten's parameters</h5>
                            <RandVar data={this.props.data.randVars.a} name="a" label="a"
                                handleChange={this.props.handleRVChange}
                                handleDistChange={this.props.handleDistChange} />
                            <RandVar data={this.props.data.randVars.n} name="n" label="n"
                                handleChange={this.props.handleRVChange}
                                handleDistChange={this.props.handleDistChange} />
                            {/* </div> */}
                        </div>
                    </Form.Group>

                    <Form.Group as={Col} >
                        <div className="const-vars">
                            <ConstVar name="gamma" label="gamma: Unit Weight of Soil" handleChange={this.props.handleConstVarChange} />
                            <ConstVar name="gamma_w" label="gamma_w: Unit Weight of Water" handleChange={this.props.handleConstVarChange} />
                            <ConstVar name="slope" label="Beta: Slope" handleChange={this.props.handleConstVarChange} />
                            <ConstVar name="q" label="q: Infiltration" handleChange={this.props.handleConstVarChange} />

                            <ZVar handleChange={this.props.handleZVarChange} />

                        </div>
                    </Form.Group>

                </>
            )
        } else {
            return (
                <>
                    <div className="rand-vars">
                        <RandVar data={this.props.data.randVars.c} name="c" label="C: Soil Cohesion"
                            handleChange={this.props.handleRVChange} handleDistChange={this.props.handleDistChange} />

                        <RandVar data={this.props.data.randVars.c_r} name="c_r" label="C_r: Root Cohesion"
                            handleChange={this.props.handleRVChange} handleDistChange={this.props.handleDistChange} />

                        <RandVar data={this.props.data.randVars.phi} name="phi" label="phi: Effective Angle of Friction"
                            handleChange={this.props.handleRVChange} handleDistChange={this.props.handleDistChange} />

                    </div>

                    <div className="const-vars">
                        <ConstVar name="gamma" label="gamma: Unit Weight of Soil" handleChange={this.props.handleConstVarChange} />
                        <ConstVar name="slope" label="Beta: Slope" handleChange={this.props.handleConstVarChange} />

                        <ZVar handleChange={this.props.handleZVarChange} />

                    </div>
                </>
            )
        }
    }
}

export default DataFormPage
