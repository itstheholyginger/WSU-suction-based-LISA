/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react'
import PropType from 'prop-types'
import { Table, Tabs, Tab } from 'react-bootstrap'
import Header from './Header'
import DisplayGraphs from './DisplayGraphs'
import API from './apiClient'
import { testing } from '../resources/test_data'

// CREATE TAB. FIRST TO SEE RANDVAR DATA IN TABLE, SECOND TO SEE FS DATA IN TABLE
// remember, we're doing it by z step.

class DisplayPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null
            // data: testing.results
        }
    }

    static propTypes = {
        apiClient: PropType.object
    };

    componentDidMount = () => {
        console.log('getting results...')
        API.get('/display').then(res => {
            console.log(res)
            console.log(res.data)
            const results = res.data.results[1]

            console.log('rounding results to appropriate significant figures')

            this.roundResults(results)
            console.log('setting results as state: ', results)
            this.setState({ data: results })
        })
    };

    roundResults = res => {
        console.log('In roundResults. res = ', res)
        // rounding randVars correctly
        // arrs for each significant figure
        const one = ['c', 'c_r', 'phi']
        const three = ['a', 'n']
        const enTwo = ['k_s']
        // collect keys from randVar obj
        const keys = []
        for (const key in res.randVars) {
            // eslint-disable-next-line no-prototype-builtins
            if (res.randVars.hasOwnProperty(key)) keys.push(key)
        }
        console.log('keys: ', keys)
        let sig = 0

        keys.forEach(e => {
            console.log('current key = ', e)
            if (one.includes(e)) {
                sig = 1
            } else if (three.includes(e)) {
                sig = 3
            } else if (enTwo.includes(e)) {
                sig = -1
            }
            res.randVars[e] = this.roundRandVar(res.randVars[e], sig)
        })
    };

    roundRandVar = (rv, sig) => {
        console.log('rounding rv: ', rv)
        const newRv = rv
        if (sig === -1) {
            console.log('k_s')
            newRv.high = isNaN(rv.high) ? rv.high : rv.high.toExponential(2)
            newRv.low = isNaN(rv.low) ? rv.low : rv.low.toExponential(2)
            newRv.mean = isNaN(rv.mean) ? rv.mean : rv.mean.toExponential(2)
            newRv.stdev = isNaN(rv.stdev)
                ? rv.stdev
                : rv.stdev.toExponential(2)
            for (let i = 0; i < rv.vals.length; i++) {
                newRv.vals[i] = rv.vals[i].toExponential(2)
            }
        } else {
            const mult = Math.pow(10, sig)
            console.log('mult = ', mult)
            newRv.high = Math.round((rv.high + Number.EPSILON) * mult) / mult
            newRv.low = Math.round((rv.low + Number.EPSILON) * mult) / mult
            newRv.mean = Math.round((rv.mean + Number.EPSILON) * mult) / mult
            newRv.stdev = Math.round((rv.stdev + Number.EPSILON) * mult) / mult
            for (let i = 0; i < rv.vals.length; i++) {
                newRv.vals[i] =
                    Math.round((rv.vals[i] + Number.EPSILON) * mult) / mult
            }
        }

        return newRv
    };

    // componentDidMount = () => {
    //     this.getResults().then(res => {
    //         console.log(res)
    //         console.log(res.results)
    //         const newData = res.results[1]
    //         this.setState({ data: newData })
    //     })
    // };

    getResults = async () => {
        try {
            const res = await API.get('/display')
            if (res.status === 200) {
                console.log(res.status)
            }
            return res.data
        } catch (err) {
            console.log(err)
        }
    };

    render() {
        console.log("what's our data? here it is!", this.state.data)

        if (this.state.data !== null) {
            return (
                <Fragment>
                    <Header title="Display" />
                    <div className="paddedPage">
                        <Tabs defaultActiveKey="FS_graphs" id="display-tabs">
                            <Tab eventKey="randVars" title="Random Variables">
                                <DisplayRandVars
                                    data={this.state.data.randVars}
                                />
                            </Tab>
                            <Tab eventKey="FS" title="Factor of Safety by Z">
                                <DisplayFS data={this.state.data.z} />
                            </Tab>
                            <Tab eventKey="FS_graphs" title="Visualizations">
                                <DisplayGraphs data={this.state.data} />
                            </Tab>
                        </Tabs>
                    </div>
                </Fragment>
            )
        } else {
            return <h2>No data received from backend</h2>
        }
    }
}

class DisplayRandVars extends React.Component {
    static propTypes = {
        data: PropType.object
    };

    render() {
        console.log('cur data = ', this.props.data)
        return (
            <Fragment>
                <div className="paddedPage">
                    <div className="displayTable">
                        <Table striped hover bordered size="sm">
                            <thead>
                                <tr>
                                    <th>Random Variable</th>
                                    <th>Low</th>
                                    <th>High</th>
                                    <th>Mean</th>
                                    <th>Stdev</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* sent data = {'c': {}, c_r: {}, ...} */}
                                <RandVarRowDisplay
                                    data={this.props.data.c}
                                    label="C: Soil Cohesion (kPa)"
                                />
                                <RandVarRowDisplay
                                    data={this.props.data.c_r}
                                    label="C_r: Root Cohesion (kPa)"
                                />
                                <RandVarRowDisplay
                                    data={this.props.data.phi}
                                    label="phi: Effective Angle of Friction (deg)"
                                />
                                <RandVarRowDisplay
                                    data={this.props.data.k_s}
                                    label="k_s: Saturated Hydraulic Conductivity (m/s)"
                                />
                                <RandVarRowDisplay
                                    data={this.props.data.a}
                                    label="Van Genuchten's a (1/kPa)"
                                />
                                <RandVarRowDisplay
                                    data={this.props.data.n}
                                    label="Van Genuchten's n"
                                />
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Fragment>
        )
    }
}

class RandVarRowDisplay extends React.Component {
    static propTypes = {
        data: PropType.object,
        label: PropType.string,
        name: PropType.string
    };

    render() {
        return (
            <tr>
                <td>
                    <b>{this.props.label}</b>
                </td>
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
    };

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
            list.push(<FSRowDisplay key={i} z={i} data={this.props.data[i]} />)
        }

        return (
            <div className="paddedPage displayTable">
                <Table striped hover bordered size="sm">
                    <thead>
                        <tr>
                            <th>Z</th>
                            <th>FS Low</th>
                            <th>FS High</th>
                            <th>FS Mean</th>
                            <th>FS Stdev</th>
                            <th>Probability of Failure</th>
                        </tr>
                    </thead>
                    <tbody>{list}</tbody>
                </Table>
            </div>
        )
    }
}

class FSRowDisplay extends React.Component {
    static propTypes = {
        data: PropType.object,
        z: PropType.string
    };

    render() {
        return (
            <tr>
                <td>
                    {' '}
                    <b>{this.props.z}</b>
                </td>
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
