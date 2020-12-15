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
        if (this.props.sat === false) {
            const vals = this.props.data
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

            this.setState({ datapoints: dp })
        }
    };


    getMaxSS = dp => {
        let max = 0
        dp.map(key => {
            if (key.x > max) {
                max = key.x
            }
        })
        return max
    }

    render() {
        const sat = this.props.sat

        if (sat === true) {
            return (
                <h2>
                    This graph is only available for unsaturated soil analysis
                </h2>
            )
        }


        const dp = this.state.datapoints
        if (dp.length > 0) {
            const ticks = [...Array(Math.ceil(this.props.H_wt)).keys()]
            const maxSS = this.getMaxSS(dp)

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
                        <V.VictoryScatter
                            style={{
                                data: { stroke: '#c43a31' },
                                parent: { border: '1px solid #ccc' }
                            }}
                            data={dp}
                            // get x min with func
                            domain={{ x: [0, maxSS], y: [0, this.props.H_wt] }}
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
                            invertAxis={true}
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
