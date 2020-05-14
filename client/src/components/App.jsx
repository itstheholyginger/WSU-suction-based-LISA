import React, { Component, Fragment } from 'react'
import AppMode from '../AppMode'
import WelcomePage from './Welcome.jsx'
import DataFormPage from './DataForm.jsx'
import DisplayPage from './Display.jsx'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom"


const modeTitle = {}

modeTitle[AppMode.WELCOME] = 'Welcome to LISA'
modeTitle[AppMode.DATAFORM] = 'LISA Inputs'
modeTitle[AppMode.DISPLAY] = 'Display Data'

const modeToPage = {}
modeToPage[AppMode.WELCOME] = WelcomePage
modeToPage[AppMode.DATAFORM] = DataFormPage
modeToPage[AppMode.DISPLAY] = DisplayPage

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // for real.
            mode: AppMode.DATAFORM,
            // for testing display
            // mode: AppMode.DISPLAY,
            data: data,
            // use this normally
            results: null,
            // datasets to use while testing
            testing: testing
        }
        // this.handleRandVarChange = this.handleRandVarChange.bind(this)
    }

    handleChangeMode = (newMode) => {
        this.setState({ mode: newMode })
    }


    // Called when "submit" button is called in backend
    onSubmit = () => {
        console.log("submitting... in App.jsx")
    }

    render() {
        return (
            <Fragment>
                    <DataFormPage
                        mode={this.state.mode}
                        changeMode={this.handleChangeMode}
                        onSubmit={this.onSubmit}
                    />
                    <DisplayPage
                        // data={this.state.testing.results}
                        data={this.state.results}
                    />
                    )
                <Switch>
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
                </Switch>
            </Fragment>
        )
    }
}

export default App
