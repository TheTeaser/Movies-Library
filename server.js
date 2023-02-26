'use strict';

//Importing Libraries

const express = require('express');
const server = express();

const cors = require('cors');
server.use(cors());

const data = require('./Movie Data/data.json');

const axios = require('axios'); //provide the ability to use a library of methods to send request to other APIs

const dotenv = require('dotenv')
dotenv.config();

server.use(errorHandler);

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

const PORT = 3000;

//Rounting:-

server.get('/', homeHandler)

server.get('/favorite', favHandler)

server.get('/trending', trendHandler)

server.get('/search', searchHandler)

server.get('/searchPeople', searchPeHandler)

server.get('/searchCompanies, SearchCoHandler')

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

    // const APIKey= process.env.APIKey;
    // const URL=`https://api.themoviedb.org/3/movie/popular?api_key=${APIKey}&language=en-US&page=1`;
    // let axiosRes=await axios.get(URL);
    // let mapRes= axiosRes.data.results.map((item)=>{
    //         let trendMovie=new Movie(item.id,item.title,item.release_date,item.poster_path, item.overview);
    //         return trendMovie
    //     });
    // res.send(mapRes);
    //     // console.log(axiosRes.data);
    try {
        const APIKey = process.env.APIKey;
        const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${APIKey}&language=en-US&page=1`;
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
        const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`;
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
        const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/search/person?api_key=${APIKey}&language=en-US&page=1&include_adult=false`;
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
        const APIKey = process.env.APIKey;
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


//Server Listener

server.listen(PORT, () => {

    console.log(`Listening on ${PORT}   :   I am ready!`);
})

// Page address
// https://localhost:3000/

//nodemon