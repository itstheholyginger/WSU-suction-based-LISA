/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react'
import PropType from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import Header from './Header'
import DisplayGraphs from './DisplayGraphs'
import API from './apiClient'
import * as Tables from './tables'
import Loading from './Loading'
import { CSVLink } from 'react-csv'

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

    getGraphDownloadData = () => {
        const data = this.state.data
        var csvData = []
        if (data !== null) {
            const headers = ['z: soil depth from surface (m)', 'probability of failure', 'suction stress (kPa)', 'Se']
            const curZ = data.z
            csvData.push(headers)

            for (const key in curZ) {
                var row = [key, curZ[key].probFail, curZ[key].ss, curZ[key].Se]
                console.log(row)
                csvData.push(row)
            }
        } else {
            csvData = ['Error saving data']
        }
        return csvData
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.getResults().then(res => {
                const newData = res.results
                setTimeout(() => {
                    this.setState({ data: newData, done: true })
                }, 1000)
            })
        }, 1200)
        // this.getDownloadData()
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
                        {/* download button */}
                        {/* <CSVLink data={this.getDownloadData()} >Download data</CSVLink> */}
                    </div>
                </Fragment>
            )
        }
    }
}

export default DisplayPage
