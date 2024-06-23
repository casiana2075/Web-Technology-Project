const controller = require('../controllers/Controller');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');

const router = (req, res) => {
    console.log("Router!");

    if (req.url === '/api/users' && req.method === 'GET') {
        controller.getUsers(req, res);
    } else if (req.url === '/api/login' && req.method === 'POST') {
        controller.login(req, res);
        console.log("Login!");
    } else if (req.url === '/api/users' && req.method === 'POST') {
        controller.register(req, res);
        console.log("Register!");
    } else if (req.url.startsWith('/api/awardsInfo') && req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const category = url.searchParams.get('category');
        const year = url.searchParams.get('year');     
        controller.getAwardsInfo(req, res, category, year);
    } else if (req.url === '/api/categories' && req.method === 'GET') {
        controller.getCategories(req, res);
    } else if (req.url === '/api/years' && req.method === 'GET') {
        controller.getYears(req, res);
    } else if (req.url.startsWith('/api/seriesCategories') && req.method === 'GET') {
        controller.getSeriesCategories(req, res);
    } else if (req.url.startsWith('/api/actorsFromDb') && req.method === 'GET') {
        controller. getActorsFromDb(req, res);
    } 
    else if (req.url === '/api/actors' && req.method === 'POST') {
        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: err.message }));
                return;
            }
            try {
                const name = fields.name[0];
                const details = fields.details[0];
                const birthday = fields.birthday[0];
                const deathday = fields.deathday[0];
                const birthplace = fields.birthplace[0];
                const knownfor = fields.knownfor[0];
                const file = files.image[0];
                const tempPath = file.path;
                const fileName = `${Date.now()}-${file.originalFilename}`;
                const targetPath = path.join(__dirname, '../resources/', fileName);
                fs.rename(tempPath, targetPath, async (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: err.message }));
                        return;
                    }
                    await controller.addActor(req, res, name, details, birthday, deathday, birthplace, knownfor, fileName);
                });
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: error.message }));
            }
        });
    } else if (req.url === '/api/actors' && req.method === 'GET') {
        controller.getActors(req, res);
    } else if (req.url.startsWith('/api/actors/') && req.method === 'GET') {
        const id = req.url.split('/').pop();
        controller.getActorById(req, res, id);
    } else if(req.url.match(/^\/api\/resources\/images\/([a-zA-Z0-9-_.(){}[\]!@#$%^&~]+)\.(jpg|jpeg|png|gif)$/) && req.method === 'GET'){

        controller.getImage(req, res, req.url.split('/')[4]);

    } else if (req.url === '/api/users/addActorToFavourites' && req.method === 'POST') {
        controller.addActorToFavourites(req, res);
    } else if (req.url === '/api/users/removeActorFromFavourites' && req.method === 'POST') {
        controller.removeActorFromFavourites(req, res);
    } else if (req.url.startsWith('/api/favorites/user/') && req.method === 'GET') {
         const username = req.url.split('/').pop();
         console.log(username);
         controller.getUserFavoritesActors(req, res, username);
     } else if (req.url.startsWith('/api/fetchNews') && req.method === 'GET') {
        controller.fetchNews(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h1>Page not found</h1>');
        res.end();
    }
}

module.exports = router;
