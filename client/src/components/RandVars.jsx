import React, { Component } from 'react'
import { Form, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

class RandVar extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    static propTypes = {
        handleDistChange: PropTypes.func,
        name: PropTypes.string,
        handleChange: PropTypes.func,
        label: PropTypes.string,
        data: PropTypes.object
    };

    handleDistChange = selectedOption => {
        var selected = selectedOption.target.value
        this.props.handleDistChange(this.props.name, selected)
        console.log('selected: ', selected)
    };

    render() {
        var dist = this.props.data.dist
        return (
            <Form.Row className="formRandVarContainerRow">

                <div className="randVarContainer">
                    <Form.Row className="formLabel">
                        <h6>{this.props.label}</h6>
                    </Form.Row>

                    <Form.Row className="randVarInfo">

                        <Form.Group as={Col} className="col-sm-4" controlId="formDist">
                            <Form.Label> Distribution </Form.Label>
                            <Form.Control as="select" className="input" onChange={this.handleDistChange}>
                                <option value="normal" defaultValue >Truncated Normal</option>
                                <option value="uniform">Uniform</option>
                                <option value="bivariate"> Bivariate Normal</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="col-sm-8">
                            <div className="randVarInputs">
                                <RandVarDisplayer
                                    dist={dist}
                                    name={this.props.name}
                                    data={this.props.data}
                                    handleChange={this.props.handleChange}
                                />
                            </div>

                        </Form.Group>

                    </Form.Row>
                </div>
            </Form.Row >

        )
    }
}

class RandVarDisplayer extends Component {
    // constructor(props) {
    //     super(props)
    //     // this.handleChange = this.han
    // }

    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object,
        dist: PropTypes.string,
        name: PropTypes.string
    };

    render() {
        const dist = this.props.dist

        switch (dist) {
            case 'uniform':
                return (
                    <UniformVar
                        name={this.props.name}
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                )
            case 'normal':
                return (
                    <NormalVar
                        name={this.props.name}
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                )
            case 'bivariate':
                return (
                    <BivariateVar
                        name={this.props.name}
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                )
        }
    }
}

class NormalVar extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object,
        name: PropTypes.string
    };

    handleChange = (e) => {
        console.log('in normal rand var change')
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
    };

    render() {
        return (
            <>
                <Form.Row>
                    <Form.Group as={Col} controlId="formInput">
                        <Form.Label>Mean</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            step={0.0001}
                            name="mean"
                            onChange={this.handleChange.bind(this)}
                            placeholder="Enter mean"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formInput">
                        <Form.Label>Std Dev</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            step={0.0001}
                            placeholder="Enter standard deviation"
                            name="stdev"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} className="input" controlId="formInput">
                        <Form.Label>Low</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            step={0.0001}
                            name="low"
                            onChange={this.handleChange}
                            placeholder="Enter low"
                        />
                    </Form.Group>

                    <Form.Group as={Col} className="input" controlId="formInput">
                        <Form.Label>High</Form.Label>
                        <Form.Control
                            type="number"
                            min={this.props.data.min}
                            step={0.0001}
                            name="high"
                            onChange={this.handleChange}
                            placeholder="Enter high"
                        />
                    </Form.Group>
                </Form.Row>

            </>
        )
    }
}

class UniformVar extends Component {
    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object,
        name: PropTypes.string
    };

    handleChange = e => {
        console.log('in uniform rand var change')
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
    };

    render() {
        return (
            <>
                <Form.Group as={Col} className="input" controlId="formInput">
                    <Form.Label>Min</Form.Label>
                    <Form.Control
                        type="number"
                        min={0}
                        step={0.0001}
                        name="min"
                        onChange={this.handleChange}
                        placeholder="Enter minimum"
                    />
                </Form.Group>

                <Form.Group as={Col} className="input" controlId="formInput">
                    <Form.Label>Max</Form.Label>
                    <Form.Control
                        type="number"
                        min={this.props.data.min}
                        step={0.0001}
                        name="max"
                        onChange={this.handleChange}
                        placeholder="Enter maximum"
                    />
                </Form.Group>
            </>
        )
    }
}

class BivariateVar extends Component {
    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object,
        name: PropTypes.string
    }

    handleChange = (e) => {
        console.log('in bivariate rand var change')
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
    };

    render() {
        return (
            <>
                <Form.Row>
                    <div className='randVarInputCol bivMean'>
                        <Form.Group as={Col} controlId="bivMean">
                            <Form.Label>Mean</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                step={0.0001}
                                name="mean1"
                                onChange={this.handleChange}
                                placeholder="Enter mean"
                            />
                        </Form.Group>
                    </div>
                    <div className='randVarInputCol bivCov'>
                        <Form.Group as={Col} controlId="">
                            <Form.Label>Covariance</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formCov">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        step={0.0001}
                                        name="covX1"
                                        onChange={this.handleChange}
                                        placeholder="Enter X"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formCov">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        step={0.0001}
                                        name="covY1"
                                        onChange={this.handleChange}
                                        placeholder="Enter Y"
                                    />
                                </Form.Group>
                            </Form.Row>

                        </Form.Group>
                    </div>

                </Form.Row>

                <Form.Row>
                    <div className='randVarInputCol bivMean'>
                        <Form.Group as={Col} controlId="bivMean">
                            <Form.Label>Mean</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                step={0.0001}
                                name="mean2"
                                onChange={this.handleChange}
                                placeholder="Enter mean"
                            />
                        </Form.Group>
                    </div>

                    <div className='randVarInputCol bivCov'>
                        <Form.Group as={Col} controlId="">
                            <Form.Label>Covariance</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formCov">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        step={0.0001}
                                        name="covX2"
                                        onChange={this.handleChange}
                                        placeholder="Enter X"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formCov">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        step={0.0001}
                                        name="covY2"
                                        onChange={this.handleChange}
                                        placeholder="Enter Y"
                                    />
                                </Form.Group>
                            </Form.Row>

                        </Form.Group>
                    </div>
                </Form.Row>
            </>
        )
    }
}

export default RandVar
