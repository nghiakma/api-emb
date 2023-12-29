const cors = require('cors');
const express = require('express')
const app = express()
const port = 42600
const hostname = '0.0.0.0'
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
/*
Cấu hình CORS policy
 */
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());


/*
Cấu hình body parser
*/
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
Các routers 
*/
require('./routers/history.router.js')(app);
require('./routers/user.router.js')(app);
require('./routers/admin.router.js')(app);

app.get('/', (req, res) => {
    // Test Absolute import mapOrde
    res.end('<h1>Hello World!</h1><hr>')
  })
const clients = [];

function broadcast(socket, data) {
    console.log(clients.length);
    for (let i = 0; i < clients.length; i++) {
        if (clients[i] !== socket) {
            clients[i].send(data.toString());
        }
    }
}

wss.on('connection', (socket, req) => {
    clients.push(socket);
    socket.on('message', (message) => {
        console.log('received: %s', message);
        broadcast(socket, message);
    });
    socket.on('close', () => {
        const index = clients.indexOf(socket);
        if (index !== -1) {
            clients.splice(index, 1);
        }
        console.log('disconnected');
    });
});
server.listen(port,hostname, () => {
    console.log('Server listening on port 42600');
});