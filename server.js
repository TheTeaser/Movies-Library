'use strict';

//Importing Libraries

const express = require('express');
const cors = require('cors');
const data = require('./Movie Data/data.json');
//To use a specific data from data.json file we need to use the constructor as follows:

function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

//Saving the Express methods to the server and the common practise is to name it either server or app.

const server = express();

//We use cors to let the server accept & open for all clients requests.

server.use(cors());

//Store IP address in PORT vairable (Must be CAP) and the range should be from 3000 to 5000 as other servers have other ranges.

const PORT = 3000;



//Rounting:-

//.get() is function used to get data, since we are getting data from 'req' then we must return data using the 'res' using res.send()

server.get('/', (req, res) => {

    let moviesData = new Movie(data.title, data.poster_path, data.overview);

    res.status(200).send(moviesData);
})

server.get('/favorite', (req, res) => {
    let str = "Welcome to the favorite page";

    res.send(str);
})


//Error Handling: "MiddleWare"
function errorHandler(error, req, res) {
    const err = {
        status: 500,
        responseText: "Sorry, something went wrong"
    }
    res.status(err.status).send(err);
    console.log(err);
}

//Default route: ususally used for 404, when the client use an address that is not defined in the server, the server will check all the routes
//then if non is found, it will redirect him to here.

server.get('*', (req, res) => {

    //.status() assign a status to the response and you can check the status through: (Webpage -> Inspect -> Network tab)
    // res.status(404).send("Where you goin homeboy?");

    res.status(404).send("Page not found");

})


//Now to inform the server aobut it's port we need to call the next function which is:
//http://localhost:3000 --> (IP Address: localhost), (PORT #: 3000)
server.listen(PORT, () => {

    console.log(`Listening on ${PORT}   :   I am ready!`);
})






// server.get('*',(req,res)=>{
//     res.status(404).send("default route");
// })


//Refrences:
//  https://developer.mozilla.org/en-US/docs/Web/HTTP/Status ----  Status Codes
