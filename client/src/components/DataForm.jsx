/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react';
import { Form, Button } from 'react-bootstrap';
import * as Vars from './variables';
import PropTypes from 'prop-types';
import Header from './Header';
import { testing } from '../resources/test_data';
// import { data } from '../resources/test_data';
import AppMode from '../AppMode';
import API from './apiClient';
import LABELS from '../resources/labels';

// Needed Random Variables:
//    c, c_r, phi, k_s, a, n
// Constant Variables:
//    gamme, gamma_w, slope, z_step, H_wt
// also, ask user for fluxes

class DataFormPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // data: data,
            data: testing.data,
        };
    }

    static propTypes = {
        onSubmit: PropTypes.func,
        apiClient: PropTypes.object,
        changeMode: PropTypes.func,
    };

    componentDidMount() {
        if (this.state.data.conf === undefined) {
            const newData = this.state.data;
            this.setState({ data: newData });
        }
    }

    //  handling variable changes in data form when configuration
    handleNondetChange = (varName, key, value) => {
        // console.log(varName, key, value);
        var newData = this.state.data;
        // console.log('old data:\t', newData);
        newData.randVars[varName][key] = value;
        // console.log('var:\t', varName);
        // console.log('\tnew data:\t', newData);
        this.setState({ newData });
    };

    handleDetChange = (varName, val) => {
        // console.log('handling Deterministic Change');
        var newData = this.state.data;
        newData.randVars[varName].detVal = val;
        this.setState({ newData });
    };

    handleDistChange = (varName, selected) => {
        var newData = this.state.data;
        newData.randVars[varName] = {
            dist: selected,
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0,
        };
        this.setState(newData);
        // console.log(varName, 'new dist is: ', selected);
    };

    handleConstVarChange = (varName, value) => {
        var newData = this.state.data;
        newData.constVars[varName] = value;
        this.setState(newData);
    };

    handleNumVarChange = number => {
        var newData = this.state.data;
        newData.numVars = number;
        this.setState(newData);
    };

    handleZVarChange = (key, val) => {
        var newData = this.state.data;
        newData.z[key] = val;
        this.setState(newData);
    };

    handleSatChange = val => {
        var newData = this.state.data;
        newData.sat = val;
        this.setState(newData);
    };

    handleAnalysisChange = val => {
        var newData = this.state.data;
        newData.conf = val;
        this.setState(newData);
    };

    handleFluxChange = (key, val) => {
        var newData = this.state.data;
        newData.constVars.flux[key] = val;

        this.setState(newData);
    };
    handleFluxAdd = () => {
        var newData = this.state.data;
        newData.constVars.flux.append(0);
        this.setState(newData);
    };
    handleFluxRemove = index => {
        var newData = this.state.data;
        if (index > -1) {
            newData.constVars.flux.splice(index, 1);
        }
        this.setState(newData);
    };

    onSubmit = e => {
        console.log(
            "submit has been clicked. attempting to post to '/add_data'"
        );
        console.log('data being sent: ', this.state.data);
        e.preventDefault();
        API.post('/add_data', this.state.data).then(res => {
            console.log(res);
            this.props.changeMode(AppMode.DISPLAY);
        });
    };

    render() {
        return (
            <Fragment>
                <Header title="Data Form" />
                <div className="paddedPage">
                    <div className="myForm">
                        <Form>
                            {/* <Form.Row>
                                <Vars.Saturation
                                    handleChange={this.handleSatChange}
                                />
                                <Vars.Analysis
                                    handleChange={this.handleAnalysisChange}
                                />
                                <Vars.NumRandVars
                                    handleChange={this.handleNumVarChange}
                                />
                            </Form.Row>
                            <Form.Row>
                                <DataFormSelector
                                    data={this.state.data}
                                    handleNondetChange={this.handleNondetChange}
                                    handleDetChange={this.handleDetChange}
                                    handleDistChange={this.handleDistChange}
                                    handleConstVarChange={
                                        this.handleConstVarChange
                                    }
                                    handleFluxChange={this.handleFluxChange}
                                    handleFluxRemove={this.handleFluxRemove}
                                    handleFluxAdd={this.handleFluxAdd}
                                    handleZVarChange={this.handleZVarChange}
                                />
                            </Form.Row> */}

                            <Button variant="primary" onClick={this.onSubmit}>
                                {' '}
                                Submit{' '}
                            </Button>
                        </Form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

class DataFormSelector extends Component {
    static propTypes = {
        handleNondetChange: PropTypes.func,
        handleDetChange: PropTypes.func,
        handleDistChange: PropTypes.func,
        handleConstVarChange: PropTypes.func,
        handleZVarChange: PropTypes.func,
        handleFluxChange: PropTypes.func,
        handleFluxRemove: PropTypes.func,
    };

    render() {
        const sat = this.props.data.sat;
        const conf = this.props.data.conf;
        console.log('sat=', sat);
        console.log('conf=', conf);
        if (sat === false) {
            return (
                <Fragment>
                    <div className="rand-vars">
                        <Vars.RandVar
                            data={this.props.data.randVars.c}
                            conf={conf}
                            name="c"
                            label={LABELS.c}
                            handleNondetChange={this.props.handleNondetChange}
                            handleDetChange={this.props.handleDetChange}
                            handleDistChange={this.props.handleDistChange}
                        />

                        <Vars.RandVar
                            data={this.props.data.randVars.c_r}
                            conf={conf}
                            name="c_r"
                            label={LABELS.c_r}
                            handleNondetChange={this.props.handleNondetChange}
                            handleDetChange={this.props.handleDetChange}
                            handleDistChange={this.props.handleDistChange}
                        />

                        <Vars.RandVar
                            data={this.props.data.randVars.phi}
                            conf={conf}
                            name="phi"
                            label={LABELS.phi}
                            handleNondetChange={this.props.handleNondetChange}
                            handleDetChange={this.props.handleDetChange}
                            handleDistChange={this.props.handleDistChange}
                        />

                        <Vars.RandVar
                            data={this.props.data.randVars.k_s}
                            conf={conf}
                            name="k_s"
                            label={LABELS.k_s}
                            handleNondetChange={this.props.handleNondetChange}
                            handleDetChange={this.props.handleDetChange}
                            handleDistChange={this.props.handleDistChange}
                        />

                        <Vars.RandVar
                            data={this.props.data.randVars.a}
                            conf={conf}
                            name="a"
                            label={LABELS.a}
                            handleNondetChange={this.props.handleNondetChange}
                            handleDetChange={this.props.handleDetChange}
                            handleDistChange={this.props.handleDistChange}
                        />
                        <Vars.RandVar
                            data={this.props.data.randVars.n}
                            conf={conf}
                            name="n"
                            label={LABELS.n}
                            handleNondetChange={this.props.handleNondetChange}
                            handleDetChange={this.props.handleDetChange}
                            handleDistChange={this.props.handleDistChange}
                        />
                    </div>

                    <div className="const-vars">
                        <Vars.ConstVar
                            name="gamma"
                            label={LABELS.gamma}
                            handleChange={this.props.handleConstVarChange}
                        />
                        <Vars.ConstVar
                            name="gamma_w"
                            label={LABELS.gamma_w}
                            handleChange={this.props.handleConstVarChange}
                        />
                        <Vars.ConstVar
                            name="slope"
                            label={LABELS.slope}
                            handleChange={this.props.handleConstVarChange}
                        />
                        <Vars.ConstVar
                            name="q"
                            label={LABELS.q}
                            handleChange={this.props.handleConstVarChange}
                        />
                        {/* <Vars.FluxVar
                            name="flux"
                            label={LABELS.q}
                            handleRemove={this.handleFluxRemove}
                            handleChange={this.handleFluxChange}
                            handleAdd={this.handleAdd}
                        /> */}
                        <Vars.ConstVar
                            name="H_wt"
                            label={LABELS.H_wt}
                            handleChange={this.props.handleConstVarChange}
                        />
                        <Vars.ConstVar
                            name="z_step"
                            label={LABELS.z_step}
                            handleChange={this.props.handleConstVarChange}
                        />
                        {/* <ZVar handleChange={this.props.handleZVarChange} /> */}
                    </div>
                </Fragment>
            );
        } else if (sat === true) {
            return (
                <Fragment>
                    <div className="rand-vars">
                        <Vars.RandVar
                            data={this.props.data.randVars.c}
                            conf={conf}
                            name="c"
                            label={LABELS.c}
                            handleNondetChange={this.props.handleNondetChange}
                            handleDetChange={this.props.handleDetChange}
                            handleDistChange={this.props.handleDistChange}
                        />

                        <Vars.RandVar
                            data={this.props.data.randVars.c_r}
                            conf={conf}
                            name="c_r"
                            label={LABELS.c_r}
                            handleNondetChange={this.props.handleNondetChange}
                            handleDetChange={this.props.handleDetChange}
                            handleDistChange={this.props.handleDistChange}
                        />

                        <Vars.RandVar
                            data={this.props.data.randVars.phi}
                            conf={conf}
                            name="phi"
                            label={LABELS.phi}
                            handleNondetChange={this.props.handleNondetChange}
                            handleDetChange={this.props.handleDetChange}
                            handleDistChange={this.props.handleDistChange}
                        />
                    </div>

                    <div className="const-vars">
                        <Vars.ConstVar
                            name="gamma"
                            label={LABELS.gamma}
                            handleChange={this.props.handleConstVarChange}
                        />
                        <Vars.ConstVar
                            name="gamma_w"
                            label={LABELS.gamma_w}
                            handleChange={this.props.handleConstVarChange}
                        />
                        <Vars.ConstVar
                            name="slope"
                            label={LABELS.slope}
                            handleChange={this.props.handleConstVarChange}
                        />
                        <Vars.ConstVar
                            name="H_wt"
                            label={LABELS.H_wt}
                            handleChange={this.props.handleConstVarChange}
                        />
                        <Vars.ConstVar
                            name="z_step"
                            label={LABELS.z_step}
                            handleChange={this.props.handleConstVarChange}
                        />
                        {/* <ZVar handleChange={this.props.handleZVarChange} /> */}
                    </div>
                </Fragment>
            );
        } else {
            return <h3>Error: invalid configuration</h3>;
        }
    }
}

export default DataFormPage;
