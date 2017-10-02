/**
 * Created by lerayne on 24.06.17.
 */

import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

class Root extends Component {
    render(){

        const {children, user} = this.props

        return <div>
            <div style={{
                border:'1px solid #ccc',
                padding:'10px',
                margin:'0 0 10px'
            }}>
                {user.id === -1 && <Link to="/login">Login</Link>}
                {user.id !== -1 && <span>
                    <span>Hello, {user.name}</span>
                    &nbsp;
                    <a href="#" onClick={::this.logOut}>Log out</a>
                </span>}
            </div>
            <div className="current-container">
                {children}
            </div>
        </div>
    }

    logOut(){
        alert('yet to be done')
    }
}

export default Root = connect(state => ({
    user: state.user
}))(Root)
