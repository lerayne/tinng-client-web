/**
 * Created by lerayne on 31.03.16.
 */

// Applying glovbal polyfills
import 'babel-polyfill';
import 'isomorphic-fetch';

// Binding react App to dom node
import React from 'react';
import { render } from 'react-dom';

import App from './App';

document.addEventListener("DOMContentLoaded", function() {
    render(<App />, document.getElementById('main'))
});
