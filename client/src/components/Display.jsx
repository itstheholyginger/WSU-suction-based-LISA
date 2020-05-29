/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react'
import PropType from 'prop-types'
import { Table, Tabs, Tab } from 'react-bootstrap'
import Header from './Header'
import DisplayGraphs from './DisplayGraphs'
import API from './apiClient'
import { testing } from '../resources/test_data'
import RVTable from './tables/RVTable'
import LABELS from '../resources/labels'

// CREATE TAB. FIRST TO SEE RANDVAR DATA IN TABLE, SECOND TO SEE FS DATA IN TABLE
// remember, we're doing it by z step.

class DisplayPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // data: null
            data: testing.results
        }
    }

    static propTypes = {
        apiClient: PropType.object
    };

    // componentDidMount = () => {
    //   console.log('getting results...')
    //   API.get('/display').then(res => {
    //       console.log(res)
    //       console.log(res.data)
    //       const results = res.data.results[1]
    //       console.log('setting results as state: ', results)
    //       this.setState({ data: results })
    //   })
    // };

    // componentDidMount = () => {
    //     this.getResults().then(res => {
    //         console.log(res)
    //         console.log(res.results)
    //         const newData = res.results
    //         this.setState({ data: newData })
    //     })
    // };

    // getResults = async () => {
    //     try {
    //         const res = await API.get('/display')
    //         if (res.status === 200) {
    //             console.log(res.status)
    //         }
    //         return res.data
    //     } catch (err) {
    //         console.log(err)
    //     }
    // };

    render() {
        console.log("what's our data? here it is!", this.state.data)

        if (this.state.data !== null) {
            return (
                <Fragment>
                    <Header title="Display" />
                    <div className="paddedPage">
                        <Tabs defaultActiveKey="randVars" id="display-tabs">
                            <Tab eventKey="randVars" title="Random Variables">
                                <RVTable
                                    data={this.state.data.randVars}
                                    sat={this.state.data.sat}
                                    conf={this.state.data.conf}
                                />
                            </Tab>
                            <Tab eventKey="FS" title="Factor of Safety by Z">
                                <DisplayFS data={this.state.data.z} />
                            </Tab>
                            <Tab eventKey="FS_graphs" title="Visualizations">
                                <DisplayGraphs data={this.state.data} />
                            </Tab>
                        </Tabs>
                    </div>
                </Fragment>
            )
        } else {
            return <h2>No data received from backend</h2>
        }
    }
}

class DisplayFS extends React.Component {
    static propTypes = {
        data: PropType.object
    };

    render() {
        var list = []
        var sortedZ = []

        for (const key in this.props.data) {
            // console.log(key)
            sortedZ.push(key)
        }
        sortedZ.sort()
        for (var key in sortedZ) {
            var i = sortedZ[key]
            // console.log(i)
            list.push(<FSRowDisplay key={i} z={i} data={this.props.data[i]} />)
        }

        return (
            <div className="paddedPage displayTable">
                <Table striped hover bordered size="sm">
                    <thead>
                        <tr>
                            <th>Z</th>
                            <th>FS Low</th>
                            <th>FS High</th>
                            <th>FS Mean</th>
                            <th>FS Stdev</th>
                            <th>Probability of Failure</th>
                        </tr>
                    </thead>
                    <tbody>{list}</tbody>
                </Table>
            </div>
        )
    }
}

class FSRowDisplay extends React.Component {
    static propTypes = {
        data: PropType.object,
        z: PropType.string
    };

    render() {
        return (
            <tr>
                <td>
                    {' '}
                    <b>{this.props.z}</b>
                </td>
                <td>{this.props.data.low}</td>
                <td>{this.props.data.high}</td>
                <td>{this.props.data.mean}</td>
                <td>{this.props.data.stdev}</td>
                <td>{this.props.data.probFail}</td>
            </tr>
        )
    }
}

export default DisplayPage
