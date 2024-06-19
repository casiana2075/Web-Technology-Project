const controller = require('../controllers/Controller');

const router = (req,res) => {

    console.log("Router!");

    if (req.url === '/api/users' && req.method === 'GET') {

        controller.getUsers(req,res);

    } if(req.url === '/api/login' && req.method === 'POST') {

        controller.login(req,res);

    }
    
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h1>Page not found</h1>');
        res.end();
    }

}

module.exports = router;