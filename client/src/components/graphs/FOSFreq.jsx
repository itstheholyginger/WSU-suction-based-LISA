import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as V from 'victory'
import Select from 'react-select'

class FOSFrequency extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datapoints: [],
            selected: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    static propTypes = {
        data: PropTypes.object
    };

    componentDidMount = () => {
        // this.initComp(this.)
    };

    setOptions = () => {
        const options = []
        for (const key in this.props.data) {
            options.push({ value: key, label: key })
        }
        return options
    };

    handleChange = e => {
        // e.preventDefault()
        // console.log(e)
        this.setState({
            selected: e.value
        })
    };

    render() {
        // console.log(this.props.data)
        const { selectedOption } = this.state.selected
        const options = this.setOptions()
        console.log(options)

        console.log('current z=')
        console.log('currently selected z = ', this.state.selected)

        return (
            <div>
                {/* <h4> Frequency histogram of the factor of safety values </h4> */}
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
        // this.getData = this.getData.bind(this)
    }

    static propTypes = {
        data: PropTypes.object,
        z: PropTypes.string
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('prex z: ', prevState.z)
        console.log('next z: ', nextProps.z)
        if (nextProps.z !== prevState.z) {
            const z = nextProps.z
            console.log('next z')
            console.log(z)
            // we need to make frequency array
            // for current Z, get fos counts
            console.log(
                'in getDerivedStateFromProps()  current data= ',
                nextProps.data
            )
            const valsArr = nextProps.data[z].fs_vals

            console.log('vals array: ')
            console.log(valsArr)
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
            // this.setState({ datapoints: datapoints })
            return { datapoints: datapoints, z: nextProps.z }
        } else return null
    }

    getCount = () => {
        var max = 0
        const dp = this.state.datapoints
        dp.forEach(x => {
            if (x.y > max) {
                console.log('new max: ', x.y)
                max = x.y
            }
        })
        return max
    };

    render() {
        // const width = this.props.data[Number(this.props.z)].high
        // const dp = this.getData()
        console.log('rendering child!')

        console.log(this.state.datapoints)
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
                        style={{
                            axisLabel: { padding: 30 }
                        }}
                    />
                    <V.VictoryAxis
                        dependentAxis
                        label="Frequency"
                        tickCount={this.getCount()}
                        style={{
                            axisLabel: { padding: 40 }
                        }}
                    />
                </V.VictoryChart>
            </div>
        )
    }
}

export default FOSFrequency
