'use strict';

//Importing Libraries

const express = require('express');
const server = express();

const cors = require('cors');
server.use(cors());

const data = require('./Movie Data/data.json');

const axios = require('axios'); //provide the ability to use a library of methods to send request to other APIs

const dotenv = require('dotenv');
dotenv.config();

const pg=require('pg');

server.use(express.json()); //We used this middleWare functino to parse the data that was sent by the client to be shown to us.

const APIKey = process.env.APIKey;

server.use(errorHandler);

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

const PORT = 3000;

//Create OBJ from client
// DB Key= postgersql://localhost:5432/lab13 for TA Fadi
const client = new pg.Client(process.env.DATABASE_URL);


//Rounting:-

server.get('/', homeHandler)

server.get('/favorite', favHandler)

server.get('/trending', trendHandler)

server.get('/search/:title', searchHandler)

server.get('/searchPeople', searchPeHandler)

server.get('/searchCompanies', searchCoHandler)

server.post('/addFavMovie', addMovieHandler)

server.get('/addFavMovie', getMovieHandler)

server.delete('/addFavMovie/DELETE/:id', deleteFavMovieHandler) //You can put anything instead of "id" as it's just an alias.

server.put('/addFavMovie/UPDATE/:id', updateFavMovieHandler) //.put Delectes the old data and update it to the new one.

server.get('/addFavMovie/getMovie/:id', getSpecFavMovieHandler) //usual .get but it will get a specific FavMovie using a provided ID.

server.get('/error', errorHandler)

server.get('*', defaultHandler)






// Function handlers:-

function homeHandler(req, res) {
    let moviesData = new Movie(data.title, data.poster_path, data.overview);

    res.status(200).send(moviesData);
    // console.log(moviesData);
}

function favHandler(req, res) {
    let str = "Welcome to the favorite page";

    res.status(200).send(str);

    // console.log(str);

}

function trendHandler(req, res) {
    // const keyAPI='';
    //My Key for Mr Fadi testing purposes is:  4d0199f573365c7bbfd1f54a8e476d04     

   
    try {
        // const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${APIKey}&language=en-US&page=1`;
                const URL = `https://api.themoviedb.org/3/movie/popular?api_key=4d0199f573365c7bbfd1f54a8e476d04&language=en-US&page=1`;

        axios.get(URL)
            .then((result) => {
                //Code that depends on Axios function put it here
                let mapRes = result.data.results.map((item) => {
                    let trendMovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return trendMovie;
                });
                res.send(mapRes);
            })
            //Code that does not depend on Axios put it here
            .catch((error) => {
                console.log("Sorry, Something went wrong");
                res.status(500).send(err)
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }

}

function searchHandler(req, res) {
    try {
        const searchKeyword= req.params.title;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=${searchKeyword}&page=1`;
        axios.get(url)
            .then((result2) => {
                let mapRes = result2.data.results;
                res.send(mapRes);
            })
            .catch((error) => {
                res.status(500).send(error)
            })

    }
    catch (error) {
        errorHandler(error, req, res);
    }
    // console.log();

}

function searchPeHandler(req, res) {
    try {
        const url = `https://api.themoviedb.org/3/search/person?api_key=${APIKey}&language=en-US&page=1&include_adult=false`;

        //acios.get(): Sends a request to the server at the specified URL, requesting for some data.
        axios.get(url)
            .then((result3) => {
                let mapRes = result3.data.results;
                res.send(mapRes);
            })
            .catch((error) => {
                res.status(500).send(error)
            })

    }
    catch (error) {
        errorHandler(error, req, res);
    }
    // console.log();

}

function searchCoHandler(req, res) {
    try {
        const url = `https://api.themoviedb.org/3/search/company?api_key=${APIKey}&page=1`;
        axios.get(url)
            .then((result4) => {
                let mapRes = result4.data.results;
                res.send(mapRes);
            })
            .catch((error) => {
                res.status(500).send(error)
            })

    }
    catch (error) {
        errorHandler(error, req, res);
    }
    // console.log();

}

function defaultHandler(req, res) {

    res.status(404).send("Page not found");

    // console.log();

}

function getMovieHandler(req,res){
    const sql = 'SELECT * FROM movietable';
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((error) => {
            res.status(500).send(error);
    })
}

function addMovieHandler(req,res){
    
    //req.body; method used to show the data in the data bracket that was sent by the client.
    const mov=req.body; //also by defualt the body is not shown as it needs to be parsed to JSON thus added a middleware function to parse it.
    
    //
    const sql=`INSERT INTO movietable (title, overview) VALUES ($1,$2) RETURNING *;`
    const values= [mov.title,mov.overview];
    client.query(sql,values)
    // const sql=`INSERT INTO movietable (title, overview) VALUES ('${mov.title}','${mov.overview}')`;

    // client.query(sql)   
        .then((data)=>{
            res.send("Data was added successfully!");
        })

        .catch((error)=>{
            res.status(500).send(error);
        })
    
}

function deleteFavMovieHandler(req,res){
    const id =req.params.id;
    const sql=`DELETE FROM movietable WHERE id=${id}`;
    client.query(sql)
    .then((data)=>{
        res.status(204).send("Data was deleted successfully!");
    })
    .catch((error)=>{
        res.status(500).send(error);
    })
}

function updateFavMovieHandler(req,res){
    const id =req.params.id;
    const mov=req.body;
    const sql=`UPDATE movietable SET overview= '${mov.overview}'WHERE id=${id}`;
    client.query(sql)
    .then((data)=>{
        // res.status(202).send("Data was updated successfully!");
        res.status(201).send(data.rows); //Usually the front end needs to render the data the got updated and show it after the updating process, thus we send data.rows
    })
    .catch((error)=>{
        res.status(500).send(error);
    })
}

function getSpecFavMovieHandler(req,res){
    const id =req.params.id;
    const sql=`SELECT FROM movietable WHERE id=${id}`;
    client.query(sql)
    .then((data)=>{
        res.status(200).send(data.rows);
    })
    .catch((error)=>{
        res.status(500).send(error);
    })
}

//Error Handling: "MiddleWare"
function errorHandler(error, req, res,next) {
    const err = {
        status: 500,
        responseText: "Sorry, something went wrong"
    }
    res.status(500).send(err);
    next();
    // console.log(err);
}

//Connect the server with the Database (called lab13):
client.connect()
.then(()=>{

//Server Listener

server.listen(PORT, () => {

    console.log(`Listening on ${PORT}   :   I am ready!`);
})
})
// Page address
// https://localhost:3000/
// localhost:5432 is the routing port for PG.
//nodemon
