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
        console.log('SSbySe mounted!')
        console.log('sat = ', this.props.sat)
        if (this.props.sat === false) {
            console.log('SSbySe Mounting component with unsaturated soil')
            const vals = this.props.data
            console.log(vals)
            var dp = []
            for (const z in vals) {
                dp.push({ x: vals[z].Se, y: -vals[z].ss })
            }
        }

        console.log(dp)
        this.setState({ datapoints: dp })
    };

    render() {
        console.log('~~~~ SSbySe GRAPH ~~~~')

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
                        <V.VictoryLine
                            style={{
                                data: { stroke: '#c43a31' },
                                parent: { border: '1px solid #ccc' }
                            }}
                            data={dp}
                            // get x min with func
                            domain={{ x: [0, 1], y: [0, 10] }}
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
