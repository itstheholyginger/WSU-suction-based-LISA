import React, { Component } from 'react'
import { Form, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

class ConstVar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0
        }
    }

    static propTypes = {
        handleChange: PropTypes.func,
        name: PropTypes.string,
        label: PropTypes.string
    }

    handleChange = e => {
        this.props.handleChange(this.props.name, e.target.value)
        console.log('in const var change')
    };

    render() {
        // text for a placeholder for each value input field
        return (
            <div className="form-group">
                <Form.Row style={{ width: '300px' }}>
                    <Form.Group as={Col} controlId="formVal" style={{}}>
                        <Form.Label><h6>{this.props.label}</h6></Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            // ASK: currently using step value of 0.0001, should it be higher or lower?
                            step={0.0001}
                            placeholder="Enter value"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                </Form.Row>
            </div>
        )
    }
}

class ZVar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: 'z',
            label: 'Distance Above Water Table (z)',
            max: 0,
            step: 0.5
        }
    }

    static propTypes = {
        handleChange: PropTypes.func
    }

    handleChange = e => {
        var key = e.target.name
        var value = e.target.value
        this.props.handleChange(key, value)
        console.log('in z var change')
    };

    render() {
        return (
            <div className="form-group">
                <h6>Z</h6>
                <Form.Row>
                    <Form.Group as={Col} controlId="form-max">
                        <Form.Label>Max</Form.Label>
                        <Form.Control
                            type="number"
                            min={0.0001}
                            step={0.0001}
                            placeholder="Max Z value"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="form-step">
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
            </div>
        )
    }
}

class NumRandVars extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: 'numVars',
            label: 'Number of Random Variables',
            value: 0
        }
    }

    static propTypes = {
        handleChange: PropTypes.func
    }

    handleChange = e => {
        var val = e.target.value
        this.props.handleChange(val)
        console.log('in numvar change')
    };

    render() {
        return (
            <div className="form-group">
                    <Form.Group as={Col} controlId="form-numVars">
                        <Form.Label>Number of Random Variables</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            placeholder="Enter value"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
            </div>
        )
    }
};

class Saturation extends React.Component {
    static propTypes = {
        handleChange: PropTypes.func
    }

    handleChange = selectedOption => {
        var selected = selectedOption.target.value
        console.log('selected sat: ', selected)
        if (selected === 'true') {
            this.props.handleChange(true)
        } else if (selected === 'false') {
            this.props.handleChange(false)
        }
        console.log('soil is saturated: ', selected)
    }

    render() {
        return (
            <div className="form-group">
                    <Form.Group as={Col} controlId="formDropDown">
                        <Form.Label>Saturation</Form.Label>
                        <Form.Control as="select" className="input" onChange={this.handleChange}>
                            <option value="true" defaultValue>Saturated</option>
                            <option value="false">Unsaturated</option>
                        </Form.Control>
                    </Form.Group>
            </div>
        )
    }
}

export {
    ConstVar,
    NumRandVars,
    ZVar,
    Saturation
}
