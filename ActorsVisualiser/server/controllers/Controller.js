
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


module.exports = {
    getUsers,
    login
};