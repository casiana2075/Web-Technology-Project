const controller = require('../controllers/Controller');

const router = (req, res) => {
    console.log("Router!");

    if (req.url === '/api/users' && req.method === 'GET') {
        controller.getUsers(req, res);
    } else if (req.url === '/api/login' && req.method === 'POST') {
        controller.login(req, res);
        console.log("Login!");
    } else if (req.url === '/api/login/admin' && req.method === 'POST') {
        controller.loginAdmin(req, res);
        console.log("Login as Admin!");
    } else if (req.url === '/api/users' && req.method === 'POST') {
        controller.register(req, res);
        console.log("Register!");
    } else if (req.url.startsWith('/api/user/') && req.method === 'DELETE') {
        const userid = req.url.split('/').pop();
        controller.deleteUser(req, res, userid);
    } else if (req.url.startsWith('/api/user/password/') && req.method === 'PUT') {
        const userid = req.url.split('/').pop();
        controller.changeUserPassword(req, res, userid);
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
    } else if (req.url === '/api/actors' && req.method === 'POST') { 
        controller.addActor(req, res);
    } else if (req.url === '/api/actors' && req.method === 'GET') {
        controller.getActors(req, res);
    } else if (req.url.startsWith('/api/actors/') && req.method === 'GET') {
        const id = req.url.split('/').pop();
        controller.getActorById(req, res, id);
    } else if (req.url.startsWith('/api/actor/movies/') && req.method === 'GET') {
        const id = req.url.split('/').pop();
        console.log(id);
        controller.getMoviesByActorId(req, res, id);
    } else if(req.url.match(/^\/api\/resources\/images\/([a-zA-Z0-9-_.(){}[\]!@#$%^&~]+)\.(jpg|jpeg|png|gif)$/) && req.method === 'GET'){
        controller.getImage(req, res, req.url.split('/')[4]);
    } else if(req.url.match(/^\/api\/resources\/image\/movie\/([a-zA-Z0-9-_.(){}[\]!@#$%^&~]+)\.(jpg|jpeg|png|gif)$/) && req.method === 'GET'){
        controller.getMovieImage(req, res, req.url.split('/')[5]);
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
