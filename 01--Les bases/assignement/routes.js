const reqHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<h1>Hello you !</h1>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username" placeholder="Your name"><button type="submit">Send</button></form>');
        return res.end();
    }
    if (url === '/users') {
        res.write('<ul><li>User one</li></ul>');
        return res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];
            console.log(username);
        });
        res.statusCode = 302;
        res.setHeader('Location', '/users');
        return res.end();
    }
}

exports.reqHandler = reqHandler;

