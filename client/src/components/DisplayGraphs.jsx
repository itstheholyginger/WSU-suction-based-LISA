import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tab, Tabs } from 'react-bootstrap'
import FOSFrequency from './graphs/FOSFreq'
import RVDistGraph from './graphs/RVDist'
import PFbyZ from './graphs/PFbyZ'

class DisplayGraphs extends Component {
    static propTypes = {
        data: PropTypes.object,
        apiClient: PropTypes.object
    };

    render() {
        return (
            <div>
                <Tabs defaultActiveKey="probFail/z" id="visualizations">
                    <Tab
                        eventKey="freqHistFos"
                        title="Factor of Safety Frequency Histograms"
                    >
                        <FOSFrequency data={this.props.data.z} />
                    </Tab>
                    <Tab
                        eventKey="freqHistRV"
                        title="Random Variable Frequency Histograms"
                    >
                        <RVDistGraph data={this.props.data.randVars} />
                    </Tab>

                    <Tab
                        eventKey="probFail/z"
                        title="Probablity of Failure by Depth"
                    >
                        <PFbyZ data={this.props.data.z} />
                    </Tab>
                    <Tab eventKey="ss/z" title="Suction Stress by Depth"></Tab>
                    <Tab eventKey="compare" title="RV Comparisons">
                        <li>
                            Scatter Plot of any pair of variables or of a
                            variable and the factor of safety
                        </li>
                    </Tab>
                </Tabs>
                <ul></ul>
            </div>
        )
    }
}

export default DisplayGraphs
