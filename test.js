let asd = "absr / 0 () - gfdaj ölafg[ ]|";


function sanitizeMapName(mapName) {
    let mapName2 = mapName.replace(/ /g, '-');
    mapName2 = mapName2.replace(/\(/g, '');
    mapName2 = mapName2.replace(/\)/g, '');
    mapName2 = mapName2.replace(/\|/g, '');
    mapName2 = mapName2.replace(/\[/g, '');
    mapName2 = mapName2.replace(/\]/g, '');
    return mapName2
}
function samSanitize(mapName) {
    let mapName2 = mapName.replace(/[[\]()|]/g, '');
    mapName2 = mapName2.replace(/ /g, '-')
    return mapName2;
}

function horrifyingSanitation(mapName) {
    let i = 0;
    let mapName2 = []
    let newMapName3 = []
    for(i; i < mapName.length; i++) {
        
        if(mapName[i] === ' ') { 
            mapName2.push('-')
            if (mapName2[mapName2.length-2] !== "-" && mapName2[mapName2.length -1] !== "-" ) {  } else { newMapName3 = mapName2.pop()} 
        } else if (mapName[i] === "(") {
            continue;
        } else if (mapName[i] === "(") {
            continue;
        } else if (mapName[i] === ")") {
            continue;
        } else if (mapName[i] === "[") {
            continue;
        } else if (mapName[i] === "]") {
            continue;
        } else if (mapName[i] === "\\") {
            continue;
        } else if (mapName[i] === "|") {
            continue;
        } else {
            console.log(mapName2)
            console.log(newMapName3)
            mapName2.push(mapName[i])
        } 
    } 
    return mapName2.join('');
}

console.log('Input')
console.log(asd)
console.log('Output')
//console.log('Sams Hack: ', samSanitize(asd))
console.log('Tims Hack: ', sanitizeMapName(asd))
console.log('Tims Hack: ', horrifyingSanitation(asd))