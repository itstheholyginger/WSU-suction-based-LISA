import React, { Component, Fragment } from 'react'
import io from 'socket.io-client'
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
import { data, results, testing } from '../resources/test_data'

const endPoint = 'http://localhost:5000'

const socket = io.connect(`${endPoint}`)

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

    componentDidMount = () => {
        // socket = io(this.endPoint)
        this.socket = io(endPoint)

        this.socket.on('submit', res => {
            console.log('received results from backend: ', res)
            this.setState({
                results: res
            })
            this.handleChangeMode(AppMode.DISPLAY)
        })
        this.socket.on('message', msg => {
            console.log('received results: ', msg)
            this.setState({
                results: msg,
                mode: AppMode.DISPLAY
            })
        })
    }

    componentWillUnmount = () => {
        this.socket.disconnect()
    }

    onResultsChange = () => {
        socket.on('submit', res => {
            console.log('recieved results from backend: ', res)
            this.setState({
                results: res,
                mode: AppMode.DISPLAY
            })
        })
        console.log('got response from backend!')
    }


    //  handling variable changes in data form
    handleRandVarChange = (varName, key, value) => {
        console.log(varName, key, value)
        var newData = this.state.data
        console.log('old data:\t', newData)
        newData.randVars[varName][key] = value
        console.log('var:\t', varName)
        console.log('\tnew data:\t', newData)
        this.setState({ newData })
    }

    handleDistChange = (varName, selected) => {
        var newData = this.state.data
        newData.randVars[varName] = {
            dist: selected,
            min: 0,
            max: 0,
            mean: 0,
            stdev: 0
        }
        this.setState(newData)
        console.log(varName, 'new dist is: ', selected)
    }

    handleConstVarChange = (varName, value) => {
        var newData = this.state.data
        newData.constVars[varName] = value
        this.setState(newData)
    }

    handleNumVarChange = (number) => {
        var newData = this.state.data
        newData.numVars = number
        this.setState(newData)
    }

    handleZVarChange = (key, val) => {
        var newData = this.state.data
        newData.z[key] = val
        this.setState(newData)
    }

    handleSatChange = (val) => {
        var newData = this.state.data
        newData.sat = val
        this.setState(newData)
    }


    // Called when "submit" button is called in backend
    onSubmit = () => {
        if (this.state.data !== {}) {
            // socket.emit(data)
            console.log(this.state.testing.data)
            console.log('send to backend')
            this.socket.emit('submit', this.state.testing.data)
            // return (
            //     <Redirect to="/results" />
            // )
            // this.handleChangeMode(AppMode.DISPLAY)
        }
    }

    render() {
        return (
            <Fragment>
                {/* {this.state.mode === AppMode.DATAFORM ? ( */}
                <>
                    <DataFormPage
                        mode={this.state.mode}
                        changeMode={this.handleChangeMode}
                        handleNumVarChange={this.handleNumVarChange}
                        handleRVChange={this.handleRandVarChange}
                        handleDistChange={this.handleDistChange}
                        handleConstVarChange={this.handleConstVarChange}
                        handleZVarChange={this.handleZVarChange}
                        handleSatChange={this.handleSatChange}
                        data={this.state.data}
                        onSubmit={this.onSubmit}
                    />
                </>
                {/* ) : ( */}
                <>
                    <DisplayPage
                        // data={this.state.testing.results}
                        data={this.state.results}
                    />
                </>
                    )
                {/* } */}
                <Switch>
                    <Route path="/">
                        <DataFormPage
                            mode={this.state.mode}
                            changeMode={this.handleChangeMode}
                            handleNumVarChange={this.handleNumVarChange}
                            handleRVChange={this.handleRandVarChange}
                            handleDistChange={this.handleDistChange}
                            handleConstVarChange={this.handleConstVarChange}
                            handleZVarChange={this.handleZVarChange}
                            handleSatChange={this.handleSatChange}
                            data={this.state.data}
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
