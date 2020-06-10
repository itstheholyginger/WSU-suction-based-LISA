import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as V from 'victory';

class PFbyZ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datapoints: [],
        };
    }

    static propTypes = {
        data: PropTypes.object,
        conf: PropTypes.string,
    };

    detGetDatapoints = () => {
        const data = this.props.data;
        const dp = [];
        for (const key in data) {
            if (data[key] >= 1) {
                dp.push({ x: 1, y: key });
            } else {
                dp.push({ x: 0, y: key });
            }
        }
        return dp;
    };

    componentDidMount = () => {
        const vals = this.props.data;
        // console.log(vals);
        var dp = [];
        if (this.props.conf === 'nondet') {
            for (const key in vals) {
                dp.push({ x: vals[key].probFail, y: key });
            }
        } else if (this.props.conf === 'det') {
            dp = this.detGetDatapoints();
        }

        // console.log(dp);
        this.setState({ datapoints: dp });
    };

    render() {
        console.log('~~~~ PFbyZ GRAPH ~~~~');
        // console.log('data: ', this.props.data);
        const dp = this.state.datapoints;
        console.log('current datapoints: ');
        console.log(dp);
        if (dp.length > 0) {
            // if (this.props.conf === 'nondet') {
            return (
                <div className="graph">
                    <h4>Depth from Surface vs. Probability of Failure</h4>
                    <V.VictoryChart
                        domainPadding={20}
                        theme={V.VictoryTheme.material}
                        containerComponent={
                            <V.VictoryVoronoiContainer
                                labels={({ datum }) => `${datum.x} ${datum.y}`}
                            />
                        }
                    >
                        <V.VictoryScatter data={dp} />
                        <V.VictoryAxis
                            label="Probability of Failure"
                            style={{
                                axisLabel: { padding: 30 },
                            }}
                        />
                        <V.VictoryAxis
                            dependentAxis
                            label="Z: Soil Depth from Surface (m)"
                            tickCount={
                                this.state.datapoints.length > 10
                                    ? this.state.datapoints.length / 2
                                    : this.state.datapoints.length
                            }
                            style={{
                                axisLabel: { padding: 40 },
                            }}
                        />
                    </V.VictoryChart>
                </div>
            );
            // } else if (this.props.conf === 'det') {
            //     return (
            //         <V.VictoryChart
            //             domainPadding={20}
            //             theme={V.VictoryTheme.material}
            //             containerComponent={
            //                 <V.VictoryVoronoiContainer
            //                     labels={({ datum }) => `${datum.x} ${datum.y}`}
            //                 />
            //             }
            //         >
            //             <V.VictoryScatter data={dp} horizontal />
            //             <V.VictoryAxis
            //                 label="Z:Depth (m)"
            //                 tickCount={
            //                     this.state.datapoints.length > 10
            //                         ? this.state.datapoints.length / 2
            //                         : this.state.datapoints.length
            //                 }
            //                 style={{ axisLabel: { padding: 40 } }}
            //             />
            //             <V.VictoryAxis
            //                 dependentAxis
            //                 label="Probability of Failure"
            //                 style={{
            //                     axisLabel: { padding: 30 },
            //                 }}
            //             />
            //         </V.VictoryChart>
            //     );
            // }
        } else {
            return <h2>no datapoints</h2>;
        }
    }
}

export default PFbyZ;
