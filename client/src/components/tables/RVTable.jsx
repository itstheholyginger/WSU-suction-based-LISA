import React, { Component, Fragment } from 'react'
import PropType from 'prop-types'
import { Table } from 'react-bootstrap'
import LABELS from '../../resources/labels'

class RVTable extends Component {
    static propTypes = {
        data: PropType.object,
        sat: PropType.bool,
        conf: PropType.string
    };

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
        const rows = []
        const list = []
        console.log('data: ', this.props.data)
        for (let key in vars) {
            key = vars[key]
            var i = this.props.data[key]
            console.log('key: ', key)

            if (conf === 'det') {
                console.log('i: ', i)
                list.push(
                    <RandVarRowDisplayDet
                        key={key}
                        value={this.props.data[i]}
                        label={LABELS[key]}
                    />
                )
            } else if (conf === 'nondet') {
                list.push(
                    <RandVarRowDisplayNondet
                        key={i}
                        data={this.props.data[i]}
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

        return (
            <Fragment>
                <div className="paddedPage">
                    <div className="displayTable">
                        <Table striped hover bordered size="sm">
                            <thead>
                                <tr>
                                    <th>Random Variable</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>{this.getRows(vars, conf)}</tbody>
                        </Table>
                    </div>
                </div>
            </Fragment>
        )
    };

    render() {
        console.log('IN RVTABLE. data = ', this.props.data)
        const sat = this.props.sat
        const conf = this.props.conf
        console.log('sat: ', sat)
        console.log('conf: ', conf)
        const table = this.getTable(sat, conf)
        return (
            <Fragment>
                <div className="paddedPage">
                    <div className="displayTable">{table}</div>
                </div>
            </Fragment>
        )
    }
}

class RandVarRowDisplayDet extends Component {
    static propTypes = {
        value: PropType.number,
        label: PropType.string
    };

    render() {
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

class RandVarRowDisplayNondet extends React.Component {
    static propTypes = {
        data: PropType.object
    };

    render() {
        return (
            <tr>
                <td>
                    <b>{this.props.data.label}</b>
                </td>
                <td>{this.props.data.low}</td>
                <td>{this.props.data.high}</td>
                <td>{this.props.data.mean}</td>
                <td>{this.props.data.stdev}</td>
            </tr>
        )
    }
}

export default RVTable

// if (conf === 'nondet') {
//     if (sat == false) {
//         return (
//             <Fragment>
//                 <div className="paddedPage">
//                     <div className="displayTable">
//                         <Table striped hover bordered size="sm">
//                             <thead>
//                                 <tr>
//                                     <th>Random Variable</th>
//                                     <th>Low</th>
//                                     <th>High</th>
//                                     <th>Mean</th>
//                                     <th>Stdev</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {/* sent data = {'c': {}, c_r: {}, ...} */}
//                                 <RandVarRowDisplay
//                                     data={this.props.data.c}
//                                     label="C: Soil Cohesion (kPa)"
//                                 />
//                                 <RandVarRowDisplay
//                                     data={this.props.data.c_r}
//                                     label="C_r: Root Cohesion (kPa)"
//                                 />
//                                 <RandVarRowDisplay
//                                     data={this.props.data.phi}
//                                     label="phi: Effective Angle of Friction (deg)"
//                                 />
//                                 <RandVarRowDisplay
//                                     data={this.props.data.k_s}
//                                     label="k_s: Saturated Hydraulic Conductivity (m/s)"
//                                 />
//                                 <RandVarRowDisplay
//                                     data={this.props.data.a}
//                                     label="Van Genuchten's a (1/kPa)"
//                                 />
//                                 <RandVarRowDisplay
//                                     data={this.props.data.n}
//                                     label="Van Genuchten's n"
//                                 />
//                             </tbody>
//                         </Table>
//                     </div>
//                 </div>
//             </Fragment>
//         )
//     } else if (sat == false) {
//         return (
//             <Fragment>
//                 <div className="paddedPage">
//                     <div className="displayTable">
//                         <Table striped hover bordered size="sm">
//                             <thead>
//                                 <tr>
//                                     <th>Random Variable</th>
//                                     <th>Low</th>
//                                     <th>High</th>
//                                     <th>Mean</th>
//                                     <th>Stdev</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {/* sent data = {'c': {}, c_r: {}, ...} */}
//                                 <RandVarRowDisplayNondet
//                                     data={this.props.data.c}
//                                     label="C: Soil Cohesion (kPa)"
//                                 />
//                                 <RandVarRowDisplayNondet
//                                     data={this.props.data.c_r}
//                                     label="C_r: Root Cohesion (kPa)"
//                                 />
//                                 <RandVarRowDisplayNondet
//                                     data={this.props.data.phi}
//                                     label="phi: Effective Angle of Friction (deg)"
//                                 />
//                             </tbody>
//                         </Table>
//                     </div>
//                 </div>
//             </Fragment>
//         )
//     }
// } else if (conf === 'det') {
//     if (sat === false) {
//         rows = detRows()
//         return (
//             <Fragment>
//                 <div className="paddedPage">
//                     <div className="displayTable">
//                         <Table striped hover bordered size="sm">
//                             <thead>
//                                 <tr>
//                                     <th>Random Variable</th>
//                                     <th>Value</th>
//                                 </tr>
//                             </thead>
//                             <tbody>{rows}</tbody>
//                         </Table>
//                     </div>
//                 </div>
//             </Fragment>
//         )
//     }
// } else {
//     return <p>Error: invalid Analysis Type - {conf}</p>
// }
