/**
 * Created by M. Yegorov on 2016-09-29.
 */

import 'isomorphic-fetch';

import './config.json';

const configPromise = fetch('config.json').then(r => r.json());

export default configPromise;