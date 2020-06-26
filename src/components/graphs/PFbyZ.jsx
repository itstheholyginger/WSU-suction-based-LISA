import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as V from 'victory'

class PFbyZ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datapoints: [],
            tickValues: []
        }
    }

    static propTypes = {
        data: PropTypes.object,
        conf: PropTypes.string,
        H_wt: PropTypes.number
    };

    detGetDatapoints = () => {
        const data = this.props.data
        const dp = []
        for (const key in data) {
            if (data[key] >= 1) {
                dp.push({ x: 1, y: key })
            } else {
                dp.push({ x: 0, y: key })
            }
        }
        return dp
    };

    componentDidMount = () => {
        const vals = this.props.data
        var dp = []
        if (this.props.conf === 'nondet') {
            for (const key in vals) {
                console.log('H_ss val = ', key)
                console.log('probFail = ', vals[key].probFail)
                dp.push({ x: vals[key].probFail, y: key })
            }
        } else if (this.props.conf === 'det') {
            dp = this.detGetDatapoints()
        }
        const ticks = this.getTickVals()
        this.setState({ datapoints: dp, tickValues: ticks })
    };

    getTickVals = () => {
        const max = this.props.H_wt
        const ticks = []
        var cur = 0
        while (cur <= max) {
            ticks.push(cur)
            cur += 0.5
        }
        console.log('TICKS!!    ')
        console.log(ticks)
        return ticks
    }

    printTicks(t) {
        console.log('cur t: ', t)
        if (Number(t) % 1 === 0) {
            console.log('tick IS whole num: ', t)
            return Number(t)
        } else {
            console.log('tick is not whole number:  ', t)
            return null
        }
    }

    render() {
        console.log('~~~~ PFbyZ GRAPH ~~~~')
        // console.log('data: ', this.props.data);
        const dp = this.state.datapoints
        console.log('current datapoints: ')
        console.log(dp)
        // const ticks = Array.from(this.getTickVals())
        // console.log("What the ticks should be: ")

        const sharedAxisStyles = {
            tickLabels: {
                fontSize: 12
            },
            axisLabel: {
                padding: 39,
                fontSize: 12,
                fontStyle: 'bold'
            }
        }
        if (dp.length > 0) {
            // if (this.props.conf === 'nondet') {
            return (
                <div className="graph">
                    <h4>Depth vs. Probability of Failure</h4>
                    <V.VictoryChart
                        domainPadding={20}
                        theme={V.VictoryTheme.material}
                        containerComponent={
                            <V.VictoryVoronoiContainer
                                labels={({ datum }) => `${datum.x} ${datum.y}`}
                            />
                        }
                    >
                        <V.VictoryLine
                            style={{
                                data: { stroke: '#c43a31' },
                                parent: { border: '1px solid #ccc' }
                            }}
                            data={dp} />
                        <V.VictoryAxis
                            label="Probability of Failure"
                            style={sharedAxisStyles}
                            orientation="top"
                            tickValues={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
                        />
                        <V.VictoryAxis
                            dependentAxis
                            label="Soil Depth from surface, H_ss (m)"
                            tickCount={this.props.H_wt + 1}
                            tickFormat={t => t}

                            // tickCount={
                            //     this.props.H_wt * 2
                            //     // this.state.datapoints.length > 10
                            //     //     ? this.state.datapoints.length / 2
                            //     //     : this.state.datapoints.length
                            // }
                            style={sharedAxisStyles}
                            invertAxis={true}
                        />
                    </V.VictoryChart>
                </div>
            )
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
            return <h2>no datapoints</h2>
        }
    }
}

export default PFbyZ
