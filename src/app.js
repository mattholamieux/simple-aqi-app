const express = require('express');
const path = require('path');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const countries = require('./utils/countries');
const states = require('./utils/states');
const cities = require('./utils/cities');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'AQI Forecast'
    });
});

app.get('/search', (req, res) => {
    res.render('search', {
        title: 'Global AQI search'
    });
});

app.get('/locations', (req, res) => {
    if (req.query.state) {
        cities(req.query.state, req.query.country, (error, data = []) => {
            res.send(data);
        })
    } else if (req.query.country) {
        states(req.query.country, (error, data = []) => {
            res.send(data);
        })
    }
    else {
        countries((error, data = []) => {
            res.send(data);
        });
    }
});

app.get('/forecast', (req, res) => {

    if (!req.query.city){
        return res.send({
            error: 'you must provide a city'
        })
    };
    
    forecast(req.query.city, req.query.state, req.query.country, (error, {weather, pollution} = {}) =>{
        if (error) {
            return res.send({error})
        }
        res.send({
            weather,
            pollution
        })
    });
    
})

app.listen(port, () => {
    console.log('server is up on port ' + port);
})