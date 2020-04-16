import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { XYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis'

class DisplayGraphs extends Component {
    static propTypes = {
        data: PropTypes.object
    };

    render() {
        return (
            <div>
                <h2>Graphs to display</h2>
                <ul>
                    <li>Frequency histogram of the factor of safety values</li>
                    <FOSFrequency data={this.props.data.z} />
                    <li>frequency histogram of the values simulated for each variable</li>
                    <li>Scatter Plot of any pair of variables or of a variable and the factor of safety</li>
                </ul>
                <script>
                    console.log(this.prop.data)
                </script>
            </div>
        )
    }
}

class FOSFrequency extends Component {
    static propTypes = {
        data: PropTypes.object
    };

    render() {
        const first = this.props.data[0.0]
        console.log(this.props.data)
        return (
            < div >
                <h3>fos frequency</h3>
                <XYPlot width={first.high} height={20}>
                    <XAxis>Factor of Safety</XAxis>
                    <YAxis>Count</YAxis>
                    <VerticalBarSeries
                        data={this.getData()}
                    />
                </XYPlot>
            </div >
        )
    }
}
export default DisplayGraphs
