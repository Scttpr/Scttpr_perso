# Envoyer des mails

> * https://nodemailer.com/about/
> * https://sendgrid.com/docs/

## Comment on envoi des mails ?

* C'est une technologie complètement différente et complexe, on utilise des modules pour cela (AWS, etc.)

## Sendgrid & utilisation

* On utilisera Sendgrid ici car il est gratuit dans une certaine mesure
* `npm install --save nodemailer nodemailer-sendgrid-transport` == Importer les modules

* Dans le controller auth.js:
```js
const nodemailer = require('nodemailer');
const sendgridTransport = require('...');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        // La clé se crée sur la plateforme SendGrid
        api_key: 'keyFurnished'
    }
}));

// Pour envoyer un mail :
transporter.sendMail({
    to: email,
    from: 'toto@hmail.com',
    subject: 'topic',
    html: 'content'
})
```