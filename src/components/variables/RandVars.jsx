import React, { Component, Fragment } from 'react'
import { Form, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

class RandVar extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.props.handleDistChange(this.props.name, 'truncnormal')
    }

    static propTypes = {
        handleDistChange: PropTypes.func,
        conf: PropTypes.string,
        name: PropTypes.string,
        label: PropTypes.string,
        handleNondetChange: PropTypes.func,
        handleDetChange: PropTypes.func,
        data: PropTypes.object
    };

    handleDistChange = selectedOption => {
        var selected = selectedOption.target.value
        this.props.handleDistChange(this.props.name, selected)
        console.log('selected: ', selected)
    };

    render() {
        const conf = this.props.conf
        var dist = this.props.data.dist
        if (conf === 'nondet') {
            return (
                <Form.Row className="formRandVarContainerRow">
                    <div className="randVarContainer">
                        <Form.Row className="formLabel">
                            <h6>{this.props.label}</h6>
                        </Form.Row>

                        <Form.Row className="randVarInfo">
                            <Form.Group
                                as={Col}
                                className="col-sm-4"
                                controlId="formDist"
                            >
                                <Form.Label> Distribution </Form.Label>
                                <Form.Control
                                    as="select"
                                    className="input"
                                    onChange={this.handleDistChange}
                                >
                                    <option value="truncnormal" defaultValue>
                                        Truncated Normal
                                    </option>
                                    <option value="lognormal">Lognormal</option>
                                    <option value="trunclognormal">Truncated Lognormal</option>
                                    <option value="uniform">Uniform</option>
                                    <option value="constant">Constant</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} className="col-sm-8">
                                <div className="randVarInputs">
                                    <NondetRandVarDisplayer
                                        dist={dist}
                                        name={this.props.name}
                                        data={this.props.data}
                                        handleChange={
                                            this.props.handleNondetChange
                                        }
                                    />
                                </div>
                            </Form.Group>
                        </Form.Row>
                    </div>
                </Form.Row>
            )
        } else if (conf === 'det') {
            return (
                <Form.Row className="formRandVarContainerRow">
                    <div className="randVarContainer">
                        <Form.Row
                            className="randVarInfo"
                            style={{ width: '50%' }}
                        >
                            <Form.Label> {this.props.label}</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                placeholder="Enter value"
                                onChange={this.handleDetChange}
                            />
                        </Form.Row>
                    </div>
                </Form.Row>
            )
        }
    }
}

// class DetRandVarDisplayer extends Component {
//     static propTypes = {
//         handleChange: PropTypes.func,
//         data: PropTypes.object,
//         name: PropTypes.string
//     }
//     render () {
//         return (
//         )
//     }
// }

class NondetRandVarDisplayer extends Component {
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
            case 'truncnormal':
                return (
                    <TruncNormalVar
                        name={this.props.name}
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                )
            case 'lognormal':
                return (
                    <LognormalVar
                        name={this.props.name}
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                )
            case 'trunclognormal':
                return (
                    <TruncLognormalVar
                        name={this.props.name}
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                )
            case 'constant':
                return (
                    <ConstantVar
                        name={this.props.name}
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                )
            default:
                return (
                    <p>
                        Error: invalid distribution selection
                    </p>
                )
        }
    }
}

