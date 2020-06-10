import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';
import * as Graphs from './graphs';

class DisplayGraphs extends Component {
    static propTypes = {
        data: PropTypes.object,
        apiClient: PropTypes.object,
    };

    render() {
        console.log('~~~~! DisplayGraphs data: ', this.props.data);
        return (
            <div>
                <Tabs defaultActiveKey="probFail/z" id="visualizations">
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
                        title="Probablity of Failure by Depth"
                    >
                        <Graphs.PFbyZ
                            data={this.props.data.z}
                            conf={this.props.data.conf}
                            H_wt={this.props.data.H_wt}
                        />
                    </Tab>
                    <Tab eventKey="ss/z" title="Suction Stress by Depth">
                        <Graphs.SSbyZ
                            data={this.props.data.z}
                            conf={this.props.data.conf}
                            sat={this.props.data.sat}
                            H_wt={this.props.data.H_wt}
                        />
                    </Tab>
                </Tabs>
                <ul></ul>
            </div>
        );
    }
}

export default DisplayGraphs;
