import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navbar } from 'react-bootstrap'

class Header extends Component {
    static propTypes = {
        title: PropTypes.string
    }

    render () {
        return (
            <>
                <Navbar className="navbar" bg="dark" variant="dark">
                    <Navbar.Brand className="navbar-brand" href="#">LISA</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse >
                        <Navbar.Text>
                            {this.props.title}
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>
            </>
        )
    }
}

export default Header
