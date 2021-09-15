//import {handlerUriService} from './podlets'
const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname,`.env.${ process.env.NODE_ENV}`)
});

const port = process.env.PORT || 3000;

const home = require('./routes/home');
const hotels = require('./routes/hotels');
const categories = require('./routes/categories');

const Layout = require("@podium/layout");

// registering the layout
const layout = new Layout({
  name: "vueLayout", // required
  pathname: "/", // required
});
layout.css({ value: 'https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css' })
layout.css({ value: 'https://use.fontawesome.com/releases/v5.2.0/css/all.css' })
layout.css({ value: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css' })

app.use(layout.pathname(), layout.middleware());

// what should be returned when someone goes to the root URL
app.get("/", async (req, res) => {  
  home.view(req, res)
});
app.get("/hotels", async (req, res) => {  
  hotels.view(req, res)
});
app.get("/categories", async (req, res) => {  
  categories.view(req, res)
});



app.set('port', port);


const server = app.listen(app.get('port'), function () {
  console.log('Servidor en puerto ' + app.get('port'));
  console.log('Ir a http://localhost:' + app.get('port'));
  console.log('MODE:' + process.env.NODE_ENV);
});