const Layout = require("@podium/layout");
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

// registering the layout
const layout = new Layout({
    name: "homeLayout", // required
    pathname: "/", // required
  });

  
  const vuehead = layout.client.register({
    name: "vueHeader", // required    
    uri: `${process.env.VUEHEAD_URL}manifest.json`
  });
   
  const vueLogin = layout.client.register({
    name: "vueLogin", // required    
    uri: `${process.env.VUELOGIN_URL}manifest.json`
  });
  
  const vueHotelSearch = layout.client.register({
    name: "vueHotelSearch", // required    
    uri: `${process.env.VUEHOTELSEARCH_URL}manifest.json`
  }); 
  
  const vueHotelList = layout.client.register({
    name: "vueHotelList", // required    
    uri: `${process.env.VUEHOTELLIST_URL}manifest.json`
  }); 
  
  const vueHotelDetail = layout.client.register({
    name: "vueHotelDetail", // required    
    uri: `${process.env.VUEHOTELDETAIL_URL}manifest.json`
  });
  
  const vueFooter = layout.client.register({
    name: "vueFooter", // required    
    uri: `${process.env.VUEFOOTER_URL}manifest.json`
  });
  
 

 
  module.exports = {
    view: async function (req, res) {
        const incoming = res.locals.podium;
        //fetching the podlet data
        const [header, login, footer, search, list, detail] = await Promise.all([     
            vuehead.fetch(incoming),
            vueLogin.fetch(incoming),
            vueFooter.fetch(incoming),
            vueHotelSearch.fetch(incoming),
            vueHotelList.fetch(incoming),
            vueHotelDetail.fetch(incoming),
        ]);

        //binding the podlet data to the layout
        incoming.podlets = [ header, login, footer, search, list];
        incoming.view.title = "Home ";

        const body = `
        <div class="columns">
        <div class="column is-12">${header.content}</div>
        </div>
        <div class="columns">
            <div class="column">
                <section class="section">${search.content}</section>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <section class="section">${list.content}</section>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <section class="section">${detail.content}</section>
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
  