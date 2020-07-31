const firebase = require("firebase/app");

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};
firebase.initializeApp(firebaseConfig);
require('firebase/database')
const database = firebase.database().ref('messages/')

const http = require('http')
const server = http.createServer()
server.listen(2400)

const socketServer = require('websocket').server
const socket = new socketServer({httpServer: server})

socket.on('request', (req) => {
    const connection = req.accept(null, req.origin)
    connection.on('message', (message) => {
        database.set({message: message})
            .then(_ => {console.log('message added successfully')})
            .catch(err => {console.log(err)})
    })
    connection.on('close', () => {database.off()})
    database.on('value', snapshot => {
        connection.send(JSON.stringify(snapshot.val()))
    })
})