class TruncNormalVar extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object,
        name: PropTypes.string
    };

    handleChange = e => {
        console.log('in normal rand var change')
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
    };

    render() {
        return (
            <Fragment>
                <Form.Row>
                    <Form.Group as={Col} controlId="formInput">
                        <Form.Label>Mean</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            step={0.0000000001}
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
                            step={0.0000000001}
                            placeholder="Enter standard deviation"
                            name="stdev"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group
                        as={Col}
                        className="input"
                        controlId="formInput"
                    >
                        <Form.Label>Low</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            step={0.0000000001}
                            name="low"
                            onChange={this.handleChange}
                            placeholder="Enter low"
                        />
                    </Form.Group>

                    <Form.Group
                        as={Col}
                        className="input"
                        controlId="formInput"
                    >
                        <Form.Label>High</Form.Label>
                        <Form.Control
                            type="number"
                            min={this.props.data.low}
                            step={0.0000000001}
                            name="high"
                            onChange={this.handleChange}
                            placeholder="Enter high"
                        />
                    </Form.Group>
                </Form.Row>
            </Fragment>
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
            <Fragment>
                <Form.Group as={Col} className="input" controlId="formInput">
                    <Form.Label>Low</Form.Label>
                    <Form.Control
                        type="number"
                        min={0}
                        step={0.0000000001}
                        name="low"
                        onChange={this.handleChange}
                        placeholder="Enter low"
                    />
                </Form.Group>

                <Form.Group as={Col} className="input" controlId="formInput">
                    <Form.Label>High</Form.Label>
                    <Form.Control
                        type="number"
                        min={this.props.data.low}
                        step={0.000000001}
                        name="high"
                        onChange={this.handleChange}
                        placeholder="Enter high"
                    />
                </Form.Group>
            </Fragment>
        )
    }
}

class LognormalVar extends Component {
    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object,
        name: PropTypes.string
    };

    handleChange = e => {
        console.log('in lognormal rand var change')
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
    };

    render() {
        return (
            <Fragment>
                <Form.Group as={Col} className="input" controlId="formInput">
                    <Form.Label>Logmean</Form.Label>
                    <Form.Control
                        type="number"
                        min={0}
                        step={0.0000000001}
                        name="logmean"
                        onChange={this.handleChange}
                        placeholder="Enter logmean"
                    />
                    <Form.Group as={Col} className="input" controlId="formInput">
                        <Form.Label>Logstdev</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            step={0.0000000001}
                            name="logstdev"
                            onChange={this.handleChange}
                            placeholder="Enter logstdev"
                        />
                    </Form.Group>
                </Form.Group>
            </Fragment>
        )
    }
}

class TruncLognormalVar extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object,
        name: PropTypes.string
    };

    handleChange = e => {
        console.log('in trunc lognormal rand var change')
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
    };

    render() {
        return (
            <Fragment>
                <Form.Row>
                    <Form.Group as={Col} controlId="formInput">
                        <Form.Label>Logmean</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            step={0.0000000001}
                            name="logmean"
                            onChange={this.handleChange.bind(this)}
                            placeholder="Enter logmean"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formInput">
                        <Form.Label>Logstdev</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            step={0.0000000001}
                            placeholder="Enter logstdev"
                            name="logstdev"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group
                        as={Col}
                        className="input"
                        controlId="formInput"
                    >
                        <Form.Label>Low</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            step={0.0000000001}
                            name="low"
                            onChange={this.handleChange}
                            placeholder="Enter low"
                        />
                    </Form.Group>

                    <Form.Group
                        as={Col}
                        className="input"
                        controlId="formInput"
                    >
                        <Form.Label>High</Form.Label>
                        <Form.Control
                            type="number"
                            min={this.props.data.low}
                            step={0.0000000001}
                            name="high"
                            onChange={this.handleChange}
                            placeholder="Enter high"
                        />
                    </Form.Group>
                </Form.Row>
            </Fragment>
        )
    }
}

class ConstantVar extends Component {
    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object,
        name: PropTypes.string
    };

    handleChange = e => {
        console.log('in lognormal rand var change')
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
    };

    render() {
        return (
            <Fragment>
                <Form.Group as={Col} className="input" controlId="formInput">
                    <Form.Label>Value</Form.Label>
                    <Form.Control
                        type="number"
                        min={0}
                        step={0.0000000001}
                        name="const_val"
                        onChange={this.handleChange}
                        placeholder="Enter constant value"
                    />
                </Form.Group>
            </Fragment>
        )
    }
}


export default RandVar
