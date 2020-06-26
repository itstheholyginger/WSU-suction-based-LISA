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
        // console.log('~~~~ FreqFrequency setOptions ~~~~');
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
        // e.preventDefault()
        // console.log(e)
        this.setState({
            selected: e.value
        })
    };

    render() {
        // console.log(this.props.data)
        console.log('~~~~ FOSFreq ~~~~')
        // console.log('current configuration: ', this.props.conf);
        const options = this.setOptions()
        // console.log(options);

        // console.log('currently selected z = ', this.state.selected);
        // console.log('current data in FOSFrequency: ', this.state.data);

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
        // this.getData = this.getData.bind(this)
    }

    static propTypes = {
        data: PropTypes.object,
        conf: PropTypes.string,
        z: PropTypes.string
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log('~~~~FreqHistFOS getDerivedStateFromProps~~~~');
        // console.log('next state: ', nextProps);
        // console.log('prex z: ', prevState.z);
        // console.log('next z: ', nextProps.z);
        if (nextProps.z !== prevState.z) {
            const z = nextProps.z
            // we need to make frequency array
            // for current Z, get fos counts
            // console.log(
            //     'in getDerivedStateFromProps()  current data= ',
            //     nextProps.data
            // );
            if (nextProps.conf === 'nondet') {
                // console.log('non-deterministic');
                const valsArr = nextProps.data[z].fs_vals

                // console.log('vals array: ');
                // console.log(valsArr);
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
            } else if (nextProps.conf === 'det') {
                // console.log('deterministic');
                const val = nextProps.data[z].toFixed(2)

                // console.log('value = ', val);
                const datapoint = [{ x: Number(z), y: val }]
                // console.log('new datapoint: ', datapoint);
                return { datapoints: datapoint, z: nextProps.z }
            } else {
                console.log(
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
                console.log('new max: ', x.y)
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
        // const width = this.props.data[Number(this.props.z)].high
        // const dp = this.getData()
        // console.log('rendering child!');

        // console.log(this.state.datapoints);

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
