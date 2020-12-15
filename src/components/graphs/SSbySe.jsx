import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as V from 'victory'

class SSbySe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datapoints: []
        }
    }

    static propTypes = {
        sat: PropTypes.bool,
        H_wt: PropTypes.number,
        conf: PropTypes.string,
        data: PropTypes.object
    }

    componentDidMount = () => {
        if (this.props.sat === false) {
            const vals = this.props.data
            var dp = []
            for (const z in vals) {
                dp.push({ x: vals[z].Se, y: -vals[z].ss })
            }
        }

        this.setState({ datapoints: dp })
    };


    getMaxSS = dp => {
        let max = 0
        dp.map(key => {
            if (key.y > max) {
                max = key.y
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
        const maxSS = Math.ceil(this.getMaxSS(dp))
        if (dp.length > 0) {
            const ticks = [...Array(Math.ceil(this.props.H_wt)).keys()]

            return (
                <div className="graph">
                    <h4>Suction Stress vs Se</h4>
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
                            domain={{ x: [0, 1], y: [0, maxSS] }}
                            interpolation="natural"
                        />
                        <V.VictoryAxis
                            label="Se"
                            tickCount={10}
                            style={{
                                axisLabel: { padding: 30 }
                            }}
                        />
                        <V.VictoryAxis
                            dependentAxis
                            label="Suction Stress (-kPa)"
                            tickCount={this.props.H_wt + 1}
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

export default SSbySe
