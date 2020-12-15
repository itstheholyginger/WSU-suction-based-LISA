import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tab, Tabs } from 'react-bootstrap'
import * as Graphs from './graphs'
import { CSVLink } from 'react-csv'

class DisplayGraphs extends Component {
    static propTypes = {
        data: PropTypes.object,
        apiClient: PropTypes.object
    };

    getGraphDownloadData = () => {
        const data = this.props.data
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

    render() {
        return (
            <div>
                <Tabs defaultActiveKey="freqHistFos" id="visualizations">
                    <Tab
                        eventKey="freqHistFos"
                        title="Factor of Safety Frequency Histograms"
                    >
                        <Graphs.FOSFreq
                            data={this.props.data.z}
                            conf={this.props.data.conf}
                        />
                    </Tab>
                    <Tab
                        eventKey="freqHistRV"
                        title="Random Variable Frequency Histograms"
                    >
                        <Graphs.RVDist
                            data={this.props.data.randVars}
                            conf={this.props.data.conf}
                        />
                    </Tab>

                    <Tab
                        eventKey="probFail/z"
                        title="Depth vs. Probability of Failure"
                    >
                        <Graphs.PFbyZ
                            data={this.props.data.z}
                            conf={this.props.data.conf}
                            H_wt={this.props.data.H_wt}
                        />
                    </Tab>
                    <Tab eventKey="ss/z" title="Depth vs. Suction Stress">
                        <Graphs.SSbyZ
                            data={this.props.data.z}
                            conf={this.props.data.conf}
                            sat={this.props.data.sat}
                            H_wt={this.props.data.H_wt}
                        />
                    </Tab>
                    <Tab eventKey="ss/Se" title="Suction Stress vs. Se">
                        <Graphs.SSbySe
                            data={this.props.data.z}
                            conf={this.props.data.conf}
                            sat={this.props.data.sat}
                            H_wt={this.props.data.H_wt}
                        />
                    </Tab>
                </Tabs>
                <ul></ul>
                <CSVLink data={this.getGraphDownloadData()} >Download all graph data</CSVLink>
            </div>
        )
    }
}

export default DisplayGraphs
