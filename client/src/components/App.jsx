import React, { Component, Fragment } from 'react'
import AppMode from '../AppMode'
import WelcomePage from './Welcome.jsx'
import DataFormPage from './DataForm.jsx'
import DisplayPage from './Display.jsx'
// import API from './apiClient'
// import {
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     Link,
//     Redirect
// } from 'react-router-dom'

const modeTitle = {}

modeTitle[AppMode.WELCOME] = 'Welcome to LISA'
modeTitle[AppMode.DATAFORM] = 'LISA Inputs'
modeTitle[AppMode.DISPLAY] = 'Display Data'

const modeToPage = {}
modeToPage[AppMode.WELCOME] = WelcomePage
modeToPage[AppMode.DATAFORM] = DataFormPage
modeToPage[AppMode.DISPLAY] = DisplayPage

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // for real.
            mode: AppMode.DATAFORM
            // mode: AppMode.DISPLAY
            // results: null
            // datasets to use while testing
            // testing: testing
        }
    }

    handleChangeMode = newMode => {
        this.setState({ mode: newMode })
    };

    render() {
        const ModePage = modeToPage[this.state.mode]
        return (
            <Fragment>
                <ModePage
                    mode={this.state.mode}
                    changeMode={this.handleChangeMode}
                    // onSubmit={this.onSubmit}
                />
                {/* <DisplayPage
                        // data={this.state.testing.results}
                        data={this.state.results}
                    /> */}
                {/* <Switch>
                    <Route path="/">
                        <DataFormPage
                            mode={this.state.mode}
                            changeMode={this.handleChangeMode}
                            onSubmit={this.onSubmit}
                        />
                    </Route>
                    <Route path="/results">
                        <DisplayPage data={this.state.results} />

                    </Route>
                </Switch> */}
            </Fragment>
        )
    }
}

export default App
