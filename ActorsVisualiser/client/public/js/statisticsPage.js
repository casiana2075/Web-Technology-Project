import fetch from 'node-fetch';

async function handleStatisticsPage(req, res) {
    if (req.method === 'GET') {
        try {
            const response = await fetch('http://localhost:3000/api/awardsInfo/filter');
            const filteredItems = await response.json();
            console.log('filteredItems:', filteredItems);

            if (filteredItems) {
                let responseText = '';

                filteredItems.forEach(item => {
                    responseText += `${item.full_name} (${item.show}) - ${item.category}\n`;
                });

                res.end(responseText);
            } else {
                res.end('No filtered items found.');
            }
        } catch (error) {
            console.error('Error:', error);
            res.end('Error fetching filtered items.');
        }
    } else {
        res.end('Invalid request');
    }
}

export default handleStatisticsPage;