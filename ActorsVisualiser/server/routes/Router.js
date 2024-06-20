const controller = require('../controllers/Controller');

const router = (req,res) => {

    console.log("Router!");

    if (req.url === '/api/users' && req.method === 'GET') {

        controller.getUsers(req,res);

    } else if(req.url === '/api/login' && req.method === 'POST') {

        controller.login(req,res);
    console.log("Login!");

    } else if (req.url === '/api/users' && req.method === 'POST') {

        controller.register(req,res);
        
    }else  if (req.url.startsWith('/api/awardsInfo') && req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const category = url.searchParams.get('category');
        const year = url.searchParams.get('year');     
         controller.getAwardsInfo(req, res, category, year);
    } else if (req.url === '/api/categories' && req.method === 'GET') {
        controller.getCategories(req, res);
    } else if (req.url === '/api/years' && req.method === 'GET') {
        controller.getYears(req, res);
    }else  if (req.url.startsWith('/api/seriesCategories') && req.method === 'GET') {
        controller.getSeriesCategories(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h1>Page not found</h1>');
        res.end();
    }

}

module.exports = router;