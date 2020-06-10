/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react'
import PropType from 'prop-types'
import {Tabs, Tab } from 'react-bootstrap'
import Header from './Header'
import DisplayGraphs from './DisplayGraphs'
import API from './apiClient'
// import { testing } from '../resources/test_data'
import * as Tables from './tables'

class DisplayPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null
            // data: testing.results
            // data: testing.results_old
        }
    }

    static propTypes = {
        apiClient: PropType.object
    };

    // componentDidMount = () => {
    //   console.log('getting results...')
    //   API.get('/display').then(res => {
    //       console.log(res)
    //       console.log(res.data)
    //       const results = res.data.results[1]
    //       console.log('setting results as state: ', results)
    //       this.setState({ data: results })
    //   })
    // };

    componentDidMount = () => {
        this.getResults().then(res => {
            // console.log(res)
            // console.log(res.results)
            const newData = res.results
            this.setState({ data: newData })
        })
    };

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
        } else {
            return <h2>No data received from backend</h2>
        }
    }
}

export default DisplayPage
