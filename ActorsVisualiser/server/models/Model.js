const pool = require('../db');

function findAll(){

    console.log("Model!");

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });

}

function checkUser(username, password){

    console.log("Model!");
    console.log(username, password);

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username,password], (err, res) => {
        if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
        });
    });
}

function getUserByEmail(email){
    console.log("Model!");
    console.log(email);

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE email = $1' , [email], (err, res) => {
        if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
        });
    });
}

function getUserByUsername(username){
    console.log("Model!");
    console.log(username);

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE username = $1' , [username], (err, res) => {
        if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
        });
    });
}

function createUser(username, password, email){
    console.log("Model!");
    console.log(username, password, email);

    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *', [username, password, email], (err, res) => {
        if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
        });
    });
}

module.exports = {
    findAll,
    checkUser,
    getUserByEmail,
    getUserByUsername,
    createUser
};