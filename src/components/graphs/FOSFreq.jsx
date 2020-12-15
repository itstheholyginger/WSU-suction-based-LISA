import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as V from 'victory'
import Select from 'react-select'

class FOSFreq extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datapoints: [],
            selected: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    static propTypes = {
        data: PropTypes.object,
        conf: PropTypes.string
    };

    componentDidMount = () => {
        // this.initComp(this.)
    };

    setOptions = () => {
        const options = []

        // sort options
        var sorted = []
        for (const key in this.props.data) {
            sorted.push(key)
        }

        sorted.sort()
        sorted.forEach(e => {
            options.push({ value: e, label: e })
        })

        return options
    };

    handleChange = e => {
        this.setState({
            selected: e.value
        })
    };

    render() {
        const options = this.setOptions()
        return (
            <div>
                <div className="dropdown">
                    <Select
                        selectedOption={this.state.selected}
                        options={options}
                        onChange={this.handleChange}
                    />
                </div>
                {this.state.selected !== '' ? (
                    <>
                        <FreqHistFOS
                            z={this.state.selected}
                            data={this.props.data}
                            conf={this.props.conf}
                        />
                    </>
                ) : (
                        <></>
                    )}
            </div>
        )
    }
}

class FreqHistFOS extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datapoints: [],
            z: ''
        }
    }

    static propTypes = {
        data: PropTypes.object,
        conf: PropTypes.string,
        z: PropTypes.string
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.z !== prevState.z) {
            const z = nextProps.z
            if (nextProps.conf === 'nondet') {
                const valsArr = nextProps.data[z].fs_vals

                const freqObj = {}
                valsArr.forEach(x => {
                    const rounded = x.toFixed(2)
                    if (!freqObj[rounded]) {
                        freqObj[rounded] = 1
                    } else {
                        freqObj[rounded] += 1
                    }
                })

                const datapoints = []
                for (const key in freqObj) {
                    datapoints.push({ x: Number(key), y: freqObj[key] })
                }
                return { datapoints: datapoints, z: nextProps.z }
            } else if (nextProps.conf === 'det') {
                const val = nextProps.data[z].toFixed(2)

                const datapoint = [{ x: Number(z), y: val }]
                return { datapoints: datapoint, z: nextProps.z }
            } else {
                console.error(
                    'ERROR: incorrect configuration type: ',
                    nextProps.conf
                )
            }
        } else return null
    }

    getCount = () => {
        var max = 0
        const dp = this.state.datapoints
        dp.forEach(x => {
            if (x.y > max) {
                max = x.y
            }
        })

        // example: max = 41
        // want [5, 10, 15, 20, 25, 30, 35, 40]
        const list = []
        for (var i = 0; i < max; i++) {
            if (i % 5 === 0) {
                list.push(i)
            }
        }
        return list
    };

    render() {
        return (
            <div className="graph">
                <V.VictoryChart
                    theme={V.VictoryTheme.material}
                    domainPadding={20}
                    containerComponent={
                        <V.VictoryVoronoiContainer
                            labels={({ datum }) => `${datum.x} ${datum.y}`}
                        />
                    }
                >
                    <V.VictoryBar data={this.state.datapoints} />
                    <V.VictoryAxis
                        label="Factor of Safety"
                        tickValues={[1]}
                        tickFormat={t => t}
                        style={{
                            axisLabel: { padding: 30 }
                        }}
                    />
                    <V.VictoryAxis
                        dependentAxis
                        label="Frequency"
                        tickCount={this.getCount().length}
                        style={{
                            axisLabel: { padding: 40 }
                        }}
                    />
                </V.VictoryChart>
            </div>
        )
    }
}

export default FOSFreq
