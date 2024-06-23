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

async function getActors(req, res) {
    console.log("Fetching actors!");

    try {
        const actors = await Model.getActors();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(actors));
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

async function addActor(req, res, name, details, birthday, deathday, birthplace, knownfor, image) {
    console.log("Controller!");

    if (!name || !details || !birthday || !birthplace || !knownfor) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "Missing fields"}));
        res.end();
        return;
    }
 
    const newActor = await Model.addActor(name, details, birthday, deathday, birthplace, knownfor, image);

    if(newActor){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "Actor added!"}));
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "Failed to add actor"}));
        res.end();
    }
}

async function getActors(req, res) {
    console.log("Controller!");

    try {
        const actors = await Model.findAllActors();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(actors));
        res.end();
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'Internal Server Error' }));
        res.end();
    }
}

async function getActorById( req, res, id) {
    console.log("get actor by id Controller!");

    try {
        const actor = await Model.findActorById(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(actor));
        res.end();
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'Internal Server Error' }));
        res.end();
    }
}

async function getImage(req, res, imageName) {

    try {
        const image = await Model.getImage(imageName, res);

        if (image.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: "Image not found!" }));
        } else {

            res.writeHead(200, { 'Content-Type': 'image/jpg' })
            res.end(image)
        }
    } catch (error) {
        console.log(error)
    }

}

async function addActorToFavourites(req, res) {
    console.log("add to fav Controller!");

    const body = await getPostData(req);
    const username = JSON.parse(body).username;
    const actorId = JSON.parse(body).actorId;

    const user = await Model.getUserByUsername(username);
    if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "User not found"}));
        res.end();
        return;
    }

    try {
        await Model.addActorToFavourites(user.userid, actorId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "Actor added to favourites!"}));
        res.end();
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'Internal Server Error' }));
        res.end();
    }
}

async function removeActorFromFavourites(req, res) {
    console.log("Controller!");

    const body = await getPostData(req);
    const username = JSON.parse(body).username;
    const actorId = JSON.parse(body).actorId;

    const user = await Model.getUserByUsername(username);
    if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "User not found"}));
        res.end();
        return;
    }

    try {
        await Model.removeActorFromFavourites(user.userid, actorId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({message: "Actor removed from favourites!"}));
        res.end();
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'Internal Server Error' }));
        res.end();
    }
}

async function getUserFavoritesActors(req, res, username) {
    console.log(" get fav Controller!");

    try {
        const favorites = await Model.getUserFavoritesActors(username);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(favorites));
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
    register,
    getCategories,
    getYears,
    getActors,
    getSeriesCategories,
    getAwardsInfo,
    addActor,
    getActors, 
    getActorById,
    getImage,
    addActorToFavourites,
    removeActorFromFavourites,
    getUserFavoritesActors
};
