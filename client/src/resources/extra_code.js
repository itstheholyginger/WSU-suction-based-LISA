class BivariateVar extends Component {
    static propTypes = {
        handleChange: PropTypes.func,
        data: PropTypes.object,
        name: PropTypes.string
    };

    handleChange = e => {
        console.log('in bivariate rand var change')
        this.props.handleChange(this.props.name, e.target.name, e.target.value)
    };

    render() {
        return (
            <>
                <Form.Row>
                    <div className="randVarInputCol bivMean">
                        <Form.Group as={Col} controlId="bivMean">
                            <Form.Label>Mean</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                step={0.000000001}
                                name="mean1"
                                onChange={this.handleChange}
                                placeholder="Enter mean"
                            />
                        </Form.Group>
                    </div>
                    <div className="randVarInputCol bivCov">
                        <Form.Group as={Col} controlId="">
                            <Form.Label>Covariance</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formCov">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        step={0.000000001}
                                        name="covX1"
                                        onChange={this.handleChange}
                                        placeholder="Enter X"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formCov">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        step={0.000000001}
                                        name="covY1"
                                        onChange={this.handleChange}
                                        placeholder="Enter Y"
                                    />
                                </Form.Group>
                            </Form.Row>
                        </Form.Group>
                    </div>
                </Form.Row>

                <Form.Row>
                    <div className="randVarInputCol bivMean">
                        <Form.Group as={Col} controlId="bivMean">
                            <Form.Label>Mean</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                step={0.0000001}
                                name="mean2"
                                onChange={this.handleChange}
                                placeholder="Enter mean"
                            />
                        </Form.Group>
                    </div>

                    <div className="randVarInputCol bivCov">
                        <Form.Group as={Col} controlId="">
                            <Form.Label>Covariance</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formCov">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        step={0.0000001}
                                        name="covX2"
                                        onChange={this.handleChange}
                                        placeholder="Enter X"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formCov">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        step={0.0000001}
                                        name="covY2"
                                        onChange={this.handleChange}
                                        placeholder="Enter Y"
                                    />
                                </Form.Group>
                            </Form.Row>
                        </Form.Group>
                    </div>
                </Form.Row>
            </>
        )
    }
}

class ZVar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'z',
            label: 'Distance Above Water Table (z)',
            max: 0,
            step: 0.5,
        };
    }

    static propTypes = {
        handleChange: PropTypes.func,
    };

    handleChange = e => {
        var key = e.target.name;
        var value = e.target.value;
        this.props.handleChange(key, value);
        console.log('in z var change');
    };

    render() {
        return (
            <div className="form-group">
                <h6>Z: Distance from ground surface to water table</h6>
                <Form.Row>
                    <Form.Group as={Col} controlId="form-max">
                        <Form.Label>Max</Form.Label>
                        <Form.Control
                            type="number"
                            min={0.0001}
                            step={0.0001}
                            placeholder="Max Z value"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="form-step">
                        <Form.Label>Step</Form.Label>
                        <Form.Control
                            type="number"
                            min={0.00001}
                            step={0.00001}
                            placeholder="Z step value"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                </Form.Row>
            </div>
        );
    }
}


class FluxVar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
        };
    }

    static propTypes = {
        data: PropTypes.object,
        handleChange: PropTypes.func,
        handleRemove: PropTypes.func,
        handleAdd: PropTypes.func,
    };

    handleAdd = () => {
        console.log('adding new flux');
        this.props.handleAdd(this.state.count - 1);
        this.setState({ count: this.state.count + 1 });
    };

    handleDelete = index => {
        console.log('deleting flux from index ', index);
        this.props.handleRemove(index);
    };

    displayInputs = () => {
        const inputArr = [];
        for (var i = 0; i < this.state.count; i++) {
            inputArr.push(
                <FluxInput
                    key={i}
                    num={i}
                    handleRemove={this.props.handleDelete}
                    handleChange={this.props.handleChange}
                />
            );
        }
        return inputArr;
    };

    render() {
        return (
            <div className="form-group">
                <Form.Row style={{ width: '300px' }}>
                    <h6>q: Flux(es)</h6>
                </Form.Row>
                {this.displayInputs()}
                <Form.Row style={{ float: 'right' }}>
                    <Button variant="primary" onClick={this.handleAdd}>
                        <span className="fa fa-plus"></span>
                    </Button>
                </Form.Row>
            </div>
        );
    }
}

class FluxInput extends Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        num: PropTypes.number,
        remove_flux: PropTypes.func,
    };

    handleDelete = () => {
        this.props.remove_flux(this.props.num);
    };

    handleChange = e => {
        console.log('handling change');
        this.props.handleChange(this.props.num, e.value);
    };

    render() {
        return (
            <div className="flux-row">
                <Form.Row style={{ width: '300px' }}>
                    <Form.Group as={Col} sm={10}>
                        <Form.Control
                            type="number"
                            min={-100}
                            step={0.00001}
                            placeholder="Enter Value"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} sm={2}>
                        <Button variant="primary" onClick={this.handleDelete}>
                            <span className="fa fa-minus"></span>
                        </Button>
                    </Form.Group>
                </Form.Row>
            </div>
        );
    }
}





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
