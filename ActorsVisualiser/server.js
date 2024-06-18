import http from 'http';
import url from 'url';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import handleHomePage from './public/js/homePage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    switch (true) {
        case pathname === '/':
        case pathname === '/api/awardsInfo':
            handleHomePage(req, res);
            break;
        case pathname.startsWith('/public/css/'):
            const cssPath = path.join(__dirname, pathname);
            fs.readFile(cssPath, (err, data) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/css'});
                    res.end(data);
                }
            });
            break;
            case pathname.startsWith('/public/resources/'):
    const imagePath = path.join(__dirname, pathname);
    fs.readFile(imagePath, (err, data) => {
        if (err) {
            console.error(err);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal Server Error');
        } else {
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(data);
        }
    });
    break;
    case pathname.startsWith('/views/statiscticsPage.html'):
        default:
            res.writeHead(404);
            res.end('Not found');
            break;
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});