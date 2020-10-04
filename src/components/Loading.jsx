import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FadeIn from 'react-fade-in'
import Lottie from 'react-lottie'
import ReactLoading from 'react-loading'
import * as animationData from '../resources/animations/24817-tiktok-loader.json'
import * as doneData from '../resources/animations/24847-confirmation.json'

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
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        }

        const defaultOptions2 = {
            loop: false,
            autoplay: true,
            animationData: doneData.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        }
        return (
            <FadeIn>
                <div className="d-flex justify-content'-center align-items-center">
                    <h1>fetching results</h1>
                    {!this.props.loading ? (
                        <Lottie options={defaultOptions} height={120} width={120} />
                    ) : (
                            <Lottie options={defaultOptions2} height={120} width={120} />
                        )}
                </div>
            </FadeIn>
        )
    }
}

export default Loading
