/**
 * Created by lerayne on 07.01.17.
 */

import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import Inspector from 'redux-devtools-inspector';

const DevTools = createDevTools(
    <DockMonitor
        style={{fontSize: 12}}
        toggleVisibilityKey='ctrl-h'
        changePositionKey='ctrl-q'
        changeMonitorKey='ctrl-m'
        defaultIsVisible={false}
    >
        {/*<LogMonitor theme='tomorrow' style={{fontSize:12}}/>*/}
        <Inspector />
    </DockMonitor>
);

export default DevTools