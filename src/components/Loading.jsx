import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FadeIn from 'react-fade-in'

import { Spinner, Card } from "@blueprintjs/core"

class Loading extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: undefined,
            done: undefined
        }
    }

    static propTypes = {
        loading: PropTypes.bool
    }

    render() {
        return (
            <Card className="loading-card bp3-elevation-2">
                <FadeIn>
                    <div className="d-flex justify-content'-center align-items-center">
                        <h4>Fetching Results</h4>
                        {!this.props.loading && (
                            <Spinner className="styledSpinner" intent="primary" size={Spinner.SIZE_STANDARD} />
                        )}
                    </div>
                </FadeIn>
            </Card>
        )
    }
}

export default Loading
