/**
 * Created by lerayne on 14.10.16.
 */

import React from 'react';
import {createDevTools} from 'redux-devtools';

import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import Inspector from 'redux-devtools-inspector';

const DevTools = createDevTools(
    // Monitors are individually adjustable with props.
    // Consult their repositories to learn about those props.
    // Here, we put LogMonitor inside a DockMonitor.
    // Note: DockMonitor is visible by default.
    <DockMonitor
        style={{fontSize: 12}}
        toggleVisibilityKey='ctrl-h'
        changePositionKey='ctrl-q'
        changeMonitorKey='ctrl-m'
        defaultIsVisible={false}
        defaultSize={0.24}
    >
        {/*<LogMonitor theme='tomorrow' style={{fontSize:12}}/>*/}
        <Inspector/>
    </DockMonitor>
);

export default DevTools