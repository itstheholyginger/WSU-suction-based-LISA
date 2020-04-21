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

    handleChange = e => {
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
        // var change = {};
        // change[e.target.name] = e.target.value;
        // this.setState(change);
        console.log('in rand var change')
    }

    render() {
        var dist = this.props.data.dist;
        return (
            <div className="form-group">
                <h6>{this.props.label}</h6>
                <Form.Row className="randVarGroup">
                    <Form.Group as={Col} controlId="formDist">
                        <Form.Label> Distribution </Form.Label>
                        <Form.Control as="select" className="input" selectedOption={dist} onChange={this.handleDistChange}>
                            <option value="normal" defaultValue >Normal</option>
                            <option value="uniform">Uniform</option>
                            <option value="bivariate"> Bivariate</option>
                        </Form.Control>
                    </Form.Group>

                    <RandVarDisplayer
                        dist={dist}
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                </Form.Row>
            </div>

        )
    }
}

class RandVarDisplayer extends Component {
    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object,
        dist: PropTypes.string
    };
    render() {
        const dist = this.props.dist;

        switch (dist) {
            case "uniform":
                return (
                    <UniformVar
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                );
                break;
            case "normal":
                return (
                    <NormalVar
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                );
                break;
            case "bivariate":
                return (
                    <Bivariate
                        data={this.props.data}
                        handleChange={this.props.handleChange}
                    />
                );
        }
    }
}


class NormalVar extends Component {
    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object
    };

    handleChange = e => {
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
        console.log('in rand var change')
    };

    render() {
        return (
            <>
                <Form.Group as={Col} controlId="formMean">
                    <Form.Label>Mean</Form.Label>
                    <Form.Control
                        type="text"
                        name="mean"
                        onChange={this.handleChange}
                        placeholder="Enter mean"
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="formStdDev">
                    <Form.Label>Standard Deviation</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter standard deviation"
                        name="stdev"
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group as={Col} className="input" controlId="formMin">
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

                <Form.Group as={Col} className="input" controlId="formMax">
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

            </>
        )
    }
}

class UniformVar extends Component {
    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object
    };

    handleChange = e => {
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
        console.log('in rand var change')
    };

    render() {
        return (
            <>
                <Form.Group as={Col} className="input" controlId="formMin">
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

                <Form.Group as={Col} className="input" controlId="formMax">
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
        )
    }
};

class Saturation extends React.Component {
    static propTypes = {
        handleChange: PropTypes.func,
        name: PropTypes.string,
        label: PropTypes.string
    }

    handleChange = selectedOption => {
        var selected = selectedOption.target.value
        this.props.handleChange(this.props.name, selected)
        console.log('selected: ', selected)
    }

    render() {
        return (
            <div className="form-group">
                <h6>{this.props.label}</h6>
                <Form.Row style={{ width: '300px' }}>
                    <Form.Group as={Col} controlId="formDropDown">
                        <Form.Label></Form.Label>
                        <Form.Control as="select" className="input" onChange={this.handleChange}>
                            <option value="sat" defaultValue>Saturated</option>
                            <option value="unsat">Unsaturated</option>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
            </div>
        )
    }
}

// eslint-disable-next-line camelcase
// class H_wtVar extends React.Component {
//     render() {
//         return (
//             <div className="form-group">
//                 <Form.Row style={{ width: '300px' }}>
//                     <Form.Group as={Col} controlID="formVal">
//                         <Form.Label><h6>H<sub>wt</sub></h6></Form.Label>
//                         <Form.Control
//                             plaintext
//                             readOnly
//                             value="Assuming 5"
//                         />
//                     </Form.Group>
//                 </Form.Row>
//             </ div>
//         )
//     }
// }

export {
    RandVar,
    ConstVar,
    NumRandVars,
    ZVar,
    Saturation
}
