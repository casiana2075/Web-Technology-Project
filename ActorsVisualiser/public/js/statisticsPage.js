import http from 'http';
import url from 'url';

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const filteredItems = JSON.parse(localStorage.getItem('filteredItems'));
        console.log('filteredItems:', filteredItems);

        if (filteredItems) {
            let responseText = '';

            filteredItems.forEach(item => {
                responseText += `${item.full_name} (${item.show}) - ${item.category}\n`;
            });

            res.end(responseText);
        } else {
            res.end('No filtered items found in localStorage.');
        }
    } else {
        res.end('Invalid request');
    }
});

server.listen(3000, () => console.log('Server running on port 3000'));