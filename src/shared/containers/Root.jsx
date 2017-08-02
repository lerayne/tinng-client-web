/**
 * Created by lerayne on 24.06.17.
 */

import React, {Component} from 'react'
import {Link} from 'react-router'

export default class Root extends Component {
    render(){

        const {children} = this.props

        return <div>
            <div style={{
                border:'1px solid #ccc',
                padding:'10px',
                margin:'0 0 10px'
            }}>
                <Link to="/login">Login</Link>
            </div>
            <div className="current-container">
                {children}
            </div>
        </div>
    }
}
