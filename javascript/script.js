const cheerio = require("cheerio");
const axios = require("axios");
let list = []; 
let tempList =[];
axios.request({
    method: "GET",
    url: "https://www.dbu.dk/resultater/kamp/193827_409842/kampinfo",
}).then(response => {
    const $ = cheerio.load(response.data); 
    //only find data inside this specefic div.
    const classWithPlayerNames = $("div.sr--match--team-cards");
    //provide all data inside the div inside a temperary list and tried to trim it as much as possible
    classWithPlayerNames.each((i, div) => {
        tempList = ($(div).text().replace(/[\t\v\f\r ]+/g, ' ').trim().split("\n"));
    });
    //trim the last part manually
    for(let i = 0; i < tempList.length; i++){
        //check if the element is a space or nothing.
        if(tempList[i].replace(/\s\t\v\f\r/, '') !== " " && tempList[i].length !== 0){
            //The provided data started with a space so just ignore the first char. 
            console.log(tempList[i][1]);
            list.push(tempList[i].slice(1));
        }
    }
    console.log(list);

});