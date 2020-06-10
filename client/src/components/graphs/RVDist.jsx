import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as V from 'victory';
import Select from 'react-select';
import UNITS from '../../resources/units';

//NON-DET data looks like:
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
// DET data looks like
/*
    {
        conf: 'det',
        sat: False,
        randVars: {
            "a" 1,
            ...
        }
    }

*/

class RVDistGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: '',
        };
    }

    static propTypes = {
        data: PropTypes.object,
    };

    setOptions = () => {
        const options = [];
        for (const key in this.props.data) {
            options.push({ value: key, label: key });
        }
        return options;
    };

    handleChange = e => {
        // console.log('in handlechange');
        // console.log(e);
        const selected = e.value;
        // console.log('selected: ', selected);
        this.setState({
            selected: selected,
        });
    };

    render() {
        const selectedOption = this.state.selected;
        // console.log('selected: ', selectedOption)
        const options = this.setOptions();
        // console.log(options);

        const curData = this.props.data[selectedOption];
        console.log('RVDistGraph curdata: ', curData);
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
                        <RVBar
                            data={this.props.data}
                            rv={selectedOption}
                            conf={this.props.conf}
                        />
                    </>
                ) : (
                    <></>
                )}
            </Fragment>
        );
    }
}

// NON-DET
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

// DET data looks like
/*
    {
        conf: 'det',
        sat: False,
        randVars: {
            "a" 1,
            ...
        }
    }
*/
class RVBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datapoints: [],
            rv: '',
        };
    }

    static propTypes = {
        data: PropTypes.object,
        rv: PropTypes.string,
        conf: PropTypes.string,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log('\t--RVBar getDerivedStateFromProps');
        // console.log('parent changed, updating state');
        if (nextProps.rv !== prevState.rv) {
            if (nextProps.conf === 'nondet') {
                const valsArr = nextProps.data[nextProps.rv].vals;
                // console.log('\nvalsArr: ');
                // console.log(valsArr);
                const freqObj = {};
                valsArr.forEach(x => {
                    if (nextProps.rv === 'k_s') {
                        // console.log('special case for k_s');
                        let rounded = x.toExponential(2);
                        console.log('rounded = ', rounded);
                        if (!freqObj[rounded]) {
                            freqObj[rounded] = 1;
                        } else {
                            freqObj[rounded] += 1;
                        }
                    } else {
                        let rounded = 0.0;
                        rounded = x.toFixed(2);
                        if (!freqObj[rounded]) {
                            freqObj[rounded] = 1;
                        } else {
                            freqObj[rounded] += 1;
                        }
                    }
                });

                const datapoints = [];
                for (const key in freqObj) {
                    datapoints.push({ x: Number(key), y: freqObj[key] });
                }
                // this.setState({ datapoints: datapoints })
                return { datapoints: datapoints, rv: nextProps.rv };
            } else if (nextProps.conf === 'det') {
                var val = nextProps.data[nextProps.rv];
                if (nextProps.rv !== 'k_s') {
                    val = val.toFixed(2);
                } else {
                    val = val.toExponential(2);
                }
                const datapoints = [{ x: Number(val), y: 1 }];
                return { datapoints: datapoints, rv: nextProps.rv };
            } else {
                console.log('ERROR: invalid conf: ', nextProps.conf);
            }
        } else return null;
    }
    getTickFormat = t => {
        const rv = this.state.rv;
        if (rv === 'k_s') {
            return t.toExponential(2);
        } else if (rv === 'c' || rv === 'c_r' || rv === 'phi') {
            return t.toFixed(1);
        } else if (rv === 'a' || rv === 'n') {
            return t.toFixed(3);
        } else return t;
    };

    render() {
        // const l = `${this.state.rv} Distribution`;
        // console.log(l);
        var dist = null;
        if (this.props.conf === 'nondet') {
            dist = <h5>{this.props.data[this.state.rv].dist}</h5>;
        }
        return (
            <div className="graph">
                <h4>Distribution Graph for {this.state.rv}</h4>{' '}
                {dist !== null ? dist : null}
                <V.VictoryChart
                    domainPadding={20}
                    overflow="visible"
                    theme={V.VictoryTheme.material}
                    containerComponent={
                        <V.VictoryVoronoiContainer
                            labels={({ datum }) => `${datum.x} ${datum.y}`}
                        />
                    }
                >
                    <V.VictoryBar
                        // style={{ data:}}
                        data={this.state.datapoints}
                    />
                    <V.VictoryAxis
                        label={UNITS[this.state.rv]}
                        style={{
                            axisLabel: { padding: 30 },
                        }}
                        tickFormat={t => this.getTickFormat(t)}
                        tickCount={this.props.conf === 'det' ? 1 : null}
                    />

                    <V.VictoryAxis
                        dependentAxis
                        label="Count"
                        style={{
                            axisLabel: { padding: 40 },
                        }}
                    />
                </V.VictoryChart>
            </div>
        );
    }
}

export default RVDistGraph;
