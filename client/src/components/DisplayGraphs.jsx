import React, { Component } from 'react'

class DisplayGraphs extends Component {
    render() {
        return (
            <div>
                <h2>Graphs to display</h2>
                <ul>
                    <li>Frequency histogram of the factor of safety values</li>
                    <li>frequency histogram of the values simulated for each variable</li>
                    <li>Scatter Plot of any pair of variables or of a variable and the factor of safety</li>
                </ul>
            </div>
        )
    }
}

export default DisplayGraphs
