/**
 * Created by lerayne on 31.03.16.
 */

import configPromise from './configLoader';

// Applying glovbal polyfills
import 'babel-polyfill';

// Binding react App to dom node
import React from 'react';
import { render } from 'react-dom';

import App from './App';

import './config.json'; // just to copy it to the folder

document.addEventListener("DOMContentLoaded", function() {
    configPromise.then(config =>
        render(<App config={config} />, document.getElementById('main'))
    )
});


