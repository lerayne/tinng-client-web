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

import './config.json'; // just to copy it to the folder

const configPromise = fetch('config.json').then(r => r.json());

document.addEventListener("DOMContentLoaded", function() {
    configPromise.then(config =>
        render(<App config={config} />, document.getElementById('main'))
    )
});


