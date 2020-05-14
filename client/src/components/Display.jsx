/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import PropType from 'prop-types'
import { Table, Tabs, Tab } from 'react-bootstrap'
import Header from './Header'
import DisplayGraphs from './DisplayGraphs'

// CREATE TAB. FIRST TO SEE RANDVAR DATA IN TABLE, SECOND TO SEE FS DATA IN TABLE
// remember, we're doing it by z step.

class DisplayPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }
    static propTypes = {
        data: PropType.object
    }

    componentDidMount = () => {
        fetch('/display').then(response =>
            response.json().then(data => {
                console.log(data)
                this.setState({data: data});
            }) )
    }

    render() {
        console.log("what's our data? here it is!", this.props.data)

        if (this.props.data !== null) {
            return (
                <>
                    <Header
                        title="Display"
                    />
                    <div className="paddedPage">
                        <Tabs defaultActiveKey="FS_graphs" id="display-tabs">
                            <Tab eventKey="randVars" title="Random Variables">
                                <DisplayRandVars
                                    // data = {z: {}, randVars: {}}
                                    // sent data = {'c': {}, c_r: {}, ...}
                                    data={this.props.data.randVars}
                                />
                            </Tab>
                            <Tab eventKey="FS" title="Factor of Safety by Z">
                                <DisplayFS
                                    data={this.props.data.z}
                                />
                            </Tab>
                            <Tab eventKey="FS_graphs" title="Visualizations">
                                <DisplayGraphs
                                    data={this.props.data}
                                />
                            </Tab>
                        </Tabs>
                    </div>
                </>
            )
        } else {
            return (<h2>No data received from backend</h2>)
        }

    }
}

class DisplayRandVars extends React.Component {
    static propTypes = {
        data: PropType.object
    }

    render() {
        // console.log('cur data = ', this.props.data)
        return (
            <>
                <div className="paddedPage">
                    <div className="displayTable">
                        <Table striped hover bordered size="sm">
                            <thead>
                                <tr>
                                    <th>Random Variable</th>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th>Mean</th>
                                    <th>Stdev</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* sent data = {'c': {}, c_r: {}, ...} */}
                                <RandVarRowDisplay data={this.props.data.c} label="C: Soil Cohesion (psf)" />
                                <RandVarRowDisplay data={this.props.data.c_r} label="C_r: Root Cohesion (psf)" />
                                <RandVarRowDisplay data={this.props.data.phi} label="phi: Effective Angle of Friction (degrees)" />
                                <RandVarRowDisplay data={this.props.data.k_s} label="k_s: Saturated Hydraulic Conductivity (m/s)" />
                                <RandVarRowDisplay data={this.props.data.a} label="Van Genuchten's a (cm^-1)" />
                                <RandVarRowDisplay data={this.props.data.n} label="Van Genuchten's n" />
                            </tbody>
                        </Table>

                    </div>
                </div>
            </>
        )
    };
};

class RandVarRowDisplay extends React.Component {
    static propTypes = {
        data: PropType.object,
        label: PropType.string,
        name: PropType.string
    }

    render() {
        return (
            <tr>
                <td><b>{this.props.label}</b></td>
                <td>{this.props.data.low}</td>
                <td>{this.props.data.high}</td>
                <td>{this.props.data.mean}</td>
                <td>{this.props.data.stdev}</td>
            </tr>
        )
    }
}

class DisplayFS extends React.Component {
    static propTypes = {
        data: PropType.object
    }

    render() {
        var list = []
        var sortedZ = []

        for (const key in this.props.data) {
            // console.log(key)
            sortedZ.push(key)
        }
        sortedZ.sort()
        for (var key in sortedZ) {
            var i = sortedZ[key]
            // console.log(i)
            list.push(<FSRowDisplay z={i} data={this.props.data[i]} />)
        }

        return (
            <div className="paddedPage displayTable">
                <Table striped hover bordered size="sm">
                    <thead>
                        <tr>
                            <th>Z</th>
                            <th>FS Min</th>
                            <th>FS Max</th>
                            <th>FS Mean</th>
                            <th>FS Stdev</th>
                            <th>Probability of Failure</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </Table>
            </div>
        )
    }
}

class FSRowDisplay extends React.Component {
    static propTypes = {
        data: PropType.object,
        z: PropType.number
    }

    render() {
        return (
            <tr>
                <td> <b>{this.props.z}</b></td>
                <td>{this.props.data.low}</td>
                <td>{this.props.data.high}</td>
                <td>{this.props.data.mean}</td>
                <td>{this.props.data.stdev}</td>
                <td>{this.props.data.probFail}</td>
            </tr>
        )
    }
}

// class DisplayFSGraph extends React.Component {
//     static propTypes = {
//         data: PropType.object
//     }

//     render () {
//         return (
//             <h3>make frequency graphs with FS data</h3>
//         )
//     }
// }

export default DisplayPage
