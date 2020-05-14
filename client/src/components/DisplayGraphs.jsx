import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as V from 'victory'
import { Tab, Tabs } from 'react-bootstrap'
import Select from 'react-select'

class DisplayGraphs extends Component {
    static propTypes = {
        data: PropTypes.object,
        apiClient: PropTypes.object
    };

    render() {
        return (
            <div>
                <Tabs id='visualizations' >
                    <Tab eventKey='freqHistFos' title='Factor of Safety Frequency Histograms'>
                        <h4>Frequency histogram of the factor of safety values</h4>
                        <FOSFrequency data={this.props.data.z} />
                    </Tab>
                    <Tab eventKey='freqHistRV' title='Random Variable Frequency Histograms'>
                        <li>frequency histogram of the values simulated for each variable</li>
                    </Tab>
                    <Tab eventKey='scatterPlots' title='Scatter Plot Comparisons'>
                        <li>Scatter Plot of any pair of variables or of a variable and the factor of safety</li>
                    </Tab>
                    <Tab eventKey="probFail/z" title="Probablity of Failure by Depth">

                    </Tab>
                    <Tab eventKey="ss/z" title="Suction Stress by Depth"></Tab>
                </Tabs>
                <ul>
                </ul>
                {/* <script>
                    console.log(this.prop.data)
                </script> */}
            </div>
        )
    }
}

class FOSFrequency extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datapoints: [],
            selected: '0.0'
        }
        this.handleChange = this.handleChange.bind(this)
    }

    static propTypes = {
        data: PropTypes.object
    };

    componentDidMount = () => {
        // this.initComp(this.)
    }

    setOptions = () => {
        const options = []
        for (const key in this.props.data) {
            options.push({ value: key, label: key })
        }
        return options
    }

    handleChange = (e) => {
        // e.preventDefault()
        // console.log(e)
        this.setState({
            selected: e.value
        })
    }

    render() {
        // console.log(this.props.data)
        const { selectedOption } = this.state.selected
        const options = this.setOptions()
        console.log(options)

        console.log('current z=')
        console.log('currently selected z = ', this.state.selected)

        return (
            <div >

                <div className="dropdown">
                    <Select
                        value={selectedOption}
                        options={options}
                        onChange={this.handleChange}
                    />
                </div>
                <FreqHistFOS
                    z={this.state.selected}
                    data={this.props.data}
                />
            </div>
        )
    }
}

class FreqHistFOS extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datapoints: [],
            z: 0
        }
        // this.getData = this.getData.bind(this)
    }

    static propTypes = {
        data: PropTypes.object,
        z: PropTypes.string
    };

    // componentDidMount = () => {
    //     // this.initComp(this.props.z)
    //     this.getData()
    // }

    // componentDidUpdate = () => {
    //     this.getData()
    // }

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
            valsArr.forEach((x) => {
                const rounded = x.toFixed(3)
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
            return ({ datapoints: datapoints })
        } else return null
    }

    // getData = () => {
    //     console.log('current z')
    //     console.log(this.props.z)
    //     // we need to make frequency array
    //     // for current Z, get fos counts
    //     console.log('in getData()  current data= ', this.props.data)
    //     const valsArr = this.props.data[this.props.z].fs_vals

    //     console.log('vals array: ')
    //     console.log(valsArr)
    //     const freqObj = {}
    //     valsArr.forEach(x => {
    //         const rounded = x.toFixed(3)
    //         if (!freqObj[rounded]) {
    //             freqObj[rounded] = 1
    //         } else {
    //             freqObj[rounded] += 1
    //         }
    //     })

    //     const datapoints = []
    //     for (const key in freqObj) {
    //         datapoints.push({ x: Number(key), y: freqObj[key] })
    //     }
    //     this.setState({ datapoints: datapoints })
    //     return datapoints
    // }

    // loadGraph = () => {
    //     const dp = this.getData()
    //     this.setState({ datapoints: dp })
    // }

    render() {
        // const width = this.props.data[Number(this.props.z)].high
        // const dp = this.getData()
        console.log('rendering child!')
        return (

            < div className='freqHist' >
                <V.VictoryChart domainPadding={20}
                    containerComponent={
                        <V.VictoryVoronoiContainer
                            labels={({ datum }) => `${datum.x} ${datum.y}`}
                        />}
                >

                    <V.VictoryBar
                        data={this.state.datapoints}
                    />

                    <V.VictoryLabel
                        text='Factor of Safety'
                        textAnchor='start'
                        verticalAnchor='middle'
                        x={1}
                    />

                </V.VictoryChart>
            </div >
        )
    }
}

export default DisplayGraphs
