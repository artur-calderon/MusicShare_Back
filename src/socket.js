import {io} from './Http.js'

io.on('connection',socket  => {
    console.log(socket.id)
})