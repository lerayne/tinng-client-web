/**
 * Created by lerayne on 31.03.16.
 */

import 'babel-polyfill';
import 'isomorphic-fetch';

import React from 'react';
import { render } from 'react-dom';

import App from './App';

document.addEventListener("DOMContentLoaded", function() {
    render(<App />, document.getElementById('main'))
});

