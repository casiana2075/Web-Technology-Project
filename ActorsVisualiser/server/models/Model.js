const pool = require('../db');
const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const http = require('http');

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

function getCategories() {
    console.log("Model!");

    return new Promise((resolve, reject) => {
        pool.query('SELECT DISTINCT category FROM "awardsInfo"', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });
}

function getYears() {
    console.log("Model!");

    return new Promise((resolve, reject) => {
        const query = `
            SELECT year FROM (
                SELECT DISTINCT year FROM "awardsInfo" WHERE year IS NOT NULL
            ) AS distinct_years ORDER BY LENGTH(year) DESC
        `;
        pool.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });
}
function getActorsFromDb() {
    console.log("Model!");
     return new Promise((resolve, reject) =>{
     pool.query('SELECT DISTINCT full_name FROM "awardsInfo"', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
     }
    );
}


function getSeriesCategories() {
    console.log("Fetching categories containing 'series'");

    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM "awardsInfo" WHERE LOWER(category) LIKE $1';
        const params = ['%series%'];

        console.log('Executing query:', query);
        console.log('With parameters:', params);

        pool.query(query, params, (err, res) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                console.log('Query results:', res.rows);
                resolve(res.rows);
            }
        });
    });
}
function getAwardsInfo(category, year) {
    console.log("Model!");
    console.log("Category:", category);
    console.log("Year:", year);

    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM "awardsInfo" WHERE 1=1';
        const params = [];

        if (category) {
            console.log('Category before query:', category); 
            params.push(`%${category}%`);
            query += ' AND LOWER(category) LIKE LOWER($' + params.length + ')';
        }

        if (year) {
            params.push(year);
            query += ' AND year = $' + params.length;
        }
        console.log('Executing query:', query);
        console.log('With parameters:', params);

        pool.query(query, params, (err, res) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                console.log('Query results:', res.rows);
                resolve(res.rows);
            }
        });
    });
}

function addActor(name, details, birthday, deathday, birthplace, knownfor, image) {
    console.log("Model!");
    console.log(name, details, birthday, deathday, birthplace, knownfor, image);

    deathday = deathday === "" ? null : deathday;

    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO "addedActors" (actorname, details, birthday, deathday, birthplace, knownfor, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, details, birthday, deathday, birthplace, knownfor, image], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
        });
    });
}

function findAllActors() {
    console.log("Find all actors Model!");

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM "addedActors"', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });
}

function findActorById(id){
    console.log("Find actor by id Model!");

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM "addedActors" WHERE id = $1', [id], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
        });
    });
}

function getImage(imageName, res){
    return new Promise((resolve, reject) => {
        pool.query('SELECT COUNT(*) FROM "addedActors" WHERE image=$1', [imageName], function (err, result) {
            if (err) {
                reject(err);
            } else {
                if(result.rows[0].count > 0){
                    const imagePath = path.join(__dirname, '../resources/', imageName);
                    fs.readFile(imagePath, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                } else {
                    resolve(null);
                }
            }
        });
    });
}

function addActorToFavourites(userId, actorId) {
    console.log("Add Actor Model!");

    return new Promise((resolve, reject) => {
        pool.query('UPDATE "users" SET favorites = array_append(favorites, $1) WHERE userid = $2', [actorId, userId], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

function removeActorFromFavourites(userId, actorId) {
    console.log("Del Actor Model!");
    return new Promise((resolve, reject) => {
        pool.query('UPDATE "users" SET favorites = array_remove(favorites, $1) WHERE userid = $2', [actorId, userId], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

function getUserFavoritesActors(username) {
    console.log("get fav Model!");

    return new Promise((resolve, reject) => {
        pool.query('SELECT favorites FROM "users" WHERE username = $1', [username], (err, res) => {
            if (err) {
                reject(err);
            } else {
                console.log(res.rows[0].favorites);
                resolve(res.rows[0].favorites);
            }
        });
    });
}


function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => { resolve(data); });
        }).on('error', (err) => { reject(err); });
    });
}

function fetchNewsArticles(actorName) {
    const newsUrl = `http://www.google.com/search?q=${encodeURIComponent(actorName)}+news`;
    return fetchHTML(newsUrl)
        .then(html => {
            const dom = new JSDOM(html);
            const document = dom.window.document;

            const excludedKeywords = ['produs', 'hărți', 'află mai multe', 'conectează-te'];

            const articles = Array.from(document.querySelectorAll('a')).map(article => {
                return {
                    title: article.textContent.trim(),
                    link: article.href
                };
            });

            const newsArticles = articles.filter(article => 
                article.link.includes('/url?') &&
                article.title.toLowerCase().includes(actorName.toLowerCase()) &&
                !excludedKeywords.some(keyword => article.title.toLowerCase().includes(keyword))
            ).map(article => {
                return {
                    title: article.title,
                    link: cleanURL(article.link)
                };
            });

            console.log('Extracted articles:', newsArticles);

            return newsArticles;
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            return [];
        });
}

function cleanURL(url) {
    try {
        if (url.includes('/url?q=')) {
            const urlObj = new URL(url, 'http://127.0.0.1:5500'); 
            return urlObj.searchParams.get('q');
        }
    } catch (e) {
        console.error('Invalid URL:', url);
    }
    return url;
}

module.exports = {
    findAll,
    checkUser,
    getUserByEmail,
    getUserByUsername,
    createUser,
    getCategories,
    getYears,
    getActorsFromDb,
    getSeriesCategories,
    getAwardsInfo,
    addActor,
    findAllActors, 
    findActorById,
    getImage,
    addActorToFavourites,
    removeActorFromFavourites,
    getUserFavoritesActors,
    fetchNewsArticles,
    fetchHTML
};
