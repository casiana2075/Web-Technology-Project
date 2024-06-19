
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

async function register(req, res) {
    console.log("Controller!");

    const body = await getPostData(req);
    const username = JSON.parse(body).username;
    const password = JSON.parse(body).password;
    const confirmPassword = JSON.parse(body).confirmPassword;
    const email = JSON.parse(body).email;

    // Validate input
    if (!username || !password || !confirmPassword || !email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "Missing fields"}));
        res.end();
        return;
    }

    if (password !== confirmPassword) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "Passwords do not match"}));
        res.end();
        return;
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "Invalid email"}));
        res.end();
        return;
    }

    const existingEmail = await Model.getUserByEmail(email);
    if (existingEmail) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "An user with this email already exists"}));
        res.end();
        return;
    }

    const existingUser = await Model.getUserByUsername(username);
    if (existingUser) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "Username already exists"}));
        res.end();
        return;
    }

    const newUser = await Model.createUser(username, password, email);
    console.log(newUser);   

    if(newUser){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "User created!"}));
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "User not created"}));
        res.end();
    }
}

module.exports = {
    getUsers,
    login,
    register
};