/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react'
import PropType from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import Header from './Header'
import DisplayGraphs from './DisplayGraphs'
import API from './apiClient'
import * as Tables from './tables'
import Loading from './Loading'

class DisplayPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            loading: undefined,
            done: undefined
            // data: testing.results
        }
    }

    static propTypes = {
        apiClient: PropType.object
    };

    // componentDidMount = () => {
    //     console.log('getting results...')
    //     API.get('/api/display').then(res => {
    //         console.log(res)
    //         console.log(res.data)
    //         const results = res.data.results[1]

    //         console.log('rounding results to appropriate significant figures')

    //         this.roundResults(results)
    //         console.log('setting results as state: ', results)
    //         this.setState({ data: results })
    //     })
    // };

    // roundResults = res => {
    //     console.log('In roundResults. res = ', res)
    //     // rounding randVars correctly
    //     // arrs for each significant figure
    //     const one = ['c', 'c_r', 'phi']
    //     const three = ['a', 'n']
    //     const enTwo = ['k_s']
    //     // collect keys from randVar obj
    //     const keys = []
    //     for (const key in res.randVars) {
    //         // eslint-disable-next-line no-prototype-builtins
    //         if (res.randVars.hasOwnProperty(key)) keys.push(key)
    //     }
    //     console.log('keys: ', keys)
    //     let sig = 0

    //     keys.forEach(e => {
    //         console.log('current key = ', e)
    //         if (one.includes(e)) {
    //             sig = 1
    //         } else if (three.includes(e)) {
    //             sig = 3
    //         } else if (enTwo.includes(e)) {
    //             sig = -1
    //         }
    //         res.randVars[e] = this.roundRandVar(res.randVars[e], sig)
    //     })
    // };

    // roundRandVar = (rv, sig) => {
    //     console.log('rounding rv: ', rv)
    //     const newRv = rv
    //     if (sig === -1) {
    //         console.log('k_s')
    //         newRv.high = isNaN(rv.high) ? rv.high : rv.high.toExponential(2)
    //         newRv.low = isNaN(rv.low) ? rv.low : rv.low.toExponential(2)
    //         newRv.mean = isNaN(rv.mean) ? rv.mean : rv.mean.toExponential(2)
    //         newRv.stdev = isNaN(rv.stdev)
    //             ? rv.stdev
    //             : rv.stdev.toExponential(2)
    //         for (let i = 0; i < rv.vals.length; i++) {
    //             newRv.vals[i] = rv.vals[i].toExponential(2)
    //         }
    //     } else {
    //         const mult = Math.pow(10, sig)
    //         console.log('mult = ', mult)
    //         newRv.high = Math.round((rv.high + Number.EPSILON) * mult) / mult
    //         newRv.low = Math.round((rv.low + Number.EPSILON) * mult) / mult
    //         newRv.mean = Math.round((rv.mean + Number.EPSILON) * mult) / mult
    //         newRv.stdev = Math.round((rv.stdev + Number.EPSILON) * mult) / mult
    //         for (let i = 0; i < rv.vals.length; i++) {
    //             newRv.vals[i] =
    //                 Math.round((rv.vals[i] + Number.EPSILON) * mult) / mult
    //         }
    //     }

    //     return newRv
    // };

    componentDidMount = () => {
        setTimeout(() => {
            this.getResults().then(res => {
                const newData = res.results
                setTimeout(() => {
                    this.setState({ data: newData, done: true })
                }, 1000)
            })
        }, 1200)
    };

    getResults = async () => {
        this.setState({ loading: true })
        try {
            const res = await API.get('/api/display')
            if (res.status === 200) {
                console.log(res.status)
            }
            return res.data
        } catch (err) {
            console.log(err)
        }
    };

    render() {
        if (!this.state.done) {
            return (
                <Loading loading={this.state.loading} />
            )
        } else {
            console.log("what's our data? here it is!", this.state.data)
            return (
                <Fragment>
                    <Header title="Display" />
                    <div className="paddedPage">
                        <Tabs defaultActiveKey="graphs" id="display-tabs">
                            <Tab eventKey="randVars" title="Random Variables">
                                <Tables.RVTable
                                    data={this.state.data.randVars}
                                    sat={this.state.data.sat}
                                    conf={this.state.data.conf}
                                />
                            </Tab>
                            <Tab eventKey="FS" title="Factor of Safety by Z">
                                <Tables.FOSTable
                                    data={this.state.data.z}
                                    conf={this.state.data.conf}
                                />
                            </Tab>
                            <Tab eventKey="graphs" title="Visualizations">
                                <DisplayGraphs data={this.state.data} />
                            </Tab>
                        </Tabs>
                    </div>
                </Fragment>
            )
        }
    }
}

export default DisplayPage
