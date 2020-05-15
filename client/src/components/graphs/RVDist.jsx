import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import * as V from 'victory'
import Select from 'react-select'

// data looks like:
/*
randVars: {
    "a": {
        "high": _,
        "low": _,
        "mean": _,
        "stdev": _,
        "vals": [...]
    },
    "c": {...},
    "c_r": {...},
    ...
}
*/

class RVDistGraph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: ''
        }
    }

    static propTypes = {
        data: PropTypes.object
    };

    setOptions = () => {
        const options = []
        for (const key in this.props.data) {
            options.push({ value: key, label: key })
        }
        return options
    };

    handleChange = e => {
        console.log('in handlechange')
        console.log(e)
        const selected = e.value
        console.log('selected: ', selected)
        this.setState({
            selected: selected
        })
    };

    render() {
        const selectedOption = this.state.selected
        // console.log('selected: ', selectedOption)
        const options = this.setOptions()
        console.log(options)

        const curData = this.props.data[selectedOption]
        console.log('curdata: ', curData)
        return (
            <Fragment>
                <div className="dropdown">
                    <Select
                        // defaultValue={options[0]}
                        selectedOption={this.state.selected}
                        options={options}
                        onChange={this.handleChange}
                    />
                </div>
                {selectedOption !== '' ? (
                    <>
                        <RVBar data={this.props.data} rv={selectedOption} />
                    </>
                ) : (
                    <></>
                )}
            </Fragment>
        )
    }
}

// data looks like
/*
randVars: {
    "a": {
        "high": _,
        "low": _,
        "mean": _,
        "stdev": _,
        "vals": [...]
    },
    "c": {...},
    "c_r": {...},
    ...
}
*/
class RVBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datapoints: [],
            rv: ''
        }
    }

    static propTypes = {
        data: PropTypes.object,
        rv: PropTypes.string
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('parent changed, updating state')
        if (nextProps.rv !== prevState.rv) {
            const valsArr = nextProps.data[nextProps.rv].vals
            console.log('\nvalsArr: ')
            console.log(valsArr)
            const freqObj = {}
            valsArr.forEach(x => {
                if (nextProps.rv === 'k_s') {
                    console.log('special case for k_s')
                    if (!freqObj[x]) {
                        freqObj[x] = 1
                    } else {
                        freqObj[x] += 1
                    }
                } else {
                    let rounded = 0.0
                    rounded = x.toFixed(2)
                    if (!freqObj[rounded]) {
                        freqObj[rounded] = 1
                    } else {
                        freqObj[rounded] += 1
                    }
                }
            })

            const datapoints = []
            for (const key in freqObj) {
                datapoints.push({ x: Number(key), y: freqObj[key] })
            }
            // this.setState({ datapoints: datapoints })
            return { datapoints: datapoints, rv: nextProps.rv }
        } else return null
    }

    render() {
        const l = `${this.state.rv} Distribution`
        console.log(l)
        return (
            <div className="graph">
                <h4>Distribution Graph for {this.state.rv}</h4>
                <h5> {this.props.data[this.state.rv].dist}</h5>
                <V.VictoryChart
                    domainPadding={20}
                    overflow="visible"
                    theme={V.VictoryTheme.material}
                >
                    <V.VictoryBar
                        // style={{ data:}}
                        data={this.state.datapoints}
                    />
                    {this.state.rv === 'k_s' ? (
                        <V.VictoryAxis
                            label={this.props.data.unit}
                            style={{
                                axisLabel: { padding: 30 }
                            }}
                            tickFormat={t => t.toExponential(2)}
                        />
                    ) : (
                        <V.VictoryAxis
                            label={this.props.data.unit}
                            style={{
                                axisLabel: { padding: 30 }
                            }}
                        />
                    )}

                    <V.VictoryAxis
                        dependentAxis
                        label="Count"
                        style={{
                            axisLabel: { padding: 40 }
                        }}
                    />
                </V.VictoryChart>
            </div>
        )
    }
}

export default RVDistGraph
