const cheerio = require("cheerio");
const axios = require("axios");

async function findPlayersInMatch() {
    try {
        const response = await axios.get("https://www.dbu.dk/resultater/kamp/193827_409842/kampinfo");
        const $ = cheerio.load(response.data);
        const classWithPlayerNames = $("div.sr--match--team-cards");

        let playerList = [];
        classWithPlayerNames.each((_, div) => {
            const tempList = $(div).text().replace(/[\t\v\f\r ]+/g, ' ').trim().split("\n");
            tempList.forEach(string => {
                if (string.trim() !== "" && string.length !== 0) {
                    playerList.push(string.trim());
                }
            });
        });

        return playerList; // Return the playerList once it's populated
    } catch (error) {
        console.error("Error fetching data:", error);
        return []; // Return an empty array if there's an error
    }
}

async function fetchDataAndPrint() {
    let playerListFromMatch = await findPlayersInMatch();
    console.log(playerListFromMatch);
    return playerListFromMatch;
}

let playerList = fetchDataAndPrint();
console.log(playerList);






const playerData = require("./player_finance.json");

function dbuNames() {
    const dbuNameList = [];

    playerData.forEach(function(player) {
        dbuNameList.push(player.dbu_name);
    });
    return dbuNameList;
}

let dbuNamesList = dbuNames();


function playerInMatch(dbuNameList, playerList) {
    playerList.forEach(player => {
        if (player.includes(dbuNameList)) {
            console.log(player);
        }
    });
}


// playerInMatch(dbuNamesList,playerList);

// console.log(dbuNamesList,playerList);