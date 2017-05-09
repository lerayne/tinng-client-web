/**
 * Created by lerayne on 09.05.17.
 */

import socketClient from 'socket.io-client'

const socket = socketClient(window.config.tinngServerURL)

export default socket