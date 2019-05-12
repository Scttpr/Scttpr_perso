// Import Yarn
const { validationResult } = require('express-validator/check');

// Import local
const io = require('./socket');
const Message = require('./Message');

exports.getMessages = (req, res, next) => {
    Message.find()
        .then(messages => {
            res.status(200).json({
                message: 'Fetched messages successfully',
                messages,
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.postMessage = (req, res, next) => {
    // GESTION DES ERREURS A METTRE EN PLACE
    const author = req.body.author;
    const content = req.body.content;
    console.log(`Nouveau message : auteur: ${author}, contenu: ${content}`);
    const message = new Message({
        author,
        content,
    });
    message.save()
        .then(result => {
            io.getIO().emit('posts', {
                action: 'create',
                message,
            });
        })
        .then(result => {
            res.status(201).json({
                message: 'Nouveau message ajouté',
                content: message,
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}