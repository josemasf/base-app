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
  
  const hbsHead = layout.client.register({
    name: "hbsHead", // required    
    uri: `${process.env.HBSHEAD_URL}manifest.json`
  });
  
  const vueLogin = layout.client.register({
    name: "vueLogin", // required    
    uri: `${process.env.VUELOGIN_URL}manifest.json`
  });

 
  module.exports = {
    view: async function (req, res) {
        const incoming = res.locals.podium;
        //fetching the podlet data
        const [sender, listener, head, login] = await Promise.all([
            vuemessagepod.fetch(incoming),
            vuereceivepod.fetch(incoming),
            hbsHead.fetch(incoming),
            vueLogin.fetch(incoming),
        ]);

        //binding the podlet data to the layout
        incoming.podlets = [sender,listener, login];
        incoming.view.title = "Home ";
        
        const body = `
        <div>
        ${head.content}
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
          <div class="column is-12">Login ${login.content}</div>
        </div>
        `;

        const document = layout.render(incoming, body);

        res.send(document);
    }
    
};
  