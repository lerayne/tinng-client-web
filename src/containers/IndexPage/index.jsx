/**
 * Created by lerayne on 31.03.16.
 */

import React, {Component} from 'react';

class IndexPage extends Component {
    constructor() {
        super();
    }

    render() {
        return <div>
            {this.props.children === null && <div>
                Test 2
            </div>}
        </div>
    }
}

export default IndexPage;