// Server Dependencies

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');


// Dotenv Dependency (to setup environment variables)

const dotenv = require('dotenv');
dotenv.config();


// App Instance

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('website'));


// Local Server Setup

// const port = 8000;

// const server = app.listen(port, listening => {
//     console.log(`Congratulations, your server is running at port ${port}!`);
// });


// Heroku Server Setup

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, listening => {
    console.log(`Congratulations, your server is running at port ${PORT}!`);
});


// Endpoint for Weather Data

let projectData = [];


// Get Location Input and Post Custom Weather API Data

app.post('/all-data', (req, res) => {

    let locInput = req.body.location;
    console.log(`user location input: ${locInput}`);

    let customLocInput = locInput.split(' ').join('+');

    const openWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${customLocInput}&units=metric&appid=${process.env.OPENWEATHER_APP_ID}`;

    fetch (openWeatherAPI)
    .then (res => res.json())
    .then (getData => {

        if (getData.message === 'invalid zip code' || getData.message === 'city not found') {

            res.status(404).json({locValidation: 'Invalid location, please re-enter.'});
            return;

        } else {

            let newEntry = {
                loc: getData.name,
                lat: getData.coord.lat,
                lon: getData.coord.lon,
                countryCode: getData.sys.country,
                temp: getData.main.temp,
                cloudPercent: getData.clouds.all,
                cloudStatus: getData.weather[0].description,
                wind: getData.wind.speed,
                visibility: getData.visibility,
                humidity: getData.main.humidity,
                feeling: req.body.feel
            }

            projectData.unshift(newEntry);
            res.send(projectData);

        }

    })

});


// Get All Data

app.get('/project-data', (req, res) => {
    res.send(projectData);
});