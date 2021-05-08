const express = require('express') 
const Layout = require("@podium/layout");
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const app = express();

// registering the layout
const layout = new Layout({
    name: "homeLayout", // required
    pathname: "/", // required
  });

  // registering the vue micro frontends (podlets)
  const vuemessagepod = layout.client.register({
    name: "vueMessagePod", // required
    uri: `${process.env.VUEMESSAGEPOD_URL}manifest.json`,        
  });
  const vuereceivepod = layout.client.register({
    name: "vueReceivePod", // required    
    uri: `${process.env.VUERECEIVEPOD_URL}manifest.json`
  });

  layout.view = (incoming, body) => {
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


  module.exports = {
    view: async function (req, res) {
        const incoming = res.locals.podium;
        //fetching the podlet data
        const [sender, listener] = await Promise.all([
            vuemessagepod.fetch(incoming),
            vuereceivepod.fetch(incoming),
        ]);

        //binding the podlet data to the layout
        incoming.podlets = [sender,listener];
        incoming.view.title = "Home ";
        
        const body = `
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a class="navbar-item" href="https://bulma.io">
              <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
            </a>

            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
              <a class="navbar-item">
                Home
              </a>

              <a class="navbar-item">
                Documentation
              </a>

              <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                  More
                </a>

                <div class="navbar-dropdown">
                  <a class="navbar-item">
                    About
                  </a>
                  <a class="navbar-item">
                    Jobs
                  </a>
                  <a class="navbar-item">
                    Contact
                  </a>
                  <hr class="navbar-divider">
                  <a class="navbar-item">
                    Report an issue
                  </a>
                </div>
              </div>
            </div>

            <div class="navbar-end">
              <div class="navbar-item">
                <div class="buttons">
                  <a class="button is-primary">
                    <strong>Sign up</strong>
                  </a>
                  <a class="button is-light">
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div class="columns">
          <div class="column is-4">
            <section class="section ">${sender.content}</section>          
          </div>
          <div class="column">
            <section class="section">${listener.content}</section>
          </div>
        </div>
        `;

        const document = layout.render(incoming, body);

        res.send(document);
    }
    
};
  