const http = require('http');
const fs = require('fs');

function getMapName(customUrl) {
    mapObj = {
        name: "",
        pool: "",
        url: "",
        id: ""
    }
    // Query URL parameter string
    // Check that url is gucci
    // Download the map
    // Add it to the json
    try {
        workshopURL = new URL(customUrl)
    } catch (error) {
        return console.log(error.code, 'error')
    }
    console.log(workshopURL)
    workshopID = workshopURL.searchParams.get('id');
    // Load the maps synchronously here, so we can use it later in life.
    let maps = fs.readFileSync('/home/csgosrv/esfi-botti/games/maps.json')
    maps = JSON.parse(maps)
    console.log(maps);
    if (workshopURL.hostname.toLowerCase() !== 'steamcommunity.com') return "not steamcommunity"
    if (!workshopID) return "no query params"
    if (idDoesNotExist(workshopID, maps)) return "map is already on the list"

    const xFormBody = `${encodeURI('itemcount')}=${encodeURI(1)}&${encodeURI('publishedfileids[0]')}=${encodeURI(workshopID)}`;
    const options = {
        hostname: 'api.steampowered.com',
        path: '/ISteamRemoteStorage/GetPublishedFileDetails/v1',
        port: 80,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(xFormBody)
        },
        method: 'POST',
        agent: false  // Create a new agent just for this one request
    }

    const req = http.request(options, function (res) {
        let result = '';
        res.on('data', (chunk) => {
            result += chunk;
        });
        res.on('end', () => {
            result = JSON.parse(result);
            let mapName = sanitizeMapName(result.response.publishedfiledetails[0].title)
            mapObj.name = mapName
            mapObj.id = workshopID;
            mapObj.url = workshopURL.href;
            console.log(mapObj);
            fs.readFile('/home/csgosrv/esfi-botti/games/maps.json', (err, content) => {
                if (err) return console.error(err);
                const maps = JSON.parse(content);
                maps.push(mapObj);
                console.log(maps)
                /*fs.writeFile('/home/csgosrv/esfi-botti/games/maps.json', JSON.stringify(maps, undefined, 4), async err => {
                    if (err) return console.error(err);
                    console.log('done');
                })*/
            });
        })
        res.on('error', (err) => {
            console.log(err);
        })
    });

    // req error
    req.on('error', function (err) {
        console.log(err, 'error?');
    });

    //send request witht the postData form
    req.write(xFormBody);
    req.end();
}

const testUrl = "https://steamcommunity.com/sharedfiles/filedetails/?id=2077267434"

//console.log(getMapName(testUrl));

function doesNotExist(value, array) {
    console.log(array, value)
    return array.some(e => e.name.toLowerCase() === value.toLowerCase());
}

function idDoesNotExist(value, array) {
    console.log(array, value)
    return array.some(e => e.id.toLowerCase() === value.toLowerCase());
}

function sanitizeMapName(mapName) {
    let mapName2 = mapName.replace(/ /g,'-');
    mapName2 = mapName2.replace(/\(/g,'');
    mapName2 = mapName2.replace(/\)/g,'');
    mapName2 = mapName2.replace(/\|/g,'');
    mapName2 = mapName2.replace(/\[/g,'');
    mapName2 = mapName2.replace(/\]/g,'');
    return mapName2

}
/*
function paska () {
fs.readFile('/home/csgosrv/esfi-botti/games/maps.json', (err, content) => {
    const value = "Paradise"
    console.log(!doesNotExist(value, JSON.parse(content)))

})

}

paska()*/

function removeMap(mapName) {
    fs.readFile('/home/csgosrv/esfi-botti/games/maps.json', (err, content) => {
        if (err) return console.error(err);
        const maps = JSON.parse(content);
        const newMaps = maps.filter((map) => {
            console.log((map.name.toLowerCase() !== mapName.toLowerCase()) || (map.pool === 'competitive'))
        })
        console.log(newMaps, '????')
        /*fs.writeFile('/home/csgosrv/esfi-botti/games/maps.json', JSON.stringify(newMaps, undefined, 4), async err => {
            if (err) return console.error(err);
            console.log('done');
        })*/
    });

}


removeMap('de_vertigo')