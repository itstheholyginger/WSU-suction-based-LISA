import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import * as V from 'victory'

class PFbyZ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datapoints: []
        }
    }

    static propTypes = {
        data: PropTypes.object
    };

    componentDidMount = () => {
        const vals = this.props.data
        console.log(vals)
        var dp = []
        for (const key in vals) {
            dp.push({ x: vals[key].probFail, y: key })
        }
        console.log(dp)
        this.setState({ datapoints: dp })
    };

    render() {
        const dp = this.state.datapoints
        console.log('current datapoints: ')
        console.log(dp)
        if (this.state.datapoints.length > 0) {
            return (
                <div className="graph">
                    <h4>Probability of Failure by Depth</h4>
                    <V.VictoryChart
                        domainPadding={20}
                        theme={V.VictoryTheme.material}
                    >
                        <V.VictoryBar data={dp} />
                        <V.VictoryAxis
                            label="Probability of Failure"
                            style={{
                                axisLabel: { padding: 30 }
                            }}
                        />
                        <V.VictoryAxis
                            dependentAxis
                            label="Z: Depth (m)"
                            tickCount={
                                this.state.datapoints.length > 10
                                    ? this.state.datapoints.length / 2
                                    : this.state.datapoints.length
                            }
                            style={{
                                axisLabel: { padding: 40 }
                            }}
                        />
                    </V.VictoryChart>
                </div>
            )
        } else {
            return null
        }
    }
}

export default PFbyZ
