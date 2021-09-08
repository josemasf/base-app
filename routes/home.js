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
  
  const vuehead = layout.client.register({
    name: "vueHeader", // required    
    uri: `${process.env.VUEHEAD_URL}manifest.json`
  });
   
  const vueLogin = layout.client.register({
    name: "vueLogin", // required    
    uri: `${process.env.VUELOGIN_URL}manifest.json`
  });
  
  const vueFooter = layout.client.register({
    name: "vueFooter", // required    
    uri: `${process.env.VUEFOOTER_URL}manifest.json`
  });

 
  module.exports = {
    view: async function (req, res) {
        const incoming = res.locals.podium;
        //fetching the podlet data
        const [sender, listener, header, login, footer] = await Promise.all([
            vuemessagepod.fetch(incoming),
            vuereceivepod.fetch(incoming),
            vuehead.fetch(incoming),
            vueLogin.fetch(incoming),
            vueFooter.fetch(incoming),
        ]);

        //binding the podlet data to the layout
        incoming.podlets = [ header,sender,listener, login, footer];
        incoming.view.title = "Home ";

        const body = `
        <div class="columns">
        <div class="column is-12">${header.content}</div>
        </div>
       
        <div class="columns">
          <div class="column is-4">
            <section class="section ">${sender.content}</section>          
          </div>
          <div class="column">
            <section class="section">${listener.content}</section>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <section class="section">${footer.content}</section>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <section class="section">${login.content}</section>
          </div>
        </div>
        
        `;

        const document = layout.render(incoming, body);

        res.podiumSend(document);
    }
    
};
  