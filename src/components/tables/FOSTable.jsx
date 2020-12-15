import React, { Component } from 'react'
import PropType from 'prop-types'
import { Table } from 'react-bootstrap'
import { CSVLink } from 'react-csv';

class FOSTable extends Component {
    static propTypes = {
        data: PropType.object,
        conf: PropType.string
    };

    getFSDownloadData = () => {
        const data = this.props.data
        var csvData = []
        if (data !== {} && data !== undefined) {
            const headers = ['z', 'FS low', 'FS high', 'mean', 'stdev', 'probability of failure']
            csvData.push(headers)
            for (const key in data) {
                const fs = data[key]
                const row = [key, fs.low, fs.high, fs.mean, fs.stdev, fs.probFail]
                csvData.push(row)
            }
        } else {
            csvData = ['Error downloading Factor of Safety data!']
        }
        return csvData
    }

    getRows = conf => {
        var list = []
        var sortedZ = []

        for (const key in this.props.data) {
            sortedZ.push(key)
        }
        sortedZ.sort()
        for (var key in sortedZ) {
            var i = sortedZ[key]
            if (conf === 'nondet') {
                list.push(
                    <FSRowDisplay
                        key={i}
                        z={i}
                        data={this.props.data[i]}
                        conf={conf}
                    />
                )
            } else if (conf === 'det') {
                list.push(
                    <FSRowDisplay
                        key={i}
                        z={i}
                        val={this.props.data[i]}
                        conf={conf}
                    />
                )
            }
        }
        return list
    };

    render() {
        const conf = this.props.conf
        const csvData = this.getFSDownloadData()

        if (conf === 'nondet') {
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
                        <tbody>{this.getRows(conf)}</tbody>
                    </Table>
                    <CSVLink data={csvData} >Download Factor of Safety data</CSVLink>
                </div>
            )
        } else if (conf === 'det') {
            return (
                <div className="paddedPage displayTable">
                    <Table striped hover bordered size="sm">
                        <thead>
                            <tr>
                                <th>Z</th>
                                <th>Value</th>
                                <th>Probability of Failure</th>
                            </tr>
                        </thead>
                        <tbody>{this.getRows(conf)}</tbody>
                    </Table>
                </div>
            )
        } else {
            return <p>Error: invalid conf value - {conf}</p>
        }
    }
}

class FSRowDisplay extends React.Component {
    static propTypes = {
        data: PropType.object,
        z: PropType.string,
        conf: PropType.string,
        val: PropType.number
    };

    render() {
        if (this.props.conf === 'nondet') {
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
        } else if (this.props.conf === 'det') {
            return (
                <tr>
                    <td>
                        {' '}
                        <b>{this.props.z}</b>
                    </td>
                    <td>{this.props.val}</td>
                    <td>{this.props.val < 1 ? 0 : 1}</td>
                </tr>
            )
        } else {
            return <p>Error: invalid analysis type</p>
        }
    }
}

export default FOSTable
