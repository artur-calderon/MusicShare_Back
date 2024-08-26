import express from "express";
import bodyParser from "body-parser";
import { createRoom, snapshot, getInfoRoom } from "./FirebaseFunctions.js";
import {google} from 'googleapis';
import cors from 'cors';
import http from 'http'
import {Server} from 'socket.io'
import shortId from 'short-uuid'

const GOOGLE_API_KEY = 'AIzaSyA98Ma8kWT_pIec0L-geWG3QxhbAbE0lno'
const youtube = google.youtube({
    version: 'v3',
    auth: GOOGLE_API_KEY
})
const app = express();
const serverHttp = http.createServer(app)

const io = new Server(serverHttp,{
    cors: {
        origin:"*"
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin:'*'
}))

const usersConnecteds = []
const musicShareConnecteds = []

io.on('connection',  socket=> {
    socket.on('joinRoom',data =>{
        console.log('joinRoom ', data)
        socket.join(data.idRoom)

        const userInRoom = usersConnecteds.find(user => user.userName === data.userName && user.room === data.idRoom)
        if(userInRoom){
            usersConnecteds.socket_id = socket.id;
        }else{
        usersConnecteds.push({
            idRoom:data.idRoom,
            userName:data.userName,
            userCpf:data.userCPF,
            socket_id:socket.id
        })
        }

    })
    socket.on('musicAndUserInfo', data => {
        console.log('music and user info ', data)
            const musicShared = {
                idRoom: data.idRoom,
                musicSelectedInfo:data.musicSelectedInfo,
                userName: data.userName,
                userCPF: data.userCPF,
            }

            // musicShareConnecteds.push(musicShared)


            io.to(data.idRoom).emit('musicSelected',musicShared)


    })
})

app.post("/createRoom", function (req, res) {

    const roomSpecs = req.body;

    if (req.body) {
        const roomInfo = {
            id:shortId.generate(),
            roomSpecs
        }
        createRoom(roomInfo)
        res.send("Room created");
    }
});
app.get("/showRooms", (req, res) => {
    if (snapshot.empty) {
        console.log("No matching documents.");
        return;
    } else {
        res.send(snapshot);
    }
});

app.get('/insideRoom/:id', (req, res) => {
    const idRoom = req.params.id;
    if(getInfoRoom(idRoom)){
        getInfoRoom(idRoom).then(data => {
            res.send(data)
        });

    }

})

app.post('/searchMusic', async (req, res, next) => {
    try{
        const searchQuery = req.body.search;
        const response = await youtube.search.list({
            part:'snippet',
            type:'video',
            videoCategoryId:'10',
            q: searchQuery,
            maxResults: 10,
        })
        res.send(response.data.items)

    }catch(err){
        next(err)
        res.send(err)
    }

})


app.post('/playlistToRoom/:id', async (req, res) => {

})


export {serverHttp, io}