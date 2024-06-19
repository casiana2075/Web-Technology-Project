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

module.exports = {
    findAll,
    checkUser
};