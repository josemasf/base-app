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
const Layout = require("@podium/layout");

// registering the layout
const layout = new Layout({
  name: "vueLayout", // required
  pathname: "/", // required
});
layout.css({ value: 'https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css' })

app.use(layout.pathname(), layout.middleware());

/*layout.view = (incoming, body) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${incoming.view.title} holaa jalaa</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css">      
  </head>
  <body>
  ${body}
  </body>
</html>
`};
*/
// what should be returned when someone goes to the root URL
app.get("/", async (req, res) => {
  
  home.view(req, res)
});

app.get("/home", async (req, res) => {
  home.view(req, res)
});


app.set('port', port);


const server = app.listen(app.get('port'), function () {
  console.log('Servidor en puerto ' + app.get('port'));
  console.log('Ir a http://localhost:' + app.get('port'));
  console.log('MODE:' + process.env.NODE_ENV);
});