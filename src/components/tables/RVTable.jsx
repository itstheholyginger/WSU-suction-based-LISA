import React, { Component, Fragment } from 'react'
import PropType from 'prop-types'
import { Table } from 'react-bootstrap'
import LABELS from '../../resources/labels'
import { CSVLink } from 'react-csv';

class RVTable extends Component {
    static propTypes = {
        data: PropType.object,
        sat: PropType.bool,
        conf: PropType.string
    };

    getRVDownloadData = () => {
        const data = this.props.data
        var csvData = []
        if (data !== {} && data !== undefined) {
            const headers = ['variable name', 'low', 'high', 'mean', 'stdev']
            csvData.push(headers)
            for (const key in data) {
                const rv = data[key]
                const row = [key, rv.low, rv.high, rv.mean, rv.stdev]
                csvData.push(row)
            }
        } else {
            csvData = ['Error saving random variable data']
        }
        return csvData
    }

    detRows = sat => {
        if (sat === true) {
            return (
                <Fragment>
                    <RandVarRowDisplayDet
                        data={this.props.data.c}
                        label={LABELS.c}
                    />
                    <RandVarRowDisplayDet
                        data={this.props.data.c_r}
                        label={LABELS.c_r}
                    />
                    <RandVarRowDisplayDet
                        data={this.props.data.phi}
                        label={LABELS.phi}
                    />
                </Fragment>
            )
        } else if (sat === false) {
            return (
                <Fragment>
                    <RandVarRowDisplayDet
                        data={this.props.data.c}
                        label={LABELS.c}
                    />
                </Fragment>
            )
        }
    };

    getRows = (vars, conf) => {
        const list = []
        for (let key in vars) {
            key = vars[key]
            var i = this.props.data[key]

            if (conf === 'det') {
                list.push(
                    <RandVarRowDisplayDet
                        key={key}
                        rv={key}
                        value={this.props.data[key]}
                        label={LABELS[key]}
                    />
                )
            } else if (conf === 'nondet') {
                list.push(
                    <RandVarRowDisplayNondet
                        key={key}
                        rv={key}
                        data={this.props.data[key]}
                        label={LABELS[key]}
                    />
                )
            } else {
                list.push(<p>Error: invalid Analysis Type</p>)
            }
        }
        return list
    };

    getTable = (sat, conf) => {
        var vars = []

        sat === true
            ? (vars = ['c', 'c_r', 'phi'])
            : (vars = ['c', 'c_r', 'phi', 'k_s', 'a', 'n'])

        if (conf === 'det') {
            return (
                <Fragment>
                    <Table striped hover bordered size="sm">
                        <thead>
                            <tr>
                                <th>Random Variable</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>{this.getRows(vars, conf)}</tbody>
                    </Table>
                </Fragment>
            )
        } else if (conf === 'nondet') {
            return (
                <Fragment>
                    <Table striped hover bordered size="sm">
                        <thead>
                            <tr>
                                <th>Random Variable</th>
                                <th>Low</th>
                                <th>High</th>
                                <th>Mean</th>
                                <th>Stdev</th>
                            </tr>
                        </thead>
                        <tbody>{this.getRows(vars, conf)}</tbody>
                    </Table>
                </Fragment>
            )
        }
    };

    render() {
        const sat = this.props.sat
        const conf = this.props.conf

        const table = this.getTable(sat, conf)

        const csvData = this.getRVDownloadData()

        return (
            <Fragment>
                <div className="paddedPage">
                    <div className="displayTable">{table}</div>
                    <CSVLink data={csvData} >Download Variable Data</CSVLink>
                </div>
            </Fragment>
        )
    }
}

class RandVarRowDisplayDet extends Component {
    static propTypes = {
        value: PropType.number,
        label: PropType.string,
        key: PropType.string
    };

    render() {
        if (this.props.key === 'k_s') {
            return (
                <tr>
                    <td>
                        <b>{this.props.label}</b>
                    </td>
                    <td>{this.props.value.toExponential(2)}</td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td>
                        <b>{this.props.label}</b>
                    </td>
                    <td>{this.props.value}</td>
                </tr>
            )
        }
    }
}

class RandVarRowDisplayNondet extends React.Component {
    static propTypes = {
        data: PropType.object,
        label: PropType.string,
        rv: PropType.string
    };

    render() {
        if (this.props.rv === 'k_s') {
            return (
                <tr>
                    <td>
                        <b>{this.props.label}</b>
                    </td>
                    <td>{Number(this.props.data.low).toExponential(2)}</td>
                    <td>{Number(this.props.data.high).toExponential(2)}</td>
                    <td>{Number(this.props.data.mean).toExponential(2)}</td>
                    <td>{Number(this.props.data.stdev).toExponential(2)}</td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td>
                        <b>{this.props.label}</b>
                    </td>
                    <td>{this.props.data.low}</td>
                    <td>{this.props.data.high}</td>
                    <td>{this.props.data.mean}</td>
                    <td>{this.props.data.stdev}</td>
                </tr>
            )
        }
    }
}

export default RVTable
