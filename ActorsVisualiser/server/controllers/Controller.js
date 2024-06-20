
const Model = require('../models/Model');
const { getPostData } = require('../utils');

async function getUsers(req, res) {
    console.log("Controller!");

    const users = await Model.findAll();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(users));
    res.end();

}

async function login(req, res) {
    console.log("Controller!");

    const body = await getPostData(req);
    const username = JSON.parse(body).username;
    const password = JSON.parse(body).password;


    const validUser = await Model.checkUser(username, password);

    if(validUser){
        console.log("Valid user!" );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "Valid user!"}));
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "User not found"}));
        res.end();
    }
}
async function getCategories(req, res) {
    console.log("Fetching categories!");

    try {
        const categories = await Model.getCategories();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(categories));
        res.end();
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'Internal Server Error' }));
        res.end();
    }
}

async function getYears(req, res) {
    console.log("Fetching years!");

    try {
        const years = await Model.getYears();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(years));
        res.end();
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'Internal Server Error' }));
        res.end();
    }
}

async function getSeriesCategories(req, res) {
    console.log("Fetching categories containing 'series'");

    try {
        const categories = await Model.getSeriesCategories();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(categories));
        res.end();
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'Internal Server Error' }));
        res.end();
    }
}

async function getAwardsInfo(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const category = url.searchParams.get('category');
    const year = url.searchParams.get('year');
    let isSeriesFilter = false;
    if (category && category.toLowerCase().includes('series')) {
        isSeriesFilter = true;
    } else {
        isSeriesFilter = url.searchParams.get('seriesFilter') === 'true';
    }
    console.log("Fetching awards info!");
    console.log("Category:", category);
    console.log("Year:", year);
    console.log("Is Series Filter:", isSeriesFilter);

    try {
        const awardsInfo = await Model.getAwardsInfo(category, year, isSeriesFilter);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(awardsInfo));
        res.end();
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'Internal Server Error' }));
        res.end();
    }
}

module.exports = {
    getUsers,
    login,
    getCategories,
    getYears,
    getSeriesCategories,
    getAwardsInfo
};