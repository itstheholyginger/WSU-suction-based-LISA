import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as V from 'victory'

class SSbyZ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datapoints: []
        }
    }

    static propTypes = {
        data: PropTypes.object,
        conf: PropTypes.string,
        sat: PropTypes.bool,
        H_wt: PropTypes.number
    };

    componentDidMount = () => {
        console.log('SSbyZ mounted!')
        console.log('sat = ', this.props.sat)
        if (this.props.sat === false) {
            console.log('SSbyZ Mounting component with unsaturated soil')
            const vals = this.props.data
            console.log(vals)
            var dp = []
            if (this.props.conf === 'nondet') {
                for (const z in vals) {
                    dp.push({ x: -vals[z].ss, y: z })
                    // for (const ss in vals[z].ss_vals) {
                    //     dp.push({ x: vals[z].ss_vals[ss], y: z });
                    // }
                }
            } else if (this.props.conf === 'det') {
                for (const z in vals) {
                    dp.push({ x: -vals[z].ss, y: z })
                }
            }

            console.log(dp)
            this.setState({ datapoints: dp })
        }
    };

    render() {
        console.log('~~~~ SSbyZ GRAPH ~~~~')

        const sat = this.props.sat

        if (sat === true) {
            return (
                <h2>
                    This graph is only available for unsaturated soil analysis
                </h2>
            )
        }

        // console.log('data: ', this.props.data);
        const dp = this.state.datapoints
        console.log('current datapoints: ')
        console.log(dp)
        console.log(dp.length)
        if (dp.length > 0) {
            const ticks = [...Array(Math.ceil(this.props.H_wt)).keys()]
            console.log(ticks)

            return (
                <div className="graph">
                    <h4>Depth vs. Suction Stress</h4>
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
                            data={dp}
                            // get x min with func
                            domain={{ x: [0, 10], y: [0, this.props.H_wt] }}
                            interpolation="natural"
                        />
                        <V.VictoryAxis
                            label="Suction Stress (-kPa)"
                            style={{
                                axisLabel: { padding: 30 }
                            }}
                            orientation="top"
                        />
                        <V.VictoryAxis
                            dependentAxis
                            label="Soil Depth from Surface H_ss (m)"
                            tickCount={this.props.H_wt}
                            tickFormat={t => t}
                            style={{
                                axisLabel: { padding: 40 }
                            }}
                        // invertAxis={true}
                        />
                    </V.VictoryChart>
                </div>
            )
        } else {
            return <h2>no datapoints</h2>
        }
    }
}

export default SSbyZ