// Import Yarn
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import local
const Message = require('./Message');

// Création de l'app
const app = express();

// Middlewares
app.use(bodyParser.json()); // application/json
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
        );
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    
    // Routing
    // app.use(router);
    
    // Error handler
    app.use((error, req, res, next) => {
        const status = error.statusCode || 500;
        const message = error.message;
        const data = error.data;
        res.status(status).json({ message, data })
    }) 

    
    const toto = () => {
        console.log(Message.find());
    };


    // Server & db
    const dbUrl = 'mongodb+srv://Scttpr:---@cluster0-2ycpa.mongodb.net/test?retryWrites=true';
    mongoose.connect(dbUrl)
        .then(result => {
            const server = app.listen(3000);
            console.log('server launched');
            const io = require('./socket').init(server);
            io.on('connection', (socket) => {
                console.log(io, socket);
                console.log('Nouvel utilisateur');
                io.emit('confirm', 'socket bien connecté');
                socket.on('addMessage', ({ author, content }) => {
                    console.log(author, content);
                    const message = new Message({
                        author,
                        content,
                        createdAt: new Date(),
                    });
                    message.save()
                        .then(result => {
                            io.emit('newMessage', message);
                        })
                        .catch(err => console.log(err));
                })
            });
        })
        .catch(err => console.log(err));
