const express = require('express');
const app = express();

app.use(express.static('public'));

// Your routes go here

app.listen(3000, () => console.log('Server running on port 3000'));