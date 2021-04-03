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
                csvData.push(row)
            }
        } else {
            csvData = ['Error saving data']
        }
        return csvData
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.getResults().then(r => {
                const newData = r.results
                setTimeout(() => {
                    this.setState({ data: newData, done: true })
                }, 1000)
            })
        }, 2000)
    };

    getResults = async () => {
        this.setState({ loading: true })
        try {
            const res = await API.get('/api/display')

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
            return (
                <Fragment>
                    <Header title="Display" />
                    <div className="paddedPage">
                        <Tabs defaultActiveKey="randVars" id="display-tabs">
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
